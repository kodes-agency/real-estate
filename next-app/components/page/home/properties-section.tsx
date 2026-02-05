"use client";

import AnimatedContent from "@/components/AnimatedContent";
import { PropertyCard } from "@/components/page/property-archive/card";
import { GoldLine } from "@/components/ui/gold-line";
import { HomePage, Property } from "@/payload-types";

export const PropertiesSection = ({
  properties,
  text,
}: {
  properties: Property[];
  text: { title: string; subtitle: string };
}) => {
  return (
    <section className="px-5 md:px-10 lg:px-14 py-10 md:py-20 ">
      <AnimatedContent
        distance={100}
        direction="vertical"
        reverse={false}
        duration={0.8}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        scale={1}
        threshold={0.1}
        delay={0}
      >
        <div className="bg-foreground rounded-2xl p-6 md:p-10 shadow-2xl/40">
          <div className="flex md:flex-row flex-col-reverse gap-4 md:gap-0 justify-between md:items-end">
            <p className="max-w-md text-lg text-white">{text.subtitle}</p>
            <h2 className="text-4xl font-medium font-marlet text-white">
              {text.title}
            </h2>
          </div>
          <GoldLine className="w-full h-0.5 mt-2" />
        </div>
      </AnimatedContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};
