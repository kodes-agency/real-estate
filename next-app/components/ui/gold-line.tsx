"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import * as React from "react";

interface GoldLineProps extends React.HTMLAttributes<HTMLDivElement> {
  // We can add specific width/height props if needed, but standard style/className covers it.
  // The user asked to "adjust width, height", usually done via style={{ width: ..., height: ... }} or className.
  // We'll pass everything through via ...props.
}

export function GoldLine({ className, style, ...props }: GoldLineProps) {
  return (
    <motion.div
      className={cn("h-1 w-full", className)} // Default height 1 (4px) or 1px? Let's say h-1 (4px) to match the border thickness user liked, or just h-[1px].
      // "like a border 4px" was the previous request.
      // Often "line" implies thin. I'll default to h-px (1px) but allow override.
      // Actually, if they want "same effect", maybe they want the visible gold flow. 4px is good for that.
      // Let's default to h-[4px] to make the effect visible.
      animate={{
        backgroundPosition: ["0% 50%", "-100% 50%"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        ...style,
        background:
          "linear-gradient(90deg, #C5A059, #E6C275, #F7D486, #FFFACD, #E6C275, #C5A059, #C5A059, #E6C275, #F7D486, #FFFACD, #E6C275, #C5A059)",
        backgroundSize: "200% auto",
      }}
      {...(props as any)}
    />
  );
}
