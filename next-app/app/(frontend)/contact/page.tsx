import { getPayload } from "payload";
import config from "@/payload.config";
import { createCache } from "@/lib/utils";
import { HeroSection } from "@/components/page/conctact/hero-section";
import { ContactSection } from "@/components/page/conctact/contact-section";

export const generateMetadata = async () => {
  const payload = await getPayload({ config });
  const page = await payload.findGlobal({
    slug: "contact-page",
  });

  return {
    title: page.meta?.title || "Hayatis Estate | Недвижими имоти",
    description:
      page.meta?.description ||
      "Недвижими имоти Свиленград, Хасково, Гърция, България",
    keywords:
      "имот,свиленград,хасково,гърция,българия,недвижими имоти,hayatis estates,продава,наем,апартамент,къща,паркомясто",
    openGraph: {
      title: page.meta?.title || "Hayatis Estate | Недвижими имоти",
      description:
        page.meta?.description ||
        "Недвижими имоти Свиленград, Хасково, Гърция, България",
      type: "website",
      locale: "bg-BG",
    },
  };
};

export default async function ServicesPage() {
  const payload = await getPayload({ config });
  const getData = createCache(
    async () => await payload.findGlobal({ slug: "contact-page" }),
    [],
    ["contact-page"],
  );
  const contactPage = await getData();
  return (
    <div className="">
      <HeroSection page={contactPage} />
      <ContactSection page={contactPage} />
    </div>
  );
}
