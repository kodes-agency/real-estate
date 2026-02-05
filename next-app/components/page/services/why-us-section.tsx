"use client";

import { ServicesPage } from "@/payload-types";
import { GoldText } from "@/components/ui/gold-text";
import { GoldLine } from "@/components/ui/gold-line";
import { PlusIcon } from "@phosphor-icons/react";
export const WhyUsSection = ({ page }: { page: ServicesPage }) => {
  return (
    <section className="min-h-[50vh] p-5 py-10 md:p-10 lg:p-14 my-20 flex flex-col items-center justify-center bg-foreground rounded-2xl shadow-2xl/40">
      {/* <GoldText> */}
      <div className="w-full flex justify-between items-end flex-col md:flex-row">
        <GoldText>
          <h2 className=" text-3xl md:text-4xl text-start font-marlet">
            {page.whyUs.title}
          </h2>
        </GoldText>
        <p className="text-white max-w-xl w-full md:text-end text-xl mt-4 md:mt-0">
          {page.whyUs.subtitle}
        </p>
      </div>
      <GoldLine className="w-full h-0.5 mt-4 md:mt-2" />
      {/* <Image
          src={getCollectionData(page.whyUs.image)?.url || ""}
          alt="about"
          width={500}
          height={800}
          className="rounded-xl shadow-2xl/30 w-full h-full object-cover aspect-4/3"
        /> */}
      <div className="w-full  grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-10 mt-10 ">
        {page.whyUs.whyUs?.map((whyUs, id) => (
          <div
            className=" font-medium text-sm text-white flex items-center gap-2 "
            key={id}
          >
            <PlusIcon className="min-w-5 h-5 text-primary" />
            <p>{whyUs.title}</p>
          </div>
        ))}
      </div>
      {/* </GoldText> */}
    </section>
  );
};
