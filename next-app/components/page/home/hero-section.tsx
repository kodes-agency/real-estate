"use client";

import { HomePage } from "@/payload-types";
import Image from "next/image";
import { getCollectionData } from "@/lib/utils";
import { GoldText } from "@/components/ui/gold-text";
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

export const HeroSection = ({ page }: { page: HomePage }) => {
  return (
    <section className="relative min-h-[820px] lg:min-h-[90vh] flex flex-col justify-center lg:justify-end bg-black">
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
                  className="object-cover h-full w-full"
                  priority={index === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
      <div className="absolute inset-0 bg-linear-to-b from-black/90 via-black/50 to-black z-20" />
      <div className="absolute -top-16 lg:top-1/5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center">
        <GoldSvg
          src="/logo/logo-white.svg"
          className="  w-40 max-w-sm lg:w-80 h-56 lg:top-24  z-20"
        />
        <Image
          src="/logo/logo-text-white.png"
          alt="Hayatis Estate Svilengrad Haskovo Logo"
          width={220}
          height={140}
          className="w-40 max-w-sm lg:w-80 lg:top-24 z-20 -translate-y-19 lg:-translate-y-11"
        />
        <GoldLine className="w-40 max-w-sm lg:w-80 h-[2px] lg:h-[3px] -translate-y-18 lg:-translate-y-10" />
      </div>
      {/* <Image
        src="/logo/logo-semi-white.png"
        alt="Hayatis Estate Svilengrad Haskovo Logo"
        width={220}
        height={140}
        className=" absolute top-5 w-40 lg:w-56 lg:top-24 lg:-ml-2 left-1/2 -translate-x-1/2 z-20"
      /> */}
      <div className="inset-0 z-20 p-5 md:p-10 lg:p-14">
        <div className=" space-y-4 lg:space-y-0 flex lg:flex-row h-fit flex-col justify-end lg:justify-between items-end text-white">
          {/* <GoldText> */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-marlet max-w-4xl leading-[0.8] uppercase">
            {page.hero.title}
          </h1>
          {/* </GoldText> */}
          <p className="max-w-4xl lg:max-w-sm lg:text-end text-lg pb-2">
            {page.hero.subtitle}
          </p>
        </div>
        <GoldLine className="w-full hidden h-0.5 mt-2 md:block z-20" />
      </div>

      <ArrowDownIcon
        weight="light"
        size={20}
        className="mx-auto z-20 text-primary absolute bottom-40 lg:hidden left-1/2 -translate-x-1/2 animate-bounce"
      />
    </section>
  );
};
