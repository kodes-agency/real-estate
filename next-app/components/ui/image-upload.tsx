"use client";

import {
  File,
  FileImage,
  FileSpreadsheet,
  X,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface ImageFile {
  id: string;
  file: File;
  progress: number;
  uploading: boolean;
  preview: string;
}

interface ImageUploadProps {
  maxFiles?: number;
  maxSize?: number; // bytes
  accept?: string;
  className?: string;
  initialFiles?: File[];
  onImagesChange?: (files: File[]) => void;
}

export function ImageUpload({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = "image/*",
  className,
  initialFiles = [],
  onImagesChange,
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with initialFiles
  useEffect(() => {
    if (initialFiles.length > 0 && images.length === 0) {
      const newImages = initialFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        progress: 100,
        uploading: false,
        preview: URL.createObjectURL(file),
      }));
      setImages(newImages);
    }
  }, [initialFiles]);

  const handleFile = useCallback(
    (files: FileList | File[] | null) => {
      if (!files) return;

      const fileList = Array.from(files);
      const newImages: ImageFile[] = [];

      fileList.forEach((file) => {
        // Validate type
        if (!file.type.startsWith("image/")) {
          toast.error(`File ${file.name} is not an image.`);
          return;
        }
        // Validate size
        if (file.size > maxSize) {
          toast.error(`File ${file.name} exceeds size limit.`);
          return;
        }

        // Add to list
        newImages.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          progress: 0,
          uploading: true,
          preview: URL.createObjectURL(file),
        });
      });

      if (images.length + newImages.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed.`);
        return;
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);

        // Notify parent with plain File objects
        onImagesChange?.(updatedImages.map((img) => img.file));

        // Simulate progress for each new file
        newImages.forEach((img) => {
          const interval = setInterval(() => {
            setImages((prev) => {
              return prev.map((item) => {
                if (item.id === img.id) {
                  const newProgress = item.progress + 10;
                  if (newProgress >= 100) {
                    clearInterval(interval);
                    return { ...item, progress: 100, uploading: false };
                  }
                  return { ...item, progress: newProgress };
                }
                return item;
              });
            });
          }, 200);
        });
      }
    },
    [images, maxFiles, maxSize, onImagesChange],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    handleFile(event.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    const item = images.find((i) => i.id === id);
    if (item) URL.revokeObjectURL(item.preview);
    const updated = images.filter((i) => i.id !== id);

    setImages(updated);
    onImagesChange?.(updated.map((i) => i.file));

    // Reset input if empty to allow re-selecting same file if needed (though multi-file helps)
    if (updated.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex justify-center rounded-md border mt-2 border-dashed border-input px-6 py-12 transition-colors",
          isDragOver ? "bg-muted/50 border-primary" : "",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <UploadCloud
            className="mx-auto h-12 w-12 text-muted-foreground"
            aria-hidden={true}
          />
          <div className="mt-4 flex flex-wrap text-sm leading-6 text-muted-foreground justify-center">
            <p>Плъзнете и пуснете или</p>
            <label
              htmlFor="file-upload-04"
              className="relative cursor-pointer rounded-sm pl-1 font-medium text-black hover:underline hover:underline-offset-4"
            >
              <span>изберете файл</span>
              <input
                id="file-upload-04"
                name="file-upload-04"
                type="file"
                className="sr-only"
                accept={accept}
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
            <p className="pl-1">за да качите</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Изображения (JPG, PNG) до {formatFileSize(maxSize)}
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-6 space-y-4">
          {images.map((img) => (
            <Card key={img.id} className="relative bg-muted p-4 gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Remove"
                onClick={() => removeFile(img.id)}
              >
                <X className="h-5 w-5 shrink-0" aria-hidden={true} />
              </Button>

              <div className="flex items-center space-x-2.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-border overflow-hidden">
                  <img
                    src={img.preview}
                    alt={img.file.name}
                    className="h-full w-full object-cover"
                  />
                </span>
                <div>
                  <p className="text-xs font-medium text-foreground max-w-[200px] truncate">
                    {img.file.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatFileSize(img.file.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-2">
                <Progress value={img.progress} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {img.progress}%
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
