"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import Link from "next/link";

interface GoldButtonProps extends React.ButtonHTMLAttributes<
  HTMLButtonElement | HTMLAnchorElement | HTMLDivElement
> {
  children: React.ReactNode;
  borderWidth?: number;
  as?: "button" | "link" | "div";
  href?: string;
}

const MotionLink = motion.create(Link);

export const GoldButton = React.forwardRef<HTMLElement, GoldButtonProps>(
  (
    { className, children, borderWidth = 4, as = "button", href, ...props },
    ref,
  ) => {
    let Component: any;

    if (as === "link" && href) {
      Component = MotionLink;
    } else if (as === "div") {
      Component = motion.div;
    } else {
      Component = motion.button;
    }

    return (
      <Component
        ref={ref as any}
        href={as === "link" ? href : undefined}
        className={cn(
          // Use default button shape/size styles
          // Override for gold effect
          "relative overflow-hidden border-none text-foreground font-bold hover:opacity-90 transition-opacity bg-transparent hover:bg-transparent flex items-center justify-center p-2 md:p-3",
          className,
        )}
        // Pass style prop to allow override
        style={props.style}
        // Use standard button props but allow framer-motion props
        {...(props as any)}
      >
        {/* Animated Gold Border Layer */}
        <motion.span
          className="absolute inset-0 z-0 pointer-events-none"
          animate={{
            backgroundPosition: ["0% 50%", "-100% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background:
              "linear-gradient(90deg, #C5A059, #E6C275, #F7D486, #FFFACD, #E6C275, #C5A059, #C5A059, #E6C275, #F7D486, #FFFACD, #E6C275, #C5A059)",
            backgroundSize: "200% auto",
            padding: `${borderWidth}px`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            borderRadius: "inherit",
          }}
        />

        {/* Content */}
        {/* Content */}
        {as === "button" ? (
          <span className="relative z-10 flex items-center gap-2">
            {children}
          </span>
        ) : (
          <div className="relative z-10 flex items-center gap-2">
            {children}
          </div>
        )}
      </Component>
    );
  },
);
GoldButton.displayName = "GoldButton";
