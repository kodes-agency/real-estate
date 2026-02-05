"use client";

import { HomePage } from "@/payload-types";
import { RichText } from "@/components/global/richtext";

import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { getCollectionData } from "@/lib/utils";
import Image from "next/image";
import CountUp from "@/components/CountUp";
import { cn } from "@/lib/utils";
import { GoldButton } from "@/components/ui/gold-button";

export const AboutSection = ({ page }: { page: HomePage }) => {
  return (
    <section className="px-5 md:px-10 lg:px-14 mt-10 md:mt-20 flex flex-col gap-10 ">
      <div className="flex space-y-5 md:space-y-0 flex-col md:flex-row justify-end items-end">
        <h2 className="max-w-2xl text-2xl md:text-end font-medium">
          {page.about.title}
        </h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 md:gap-10">
        <div className="grid grid-cols-2 gap-4">
          {page.about.stats.map((stat, id) => (
            <article
              key={stat.id}
              className={cn(
                "w-full flex flex-col justify-center items-center aspect-4/3 rounded-xl shadow-2xl/20 ",
                {
                  "bg-foreground text-white": id % 3 === 0,
                  "bg-background": id % 3 !== 0,
                },
              )}
            >
              <div>
                <h3 className="text-5xl md:text-7xl font-marlet">
                  <CountUp from={0} to={stat.number} />
                  <span className="text-primary">{stat.sign}</span>
                </h3>
                <p className="text-sm md:text-lg">{stat.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="bg-foreground w-full h-full rounded-xl grid md:grid-cols-2 gap-6 p-6 shadow-2xl/20">
          <div className="flex flex-col justify-between order-2 md:order-1 space-y-4">
            <div className="**:space-y-2 [&_h3]:text-3xl [&_h3]:font-medium [&_h3]:font-marlet [&_h3]:uppercase text-lg  text-white">
              {/* <h3 className="text-3xl font-medium uppercase">За нас</h3>
                  <p className="text-lg md:text-xl pr-5">
                    Базирани сме в Свиленград и работим с оферти в Хасковска
                    област и близките райони в Югоизточна България както и
                    Гърция. Ще ви насочим с ясни съвети, реална пазарна цена и
                    съдействие до финала – без излишно усложняване.
                  </p> */}
              <RichText data={page.about.content} />
            </div>
            <GoldButton
              as="link"
              href="/"
              borderWidth={2}
              className="h-12 w-full rounded-md text-white"
            >
              Научи повече
              <ArrowUpRightIcon size={25} />
            </GoldButton>
          </div>
          <Image
            src={getCollectionData(page.about.image)?.url || ""}
            alt={getCollectionData(page.about.image)?.alt || ""}
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-bottom rounded-lg order-1 md:order-2 aspect-4/3 md:aspect-auto"
          />
        </div>
      </div>
    </section>
  );
};
