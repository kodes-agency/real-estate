"use client";

import { HomePage } from "@/payload-types";
import { GoldText } from "@/components/ui/gold-text";
import { HomeSearchBar } from "./search-bar";
import FadeContent from "@/components/FadeContent";
export const SearchSection = ({ page }: { page: HomePage }) => {
  return (
    <section className="min-h-[70vh] p-5 bg-linear-to-b from-black  to-background flex flex-col justify-center items-center">
      <FadeContent
        blur={true}
        duration={1000}
        ease="ease-out"
        initialOpacity={0}
      >
        <h2 className="text-3xl md:text-4xl font-medium uppercase text-center text-white max-w-3xl font-marlet">
          ЗНАЕМ <GoldText className="font-bold">ЗЛАТНОТО ПРАВИЛО</GoldText> -
          МЕСТОПОЛОЖЕНИЕ, МЕСТОПОЛОЖЕНИЕ, МЕСТОПОЛОЖЕНИЕ.
        </h2>
      </FadeContent>
      <div className="pt-20 w-full">
        <HomeSearchBar />
        <p className="text-xs  text-center font-medium mt-2">
          {page.search.disclaimer}
        </p>
      </div>
    </section>
  );
};
