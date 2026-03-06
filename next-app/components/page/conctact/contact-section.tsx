import { ContactPage } from "@/payload-types";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import Link from "next/link";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@phosphor-icons/react/ssr";
import { WhatsappIcon, ViberIcon, FacebookIcon } from "react-share";

const iconMapper = {
  phone: PhoneIcon,
  email: EnvelopeIcon,
  address: MapPinIcon,
  whatsapp: WhatsappIcon,
  viber: ViberIcon,
  facebook: FacebookIcon,
};

export const ContactSection = ({ page }: { page: ContactPage }) => {
  return (
    <section className="min-h-[50vh] px-5 md:px-10 lg:px-14 py-10 md:py-20 flex flex-col items-center justify-center">
      <div className="grid md:grid-cols-2 gap-10 w-full">
        <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-2xl/30">
          <GoogleMapsEmbed
            apiKey={process.env.GOOGLE_MAPS_API_KEY || ""}
            height={400}
            width="100%"
            zoom="16"
            mode="place"
            q={page.map.mapQuery}
          />
        </div>
        <div className="md:p-10 py-10 flex flex-col gap-5 order-1 md:order-2">
          <h2 className="flex flex-row gap-5 text-2xl font-marlet">
            <span>Лице за контакт:</span>
            <span>{page?.contact?.title}</span>
          </h2>
          <div className="flex flex-col gap-4">
            {page?.contact?.contacts
              ?.filter((contact) => !contact.isSocial)
              .map((contact, index) => {
                const Icon =
                  iconMapper[contact.label as keyof typeof iconMapper];

                return (
                  <Link
                    key={index}
                    href={contact.link || "#"}
                    className="flex items-center gap-2"
                  >
                    {Icon && <Icon size={20} className="" />}
                    <p>{contact.value}</p>
                  </Link>
                );
              })}
            <Link
              href={page.map.addressLink || "#"}
              className="flex items-center gap-2"
            >
              <MapPinIcon size={20} className="" />
              <p>{page.map.address}</p>
            </Link>
          </div>
          <div className="flex gap-5">
            {page?.contact?.contacts
              ?.filter((contact) => contact.isSocial)
              .map((contact, index) => {
                const Icon =
                  iconMapper[contact.label as keyof typeof iconMapper];

                return (
                  <Link
                    key={index}
                    href={contact.link || "#"}
                    className="flex items-center gap-2 rounded-sm shadow-md/20 hover:shadow-xl/30 hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    {Icon && <Icon className="w-10 h-10 " />}
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};
