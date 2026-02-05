"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisitRequestForm } from "@/components/forms/visit-request-form";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GoldButton } from "@/components/ui/gold-button";

type VisitRequestDialogProps = {
  propertyId: string;
  propertyTitle: string;
};

export function VisitRequestDialog({
  propertyId,
  propertyTitle,
}: VisitRequestDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <GoldButton
            borderWidth={2}
            className="text-white text-sm w-full font-medium whitespace-nowrap rounded-md h-10"
          >
            Заявете оглед
          </GoldButton>
        }
      />
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-2 md:p-4 rounded-2xl!">
        <VisitRequestForm propertyId={propertyId} />
      </DialogContent>
    </Dialog>
  );
}
