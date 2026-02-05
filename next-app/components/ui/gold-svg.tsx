"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import * as React from "react";

interface GoldSvgProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
}

export function GoldSvg({ className, style, src, ...props }: GoldSvgProps) {
  return (
    <motion.div
      className={cn("inline-block", className)}
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
        maskImage: `url('${src}')`,
        WebkitMaskImage: `url('${src}')`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
      {...(props as any)}
    />
  );
}
