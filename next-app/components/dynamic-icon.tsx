"use client";

import { IconProps } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

interface DynamicIconProps extends Omit<IconProps, "name"> {
  name?: string | null;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const [IconComponent, setIconComponent] =
    useState<React.ComponentType<IconProps> | null>(null);

  useEffect(() => {
    if (!name) return;

    const loadIcon = async () => {
      try {
        const lib = await import("@phosphor-icons/react");
        const Icon = (lib as any)[name];
        if (Icon) {
          setIconComponent(() => Icon);
        } else {
          console.warn(`Icon "${name}" not found in @phosphor-icons/react`);
        }
      } catch (error) {
        console.error("Failed to load icon library:", error);
      }
    };

    loadIcon();
  }, [name]);

  if (!name || !IconComponent) return null;

  return <IconComponent {...props} />;
};
