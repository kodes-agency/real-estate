"use client";

import { ServicesPage } from "@/payload-types";
export const PrinciplesSection = ({ page }: { page: ServicesPage }) => {
  return (
    <section className=" p-5 md:p-10 lg:p-14  flex flex-col justify-center items-center mt-10">
      <h2 className="text-black font-marlet text-4xl md:text-6xl text-center">
        {page.principles.title}
      </h2>
      <div className="grid grid-cols-2  xl:grid-cols-4 gap-5 mt-10">
        {page.principles.principles?.map((principle, id) => (
          <div
            className="bg-foreground flex items-center flex-col sm:flex-row gap-2 p-4 rounded-2xl shadow-2xl/30"
            key={principle.id}
          >
            <p className="md:text-9xl text-7xl font-marlet text-primary whitespace-nowrap">
              {id + 1}.
            </p>
            <h2 className="text-xl text-center sm:text-left md:text-2xl uppercase font-marlet text-white ">
              {principle.title}
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
};
