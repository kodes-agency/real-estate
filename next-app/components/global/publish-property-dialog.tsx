"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { PublishPropertyForm } from "@/components/forms/publish-property-form";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GoldButton } from "../ui/gold-button";
import { Link } from "lucide-react";
import { GoldLine } from "../ui/gold-line";
// import { Plus } from "@phosphor-icons/react";

type Option = {
  id: number;
  title: string;
  [key: string]: any;
};

type PublishPropertyDialogProps = {
  categories: Option[];
  className?: string;
  mode?: "evaluation" | "client-sale";
  triggerLabel?: string;
  triggerVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  icon?: React.ReactNode;
};

export function PublishPropertyDialog({
  categories,
  className,
  mode = "client-sale",
  triggerLabel = "Добави имот",
  triggerVariant = "default",
  icon,
}: PublishPropertyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="cursor-pointer">
        {icon ? (
          <GoldButton
            onClick={() => setOpen(true)}
            borderWidth={2}
            className={cn(
              "flex items-center justify-center text-white hover:shadow-lg/40 transition-all ease-in-out bg-foreground shadow-md/20 font-medium rounded-lg hover:bg-foreground cursor-pointer h-12 px-6! duration-300  ",
              className,
            )}
          >
            {triggerLabel}
            {icon}
          </GoldButton>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className={cn("cursor-pointer", className)}
          >
            {triggerLabel}
            <GoldLine className="h-0.5 opacity-0 group-hover:opacity-100 transition-all ease-in-out w-0 group-hover:w-full duration-300" />
          </button>
        )}
      </div>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col w-full h-dvh sm:h-[85vh] sm:max-w-5xl p-0 gap-0 overflow-hidden sm:rounded-4xl rounded-none"
      >
        <div className="absolute top-4 right-4 z-50">
          <DialogClose
            render={
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full shadow-sm bg-background border hover:bg-muted"
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x h-4 w-4"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            }
          />
        </div>
        <PublishPropertyForm
          categories={categories}
          mode={mode}
          className="h-full w-full"
        />
      </DialogContent>
    </Dialog>
  );
}
