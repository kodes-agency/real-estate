import { getPayload } from "payload";
import config from "@/payload.config";
import { HeroSection } from "@/components/page/services/hero-section";
import { AdditionalServicesSection } from "@/components/page/services/additional-services-section";
import { CtaSection } from "@/components/page/services/cta-section";
import { PrinciplesSection } from "@/components/page/services/principles-section";
import { WhyUsSection } from "@/components/page/services/why-us-section";
import { createCache } from "@/lib/utils";

export const generateMetadata = async () => {
  const payload = await getPayload({ config });
  const page = await payload.findGlobal({
    slug: "services-page",
  });

  return {
    title:
      page.meta?.title ||
      'Услуги | Агенция за недвижими имоти "Hayatis Estates"',
    description:
      page.meta?.description ||
      "Продажбата на имот е съществен момент, за който са необходими добра подготовка и отлични знания. Ние от Hayatis Estates сме тук, за да ви сътрудничим в този момент!",
    keywords:
      "имот,свиленград,хасково,гърция,българия,недвижими имоти,hayatis estates,продава,наем,апартамент,къща,паркомясто",
    openGraph: {
      title:
        page.meta?.title ||
        'Услуги | Агенция за недвижими имоти "Hayatis Estates"',
      description:
        page.meta?.description ||
        "Продажбата на имот е съществен момент, за който са необходими добра подготовка и отлични знания. Ние от Hayatis Estates сме тук, за да ви сътрудничим в този момент!",
      type: "website",
      locale: "bg-BG",
    },
  };
};

export default async function ServicesPage() {
  const payload = await getPayload({ config });
  const getData = createCache(
    async () => await payload.findGlobal({ slug: "services-page" }),
    [],
    ["services-page"],
  );
  const servicesPage = await getData();
  return (
    <div>
      <HeroSection page={servicesPage} />
      <PrinciplesSection page={servicesPage} />
      <WhyUsSection page={servicesPage} />
      <AdditionalServicesSection page={servicesPage} />
      <CtaSection page={servicesPage} />
    </div>
  );
}
