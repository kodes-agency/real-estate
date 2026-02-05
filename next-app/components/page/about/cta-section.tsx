"use client";

import { AboutPage } from "@/payload-types";
import { GoldButton } from "@/components/ui/gold-button";
export const CtaSection = ({ page }: { page: AboutPage }) => {
  return (
    <section className="min-h-[50vh] px-5 pb-10 flex flex-col items-center justify-center">
      <h2 className=" text-4xl sm:text-5xl md:text-6xl font-marlet text-black text-center max-w-4xl">
        {page.cta.title}
      </h2>
      <GoldButton
        className="bg-black rounded-md text-white font-medium h-14 px-10! mt-5 md:mt-10 hover:bg-foreground cursor-pointer shadow-md/30 hover:shadow-xl/40 transition-all duration-300 ease-in-out"
        href={page.cta.buttonLink}
        as="link"
      >
        {page.cta.buttonText}
      </GoldButton>
    </section>
  );
};
