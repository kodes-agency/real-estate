"use client";

import { ServicesPage } from "@/payload-types";
import Image from "next/image";
import { cn, getCollectionData } from "@/lib/utils";
import { GoldLine } from "@/components/ui/gold-line";
import { RichText } from "@/components/global/richtext";
export const AdditionalServicesSection = ({ page }: { page: ServicesPage }) => {
  return (
    <section className="min-h-[70vh] p-5 md:p-10 lg:p-14  flex flex-col justify-center items-center">
      <div className="w-full">
        <div className=" mb-10">
          <div className="flex md:flex-row flex-col gap-4 md:gap-0 justify-between md:items-end">
            <h2 className="text-4xl font-medium max-w-xl font-marlet text-black">
              {page.additionalServices.title}
            </h2>
            <p className="max-w-xl md:text-end text-xl text-black">
              {page.additionalServices.subtitle}
            </p>
          </div>
          <GoldLine className="w-full h-0.5 mt-2" />
        </div>
        <div className="grid gap-5 md:gap-10">
          {page.additionalServices.additionalServices?.map((principle, id) => (
            <div className="grid lg:grid-cols-3 gap-10" key={principle.id}>
              <div
                className={cn(
                  "bg-foreground lg:col-span-2 rounded-2xl md:p-10 p-5 shadow-2xl/40",
                  {
                    "order-1": id % 3 === 0,
                    "order-2": id % 2 !== 0,
                  },
                )}
              >
                <Image
                  src={getCollectionData(principle.images[0])?.url || ""}
                  alt="about"
                  width={500}
                  height={800}
                  className={cn(
                    "rounded-lg shadow-2xl/30 w-full  aspect-4/3 object-cover lg:hidden",
                    {
                      "order-2": id % 3 === 0,
                      "order-1": id % 2 !== 0,
                    },
                  )}
                />
                <div className="flex flex-col md:flex-row md:items-center md:gap-5">
                  <p className="md:text-[200px] text-[100px] font-marlet text-primary mt-2 leading-none whitespace-nowrap">
                    {id + 1}.
                  </p>
                  <h2 className="font-marlet text-white text-2xl sm:text-3xl mb-4 md:text-4xl lg:text-5xl uppercase">
                    {principle.title}
                  </h2>
                </div>
                <div className="text-white lg:pr-40 **:space-y-2! flex flex-col">
                  <p>{principle.content}</p>
                </div>
              </div>
              <Image
                src={getCollectionData(principle.images[0])?.url || ""}
                alt="about"
                width={500}
                height={800}
                className={cn(
                  "rounded-xl shadow-2xl/30 col-span-1 w-full h-full object-cover hidden lg:block",
                  {
                    "order-2": id % 3 === 0,
                    "order-1": id % 2 !== 0,
                  },
                )}
              />
            </div>
          ))}
        </div>
        <div className="grid mt-5 md:mt-10 gap-5">
          {page.additionalServices.images?.map((image, id) => (
            <Image
              key={id}
              src={getCollectionData(image)?.url || ""}
              alt="about"
              width={500}
              height={800}
              className="rounded-2xl shadow-2xl/30 w-full max-h-[60vh] aspect-4/3 md:aspect-auto object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
