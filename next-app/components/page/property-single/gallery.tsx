"use client";

import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import Image from "next/image";
import { Media } from "@/payload-types";

interface PropertyGalleryProps {
  images: (Media | number | null | undefined)[] | null | undefined;
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  if (!images || images.length === 0) return null;

  // Filter valid images and ensure they are objects
  const validImages = images.filter(
    (img): img is Media => !!img && typeof img === "object" && !!img.url,
  );

  if (validImages.length === 0) return null;

  const mainImage = validImages[0];
  const sideImages = validImages.slice(1, 4); // Get next 3 images for side column
  const remainingCount = Math.max(0, validImages.length - 4); // Calculate remaining for overlay on the last side image

  // Helper to render Item
  const renderItem = (
    img: Media,
    isOverlay: boolean = false,
    overlayCount: number = 0,
  ) => (
    <Item
      key={img.id}
      original={img.url || ""}
      thumbnail={img.thumbnailURL || img.url || ""}
      width={img.width || 1200}
      height={img.height || 800}
      alt={img.alt || "Property Image"}
    >
      {({ ref, open }) => (
        <>
          <Image
            ref={ref as any}
            onClick={open}
            src={img.url || ""}
            alt={img.alt || "Property Image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isOverlay && overlayCount > 0 && (
            <div
              className="absolute inset-0 bg-foreground/70 flex items-center justify-center text-white font-light text-4xl hover:bg-black/40 transition-colors pointer-events-none"
              onClick={(e) => {
                e.stopPropagation();
                open(e as any);
              }}
            >
              +{overlayCount}
            </div>
          )}
        </>
      )}
    </Item>
  );

  return (
    <Gallery>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[500px]">
        {/* Main Image - Takes 3 columns on desktop */}
        <div className="md:col-span-3 relative h-[300px] md:h-full w-full overflow-hidden rounded-md bg-muted cursor-pointer group ">
          {renderItem(mainImage)}
        </div>

        {/* Side Images - Takes 1 column, stacked vertically. Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-col gap-4 h-full">
          {sideImages.map((img, index) => {
            const isLast = index === sideImages.length - 1;
            return (
              <div
                key={img.id}
                className="relative flex-1 overflow-hidden rounded-md bg-muted cursor-pointer group "
              >
                {renderItem(img, isLast && remainingCount > 0, remainingCount)}
              </div>
            );
          })}
          {/* If there are fewer than 3 side images, we might want to fill space or let them stretch. Flex-1 handles stretching. */}
          {sideImages.length === 0 && (
            <div className="flex-1 bg-muted rounded-md"></div>
          )}
        </div>

        {/* Mobile / Fallback Grid for side images (visible only on small screens) */}
        {sideImages.length > 0 && (
          <div className="grid grid-cols-3 gap-4 md:hidden">
            {sideImages.map((img, index) => {
              const isLast = index === sideImages.length - 1;
              return (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-md bg-muted cursor-pointer group"
                >
                  {renderItem(
                    img,
                    isLast && remainingCount > 0,
                    remainingCount,
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Hidden items for the rest of the gallery */}
        <div className="hidden">
          {validImages.slice(4).map((img) => (
            <Item
              key={img.id}
              original={img.url || ""}
              thumbnail={img.thumbnailURL || img.url || ""}
              width={img.width || 1200}
              height={img.height || 800}
              alt={img.alt || "Property Image"}
            >
              {({ ref, open }) => <span ref={ref as any} onClick={open} />}
            </Item>
          ))}
        </div>
      </div>
    </Gallery>
  );
}
