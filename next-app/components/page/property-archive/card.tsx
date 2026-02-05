"use client";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/payload-types";
import { cn, getCollectionData } from "@/lib/utils";
import { propertyPurposeSelect } from "@/types/payload-select";
import { ArrowsOutIcon, MapPinIcon, TagIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export const PropertyCard = ({ property }: { property: Property }) => {
  const image = getCollectionData(
    property?.images?.[property.images.length - 1],
  );
  const city = getCollectionData(property?.city);
  const region = getCollectionData(property?.region);
  const category = getCollectionData(property?.category);
  const tags = getCollectionData(property?.tags) || [];
  return (
    <Link className="cursor-pointer" href={`/imoti/${property.slug}`}>
      <article className="bg-background cursor-pointer shadow-2xl/10 h-full rounded-2xl overflow-hidden relative group border border-primary/10 hover:shadow-xl/20 transition-all duration-300 ">
        <Image
          src={image?.url || ""}
          alt={image?.alt || property.title || ""}
          width={500}
          height={500}
          className={cn("aspect-video object-cover object-center w-full")}
        />
        <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
          {property.purpose.map((purpose) => {
            const purposeLabel = propertyPurposeSelect.find(
              (p) => p.value === purpose,
            )?.label;
            return (
              <Badge
                className="bg-primary text-black font-medium  h-5"
                key={purpose}
              >
                {purposeLabel}
              </Badge>
            );
          })}
        </div>
        {property.isAvailable === "true" ? (
          <div className="absolute right-4 top-4 flex flex-col items-end gap-1">
            {property.isFeatured === "true" && (
              <Badge
                variant="secondary"
                className="font-medium bg-foreground text-white h-6"
              >
                Обява на фокус
              </Badge>
            )}
            {tags?.length > 0 &&
              tags?.map((tag, id) => (
                <Badge
                  key={id}
                  variant="secondary"
                  className="font-medium bg-foreground text-white h-6"
                >
                  {getCollectionData(tag)?.title}
                </Badge>
              ))}
          </div>
        ) : (
          <div className="font-medium text-white group-hover:opacity-50 transition-all duration-300  absolute  top-0 left-0 w-full aspect-video bg-foreground/5 backdrop-blur-xs uppercase flex items-center justify-center">
            <p className="text-2xl">
              {property.purpose.includes("for_sale")
                ? "Не се предлага"
                : "Не е наличен"}
            </p>
          </div>
        )}
        <div className=" rounded-b-2xl p-4 space-y-4 ">
          <div className="flex flex-row justify-between items-center gap-5">
            <p className="font-bold text-xl flex items-center gap-1">
              <TagIcon size={18} weight="bold" />
              {property.price === 0
                ? "По договаряне"
                : property.price.toLocaleString("bg-BG") + " €"}
              {!property.purpose.includes("for_sale") && property.price !== 0
                ? " /месец"
                : ""}
            </p>
            <p className="border text-black font-medium rounded-full px-2 py-1 text-xs">
              {category?.title}
            </p>
          </div>
          <header className="mb-4">
            <h3 className="text-md font-medium">{property.title}</h3>
          </header>
          <div className="flex flex-row items-center justify-between gap-5 flex-wrap">
            <p className=" flex gap-1 items-center text-sm text-foreground/70">
              <MapPinIcon size={18} />
              {city?.type === "city" ? "гр." : "с."} {city?.title},{" "}
              {region?.title}
            </p>
            {property.size !== 0 && (
              <p className=" flex gap-1 items-center text-sm text-foreground/70 text-end">
                <ArrowsOutIcon size={18} />
                {property.size} м²
              </p>
            )}
          </div>
          <div className="w-full flex items-end justify-center h-full ">
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent rounded-md group-hover:bg-black hover:bg-black hover:text-white group-hover:text-white  w-fit"
            >
              Разгледай обявата
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
};
