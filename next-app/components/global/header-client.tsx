"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlusIcon, ListIcon } from "@phosphor-icons/react/dist/ssr";
import { PublishPropertyDialog } from "@/components/global/publish-property-dialog";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";
import { PhoneIcon } from "@phosphor-icons/react";
import { GoldLine } from "../ui/gold-line";
import { GoldButton } from "../ui/gold-button";

interface Category {
  id: number;
  title: string;
}

interface HeaderClientProps {
  categories: Category[];
}

export function HeaderClient({ categories }: HeaderClientProps) {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setShowSticky(true);
    } else {
      if (typeof window !== "undefined") {
        const vh = window.innerHeight;
        setShowSticky(window.scrollY > vh);
      }
    }
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (typeof window !== "undefined") {
      const vh = window.innerHeight;
      // Show sticky header after 110vh
      if (pathname !== "/") return setShowSticky(true);
      if (latest > vh * 0.5) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    }
  });

  const DesktopMenu = ({
    className = "",
    ctaHighlited = true,
    textColor = showSticky ? "text-black" : "text-white",
  }: {
    className?: string;
    ctaHighlited?: boolean;
    textColor?: string;
  }) => (
    <div
      className={`hidden lg:flex items-center text-sm xl:text-base whitespace-nowrap gap-4 lg:gap-8 ${className}`}
    >
      {pathname !== "/" && (
        <Link
          href="/"
          className={`${textColor} font-normal flex flex-col items-center gap-px overflow-hidden group`}
        >
          <p>Начало</p>
          <GoldLine className="h-0.5 opacity-0 group-hover:opacity-100 transition-all ease-in-out w-0 group-hover:w-full duration-300" />
        </Link>
      )}

      <Link
        href="/imoti?purpose=for_sale&page=1"
        className={`${textColor} font-normal flex flex-col items-center gap-px overflow-hidden group`}
      >
        <p>Продажба</p>
        <GoldLine className="h-0.5 opacity-0 group-hover:opacity-100 transition-all ease-in-out w-0 group-hover:w-full duration-300" />
      </Link>
      <Link
        href="/imoti?purpose=for_rent&page=1"
        className={`${textColor} font-normal flex flex-col items-center gap-px overflow-hidden group`}
      >
        <p>Наем</p>
        <GoldLine className="h-0.5 opacity-0 group-hover:opacity-100 transition-all ease-in-out w-0 group-hover:w-full duration-300" />
      </Link>
      <Link
        href="/uslugi"
        className={`${textColor} font-normal flex flex-col items-center gap-px overflow-hidden group`}
      >
        <p>Услуги</p>
        <GoldLine className="h-0.5 opacity-0 group-hover:opacity-100 transition-all ease-in-out w-0 group-hover:w-full duration-300" />
      </Link>
      <Link
        href="/za-nas"
        className={`${textColor} font-normal flex flex-col items-center gap-px overflow-hidden group`}
      >
        <p>За нас</p>
        <GoldLine className="h-0.5 opacity-0 group-hover:opacity-100 transition-all ease-in-out w-0 group-hover:w-full duration-300" />
      </Link>
      <Link
        href="/contact"
        className={`${textColor} font-normal flex flex-col items-center gap-px overflow-hidden group`}
      >
        <p>Контакти</p>
        <GoldLine className="h-0.5 opacity-0 group-hover:opacity-100 transition-all ease-in-out w-0 group-hover:w-full duration-300" />
      </Link>
      <PublishPropertyDialog
        categories={categories}
        mode="evaluation"
        triggerLabel="Онлайн оценка"
        triggerVariant="outline"
        className={`${textColor} font-normal flex flex-col items-center gap-px overflow-hidden group`}
      />

      <PublishPropertyDialog
        categories={categories}
        mode="client-sale"
        triggerLabel="Добави имот"
        icon={
          <PlusIcon
            size={25}
            weight="bold"
            className="text-white group-hover:text-primary transition-colors duration-500"
          />
        }
      />
    </div>
  );

  const StickyMenu = () => (
    <Popover>
      <PopoverTrigger className="lg:hidden">
        <GoldButton
          as="div"
          borderWidth={2}
          className="w-12 h-12 rounded-md flex items-center justify-center cursor-pointer bg-foreground shadow-md/30 hover:bg-foreground"
        >
          <ListIcon className="text-white" weight="light" size={25} />
        </GoldButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        alignOffset={-10}
        side="bottom"
        sideOffset={14}
        className="bg-background/95 text-black w-[calc(100vw-2rem)] backdrop-blur-sm border-primary/30"
      >
        <div className="flex flex-col gap-2">
          {pathname !== "/" && (
            <Link
              href="/"
              className=" font-medium hover:text-primary transition-colors p-2 text-2xl"
            >
              Начало
            </Link>
          )}
          <Link
            href="/imoti?purpose=for_sale&page=1"
            className=" font-medium hover:text-primary transition-colors p-2 text-2xl"
          >
            Продажба
          </Link>
          <Link
            href="/imoti?purpose=for_rent&page=1"
            className=" font-medium hover:text-primary transition-colors p-2 text-2xl"
          >
            Наем
          </Link>
          <Link
            href="/uslugi"
            className=" font-medium hover:text-primary transition-colors p-2 text-2xl"
          >
            Услуги
          </Link>
          <Link
            href="/za-nas"
            className=" font-medium hover:text-primary transition-colors p-2 text-2xl"
          >
            За нас
          </Link>
          <Link
            href="/contact"
            className=" font-medium hover:text-primary transition-colors p-2 text-2xl"
          >
            Контакти
          </Link>
          <PublishPropertyDialog
            categories={categories}
            mode="evaluation"
            triggerLabel="Онлайн оценка"
            triggerVariant="outline"
            className="justify-start px-0 font-medium hover:text-primary p-2 text-2xl"
          />
          <PublishPropertyDialog
            categories={categories}
            mode="client-sale"
            triggerLabel="Добави имот"
            icon={<PlusIcon size={25} weight="bold" className="text-primary" />}
            className="justify-center font-medium hover:text-primary shadow-md/20 p-4 text-2xl text-center bg-foreground border-primary/40 border w-full rounded-md"
          />
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      {/* Hero Header (Absolute, Top) */}
      {pathname === "/" && (
        <header className="lg:px-10 absolute top-14 lg:top-6 z-50 w-full left-0 flex justify-center pointer-events-none">
          <div className="w-full px-6 py-4 rounded-xl flex items-center justify-between pointer-events-auto">
            {/* Logo is commented out in Hero Header per user request/current state */}
            {/* Spacer to keep layout balanced if needed, or just empty */}

            <Link
              href="tel:+359882643334"
              className="lg:flex cursor-pointer text-white gap-4 items-center hidden"
            >
              <GoldButton
                as="div"
                className="p-0 h-10 w-10 rounded-md"
                borderWidth={2}
              >
                <PhoneIcon size={25} className="text-white" />
              </GoldButton>
              <p>свържи се с нас</p>
            </Link>
            <GoldButton
              as="link"
              href="tel:+359882643334"
              borderWidth={2}
              className="flex items-center justify-center p-0! h-12 w-12 rounded-md lg:hidden"
            >
              <PhoneIcon size={25} weight="light" className="text-white" />
            </GoldButton>
            <div className="lg:hidden flex items-center gap-2">
              <StickyMenu />
            </div>
            <DesktopMenu ctaHighlited={true} />
          </div>
        </header>
      )}

      {/* Sticky Header (Fixed, appearing after 110vh) */}
      <motion.header
        initial={{ y: "-130%" }}
        animate={{ y: showSticky ? "0%" : "-130%" }}
        transition={{ duration: 0.3, ease: "easeInOut", type: "tween" }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 shadow-2xl/30 md:w-[calc(100vw-7rem)] w-[calc(100vw-2rem)] bg-background backdrop-blur-sm rounded-xl px-2 md:px-3 py-2 md:py-3 flex items-center justify-between"
      >
        <GoldButton
          as="link"
          href="tel:+359882643334"
          borderWidth={2}
          className="w-12 h-12 rounded-md lg:hidden flex items-center justify-center bg-foreground shadow-md/30 hover:bg-foreground"
        >
          <PhoneIcon size={25} weight="light" className="text-white" />
        </GoldButton>
        <Link
          href="/"
          className="font-bold text-xl flex items-center justify-center gap-0 flex-col cursor-pointer"
        >
          <Image
            src="/logo/logo-text-black.png"
            alt="Logo"
            width={200}
            height={400}
            className="w-auto md:object-contain h-7 px-1"
          />
          <GoldLine className="h-0.5" />
        </Link>
        <div className="lg:flex items-center gap-4 hidden">
          <DesktopMenu />
          <GoldButton
            as="link"
            href="tel:+359882643334"
            className="group flex items-center justify-center p-0 h-12 w-12 rounded-md bg-foreground hover:bg-foreground shadow-md/20 hover:shadow-lg/40 transition-all ease-in-out duration-300 "
            borderWidth={2}
          >
            <PhoneIcon
              size={25}
              weight="bold"
              className="text-white transition-transform duration-300"
            />
          </GoldButton>
        </div>
        <StickyMenu />
      </motion.header>
    </>
  );
}
