"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Property } from "@/payload-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ShareIcon } from "@phosphor-icons/react/dist/ssr";
import {
  EmailShareButton,
  FacebookShareButton,
  FacebookMessengerShareButton,
  ViberShareButton,
  WhatsappShareButton,
  FacebookIcon,
  EmailIcon,
  WhatsappIcon,
  ViberIcon,
  FacebookMessengerIcon,
} from "react-share";
import { ExportIcon } from "@phosphor-icons/react";

export const ShareContainer = ({ property }: { property: Property }) => {
  const url = "http://localhost:3000/imoti/" + property.slug;
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button className="rounded-sm cursor-pointer border-none bg-background flex gap-1 items-center text-sm tracking-tight font-medium">
            <ExportIcon size={20} />
            Сподели
          </button>
        }
      ></PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex flex-row items-center justify-between bg-background shadow-none"
      >
        <FacebookShareButton url={url}>
          <FacebookIcon className="" size={32} round />
        </FacebookShareButton>
        <WhatsappShareButton url={url}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <ViberShareButton url={url}>
          <ViberIcon size={32} round />
        </ViberShareButton>
        <EmailShareButton url={url}>
          <EmailIcon size={32} round />
        </EmailShareButton>
      </PopoverContent>
    </Popover>
  );
};
