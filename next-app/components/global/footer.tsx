"use client";

import { HomePage } from "@/payload-types";
import {
  EnvelopeIcon,
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";
import { GoldText } from "../ui/gold-text";
import { GoldSvg } from "../ui/gold-svg";
import Image from "next/image";
import { GoldLine } from "../ui/gold-line";

export default function Footer() {
  return (
    <footer
      className="relative h-[700px] md:h-[400px] bg-foreground text-white"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+700px)]  md:h-[calc(100vh+400px)] -top-[100vh]">
        <div className="h-[700px] md:h-[400px] sticky top-[calc(100vh-700px)] md:top-[calc(100vh-400px)]">
          <div className="bg-gray p-5 pt-20 md:p-10 lg:px-14 h-full w-full flex flex-col justify-between relative">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <div className="hidden col-span-2 md:flex flex-col items-start justify-start">
                <h2 className="text-2xl  max-w-sm ">
                  „ За нас намирането на вашия мечтан дом или продажбата на
                  личния ви имот не е просто работа – това е личен ангажимент
                  към вашето бъдеще. “
                </h2>
                {/* <GoldSvg
                  src="/logo/logo-white.svg"
                  className="  w-40 max-w-sm lg:w-72 h-32 lg:top-24  z-20"
                />
                <Image
                  src="/logo/logo-text-white.png"
                  alt="Hayatis Estate Svilengrad Haskovo Logo"
                  width={220}
                  height={140}
                  className="w-40 max-w-sm lg:w-72 lg:top-24 z-20 -translate-y-19 lg:translate-y-0"
                />
                <GoldLine className="w-40 max-w-sm lg:w-72 h-[2px] lg:h-[3px] -translate-y-18 lg:translate-y-1" /> */}
              </div>
              {/* <div></div>
              <div></div> */}
              <div className="space-y-2">
                <GoldText className="font-bold mb-5">Карта на сайта</GoldText>
                <ul className="md:text-sm flex flex-col gap-2">
                  <li>
                    <Link href="/">Начало</Link>
                  </li>
                  <li>
                    <Link href="/imoti">Имоти</Link>
                  </li>
                  <li>
                    <Link href="/imoti?purpose=for_sale">Продажби</Link>
                  </li>
                  <li>
                    <Link href="/imoti?purpose=for_rent">Наем</Link>
                  </li>
                  <li>
                    <Link href="/za-nas">За нас</Link>
                  </li>
                  <li>
                    <Link href="/uslugi">Услуги</Link>
                  </li>
                  <li>
                    <Link href="/contact">Контакти</Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <GoldText className="font-bold mb-5">Данни за контакт</GoldText>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link
                      className="flex gap-2 items-center md:text-sm"
                      href="mailto:hayatisestates@mail.bg"
                    >
                      <EnvelopeIcon size={20} />
                      hayatisestates@mail.bg
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="flex gap-2 items-center md:text-sm"
                      href="tel:+359882643334"
                    >
                      <PhoneIcon size={20} />
                      +359 882 643 334
                    </Link>
                  </li>
                </ul>
                <ul>
                  <li>
                    <Link
                      className="flex gap-2 items-center md:text-sm"
                      target="_blank"
                      href="https://www.facebook.com/p/Hayatis-Estates-100057079285066/"
                    >
                      <FacebookLogoIcon size={20} />
                      Hayatis Estates
                    </Link>
                  </li>
                </ul>
                <Link
                  target="_blank"
                  href="https://www.google.com/maps/place/ул.+„Неофит+Рилски“+2,+6500+Марица,+Свиленград/@41.7651641,26.198049,17z/data=!3m1!4b1!4m5!3m4!1s0x14b2cf91503cce79:0xfd47218672f7b908!8m2!3d41.7651601!4d26.2002377"
                >
                  <address className=" not-italic md:text-sm mt-5">
                    6500 Свиленград, <br /> ул. "Неофит Рилски №2"
                  </address>
                </Link>
              </div>
            </div>
            <div className="grid pt-10 md:pt-0 grid-cols-1 gap-2 md:gap-5 md:grid-cols-4">
              <Link
                target="_blank"
                className="md:text-sm order-4 md:order-1 underline"
                href="https://studiopriority.com"
              >
                Изработено от Studio Priority
              </Link>
              <p className="md:text-sm order-3 md:order-2">
                © copyright Hayatis Estates - {new Date().getFullYear()}
              </p>
              {/* <Link
                className="md:text-sm order-2 md:order-3"
                href="/policy/gtac"
              >
                Общи условия за ползване
              </Link> */}
              <div className="order-2 md:order-3"></div>
              <Link className="md:text-sm order-1 md:order-4" href="/policy">
                Политика за поверителност
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
