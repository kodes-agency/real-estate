"use client";

import { AboutPage } from "@/payload-types";
import Image from "next/image";
import { getCollectionData } from "@/lib/utils";
import { GoldLine } from "@/components/ui/gold-line";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ClassNames from "embla-carousel-class-names";
import Fade from "embla-carousel-fade";
import { GoldSvg } from "@/components/ui/gold-svg";
import { ArrowDownIcon } from "@phosphor-icons/react";

export const HeroSection = ({ page }: { page: AboutPage }) => {
  return (
    <section className="relative min-h-[720px] lg:min-h-[90vh] flex flex-col justify-center lg:justify-end bg-black rounded-b-2xl overflow-hidden shadow-2xl/30">
      {page.hero.images.length > 0 && (
        <Carousel
          className="absolute inset-0 h-full w-full"
          opts={{
            loop: true,
            duration: 50, // Smoother fade tick
          }}
          plugins={[Autoplay({ delay: 5000 }), ClassNames(), Fade()]}
        >
          <CarouselContent className="mt-0 h-full">
            {page.hero.images.map((image, index) => (
              <CarouselItem
                key={index}
                className="pt-0 h-full w-full relative transition-opacity duration-1000 ease-in-out opacity-0 [&.is-snapped]:opacity-100 z-0 [&.is-snapped]:z-10"
              >
                <Image
                  src={getCollectionData(image)?.url || ""}
                  alt={getCollectionData(image)?.alt || ""}
                  fill
                  className="object-cover object-[50%_80%] h-full w-full"
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
      <div className="absolute inset-0 bg-linear-to-b from-black/90 via-black/50 to-black z-20" />
      <div className="z-20 flex flex-col items-center justify-center lg:pb-[10vh]">
        <GoldSvg
          src="/logo/logo-white.svg"
          className="  w-52 max-w-sm lg:w-80 h-22 lg:h-34 lg:top-24 z-20"
        />
        <Image
          src="/logo/logo-text-white.png"
          alt="Hayatis Estate Svilengrad Haskovo Logo"
          width={220}
          height={140}
          className="w-52 max-w-sm lg:w-80 lg:top-24 z-20 "
        />
        <GoldLine className="w-52 max-w-sm lg:w-80 h-[2px] mt-1 lg:h-[3px] " />
      </div>
      <div className="inset-0 z-20 p-5 md:p-10 lg:p-14">
        <div className=" space-y-4 lg:space-y-0 flex lg:flex-row h-fit flex-col justify-center lg:justify-between items-center lg:items-end text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-marlet max-w-4xl leading-[0.8] uppercase text-center">
            {page.hero.title}
          </h1>
          <p className="max-w-sm lg:max-w-lg lg:text-end text-lg pb-2 text-center">
            {page.hero.subtitle}
          </p>
        </div>
        <GoldLine className="w-full hidden h-0.5 mt-2 lg:block z-20" />
      </div>

      <ArrowDownIcon
        weight="light"
        size={20}
        className="mx-auto z-20 relative text-primary animate-bounce mt-5 lg:hidden"
      />
    </section>
  );
};
