"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import * as React from "react";

interface GoldTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function GoldText({
  className,
  style,
  children,
  ...props
}: GoldTextProps) {
  return (
    <motion.span
      className={cn(
        "text-transparent bg-clip-text bg-300% animate-gradient",
        // We use framer-motion for the specific seamless loop control, so we don't strictly need 'animate-gradient' class if we animate manual values,
        // but let's stick to the exact same motion logic as the button for consistency.
        className,
      )}
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
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        display: "inline-block", // Ensures transform/animation works well, though background-clip works on inline too.
        // inline-block is often safer for background animations on text to avoid line-break glitches with gradients,
        // but standard inline might be desired.
        // Let's stick to default span display (inline) but the user can override with className="block" or "inline-block" if needed.
        // Actually for background-position animation on text wrapped across lines, it can be tricky.
        // Let's force inline-block if it's short text, but for long text 'inline' is better.
        // I'll make it default 'inline' via span, removing explicit display unless they add it.
        // Wait, 'background-clip: text' works on 'inline'.
      }}
      {...(props as any)}
    >
      {children}
    </motion.span>
  );
}
