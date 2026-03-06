"use client";

import { AboutPage } from "@/payload-types";
import Image from "next/image";
import { cn, getCollectionData } from "@/lib/utils";
import { RichText } from "@/components/global/richtext";
export const PrinciplesSection = ({ page }: { page: AboutPage }) => {
  return (
    <section className="min-h-[70vh] p-5 md:p-10 lg:p-14  flex flex-col justify-center items-center">
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center my-10 gap-10 ">
          <Image
            src={getCollectionData(page.about.image)?.url || ""}
            alt="about"
            width={500}
            height={800}
            className="rounded-2xl shadow-2xl/30 w-full md:w-1/3 object-cover"
          />
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-medium font-marlet text-black ">
              {page.about.title}
            </h2>
            <p className="text-xl text-black font-medium max-w-4xl">
              {page.about.subtitle}
            </p>
          </div>
        </div>
        <div className="grid gap-5 md:gap-10">
          {page.about.principles?.map((principle, id) => (
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
                <div className="flex md:items-baseline items-center gap-5">
                  <p className="md:text-[200px] text-[100px] font-marlet text-primary leading-none whitespace-nowrap">
                    {id + 1}.
                  </p>
                  <h2 className="font-marlet text-white text-3xl md:text-4xl lg:text-5xl uppercase">
                    {principle.title}
                  </h2>
                </div>
                <div className="text-white lg:pr-40 **:space-y-2! flex flex-col">
                  <RichText data={principle.content} />
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
      </div>
    </section>
  );
};
