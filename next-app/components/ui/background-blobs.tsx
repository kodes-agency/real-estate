"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundBlobsProps {
  /**
   * Array of colors for the blobs.
   * If strictly fewer blobs than colors are desired, set blobCount explicitly.
   * If more blobs than colors are requested, colors will be cycled.
   */
  colors?: string[];
  /**
   * Number of blobs to render.
   * Defaults to the length of the colors array if not provided, or 3.
   */
  blobCount?: number;
  /**
   * Base frequency for the SVG turbulence noise.
   * Controls the "graininess" of the noise.
   */
  baseFrequency?: number;
  className?: string;
  /**
   * Background color of the container.
   * Defaults to "bg-neutral-900" if not specified.
   */
  backgroundColor?: string;
  /**
   * Optional array of specific blob configurations.
   * If provided, `colors` and `blobCount` are ignored.
   */
  blobs?: {
    color: string;
    /**
     * Size of the blob (e.g., "40vw", "500px").
     * Defaults to "40vw".
     */
    size?: string;
    /**
     * Animation duration in seconds.
     * Defaults to random (20-35s).
     */
    speed?: number;
  }[];
  /**
   * Opacity of the noise layer.
   * Defaults to 0.4.
   */
  noiseOpacity?: number;
  /**
   * Opacity of the blobs (0 to 1).
   * Defaults to 0.6.
   */
  blobOpacity?: number;
  /**
   * Content to render on top of the blobs.
   */
  children?: React.ReactNode;
}

export const BackgroundBlobs = ({
  colors = ["#ff0000", "#00ff00", "#0000ff"],
  blobCount,
  baseFrequency = 0.65,
  className,
  noiseOpacity = 0.4,
  backgroundColor,
  blobs: providedBlobs,
  blobOpacity = 0.6,
  children,
}: BackgroundBlobsProps) => {
  /* Optimization: Generate noise using Canvas instead of SVG filter */
  const [noiseUrl, setNoiseUrl] = React.useState<string>("");

  React.useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Use a slightly larger canvas for better grain resolution
      const size = 256;
      canvas.width = size;
      canvas.height = size;

      const imageData = ctx.createImageData(size, size);
      const buffer32 = new Uint32Array(imageData.data.buffer);
      const len = buffer32.length;

      for (let i = 0; i < len; i++) {
        // Generate softer, grayscale noise
        // Alpha between 10-30 (hex 0A-1E) for subtle effect
        const alpha = Math.floor(Math.random() * 20) + 10;
        // Use little-endian ABGR: alpha is the highest byte
        buffer32[i] = (alpha << 24) | 0x000000;
      }

      ctx.putImageData(imageData, 0, 0);
      setNoiseUrl(canvas.toDataURL());
    } catch (e) {
      console.error("Failed to generate noise", e);
    }
  }, []);

  const count = providedBlobs
    ? providedBlobs.length
    : (blobCount ?? colors.length);

  const [blobs, setBlobs] = React.useState<
    {
      id: number;
      color: string;
      size: string;
      initialX: number;
      initialY: number;
      moveX: string[];
      moveY: string[];
      duration: number;
    }[]
  >([]);

  React.useEffect(() => {
    const newBlobs = Array.from({ length: count }).map((_, i) => {
      const provided = providedBlobs?.[i];
      // If provided config exists, use it. Otherwise fall back to defaults/randoms.
      const color = provided?.color ?? colors[i % colors.length];
      const size = provided?.size ?? "40vw";
      const duration = provided?.speed ?? 20 + Math.random() * 15;

      return {
        id: i,
        color,
        size,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        moveX: [
          `${Math.random() * 100}vw`,
          `${Math.random() * 100}vw`,
          `${Math.random() * 100}vw`,
        ],
        moveY: [
          `${Math.random() * 100}vh`,
          `${Math.random() * 100}vh`,
          `${Math.random() * 100}vh`,
        ],
        duration,
      };
    });
    setBlobs(newBlobs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, JSON.stringify(colors), JSON.stringify(providedBlobs)]);

  const containerStyle = backgroundColor ? { backgroundColor } : undefined;

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden",
        !backgroundColor && "bg-neutral-900",
        className,
      )}
      style={containerStyle}
    >
      {/* Blobs Layer: Extend beyond viewport to avoid clipping edges */}
      <div className="absolute -inset-[100px] blur-[80px] md:blur-[120px]">
        {blobs.map((blob) => (
          <motion.div
            key={blob.id}
            className="absolute rounded-full mix-blend-screen will-change-transform"
            style={{
              opacity: blobOpacity,
              backgroundColor: blob.color,
              width: blob.size,
              height: blob.size,
              // Center the blob relative to its position
              left: `calc(0px - ${blob.size} / 2)`,
              top: `calc(0px - ${blob.size} / 2)`,
            }}
            initial={{
              x: `${blob.initialX}vw`,
              y: `${blob.initialY}vh`,
            }}
            animate={{
              x: blob.moveX,
              y: blob.moveY,
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Noise Overlay - Canvas Texture */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          backgroundImage: noiseUrl ? `url(${noiseUrl})` : undefined,
          opacity: noiseOpacity,
        }}
      />

      {/* Children Content */}
      {children && <div className="relative z-20 h-full">{children}</div>}
    </div>
  );
};
