"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverTitle,
} from "../ui/popover";
import Link from "next/link";
import { GoldButton } from "../ui/gold-button";
import { ContactPage } from "@/payload-types";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@phosphor-icons/react";
import { WhatsappIcon, ViberIcon, FacebookIcon } from "react-share";

const iconMapper = {
  phone: PhoneIcon,
  email: EnvelopeIcon,
  address: MapPinIcon,
  whatsapp: WhatsappIcon,
  viber: ViberIcon,
  facebook: FacebookIcon,
};

export const ContactPopup = ({
  contact,
  label,
  align,
}: {
  contact: ContactPage;
  label?: string;
  align?: "start" | "center" | "end";
}) => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button className="flex items-center gap-4 cursor-pointer">
            <GoldButton
              as="div"
              className="group gap-1 flex items-center justify-center p-0 h-12 w-12 rounded-md bg-foreground hover:bg-foreground shadow-md/20 hover:shadow-lg/40 transition-all ease-in-out duration-300 "
              borderWidth={2}
            >
              <PhoneIcon
                size={25}
                weight="bold"
                className="text-white transition-transform duration-300"
              />
            </GoldButton>
            <p className="text-white text-sm hidden lg:block">{label}</p>
          </button>
        }
      />
      <PopoverContent
        align={align || "center"}
        className="w-fit rounded-md p-2"
      >
        <PopoverTitle className="sr-only">Свържете се с нас</PopoverTitle>
        <div className="flex gap-4">
          {contact.contact?.contacts
            ?.filter((contact) => contact.isMain)
            .map((contact) => {
              const Icon = iconMapper[contact.label as keyof typeof iconMapper];
              return (
                <Link
                  key={contact.id}
                  className="hover:scale-105 shadow-md/30 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-lg/40"
                  target="_blank"
                  href={contact.link || "#"}
                >
                  {contact.isSocial
                    ? Icon && <Icon size={10} className="w-8 h-8" />
                    : Icon && (
                        <Icon
                          size={10}
                          className="w-8 h-8 p-1 bg-black text-white"
                        />
                      )}
                </Link>
              );
            })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
