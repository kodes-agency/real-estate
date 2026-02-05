"use client";
import { DynamicIcon } from "@/components/dynamic-icon";
import { Separator } from "@/components/ui/separator";
import { getCollectionData } from "@/lib/utils";
import {
  ArrowsOutIcon,
  CardsThreeIcon,
  HashIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
import dynamic from "next/dynamic";

interface PropertyFeaturesProps {
  size: number;
  location: string;
  id: number;
  category: string;
  features?:
    | {
        feature: any; // Allow relaxed type to match Payload generation
        value: string;
        id?: string | null;
        icon?: string | null;
      }[]
    | null;
}

export function PropertyFeatures({
  size,
  id,
  category,
  features,
  location,
}: PropertyFeaturesProps) {
  const formattedSize = `${size} м²`;

  return (
    <div className=" grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2">
      {/* Core Details */}
      <div className="bg-foreground rounded-md p-4 text-white flex flex-col gap-1 items-center justify-start shadow-2xl/30">
        <HashIcon className="text-primary" size={25} />
        <p className="text-white text-xs text-center mb-1">Обява №:</p>
        <p className="text-white text-xs text-center font-semibold">{id}</p>
      </div>
      <div className="bg-foreground rounded-md p-4 text-white flex flex-col gap-1 items-center justify-start shadow-2xl/30">
        <MapPinIcon className="text-primary" size={25} />
        <p className="text-white text-xs text-center mb-1">Местоположение:</p>
        <p className="text-white text-xs text-center font-semibold">
          {location}
        </p>
      </div>
      <div className="bg-foreground rounded-md p-4 text-white flex flex-col gap-1 items-center justify-start shadow-2xl/30">
        <CardsThreeIcon className="text-primary" size={25} />
        <p className="text-white text-xs text-center mb-1">Категория:</p>
        <p className="text-white text-xs text-center font-semibold">
          {category}
        </p>
      </div>
      {size !== 0 && (
        <div className="bg-foreground rounded-md p-4 text-white flex flex-col gap-1 items-center justify-start shadow-2xl/30">
          <ArrowsOutIcon className="text-primary" size={25} />
          <p className="text-white text-xs text-center mb-1">Площ:</p>
          <p className="text-white text-xs text-center font-semibold">
            {formattedSize}
          </p>
        </div>
      )}

      {/* Dynamic Features */}
      {features &&
        features.map((item, index) => {
          return (
            <div
              key={index}
              className="bg-foreground rounded-md p-4 text-white flex flex-col gap-1 items-center justify-start shadow-2xl/30"
            >
              <DynamicIcon
                name={item.icon || (item.feature as any)?.icon}
                className="text-primary"
                size={25}
              />
              <p className="text-white text-xs text-center mb-1">
                {item.feature.title}:
              </p>

              <p className="text-white text-xs text-center font-semibold">
                {item.value}
              </p>
            </div>
          );
        })}
    </div>
  );
}
