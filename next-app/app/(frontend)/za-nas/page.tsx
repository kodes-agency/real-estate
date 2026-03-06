import { getPayload } from "payload";
import config from "@/payload.config";
import { HeroSection } from "@/components/page/about/hero-section";
import { PrinciplesSection } from "@/components/page/about/principles-section";
import { CtaSection } from "@/components/page/about/cta-section";
import { createCache } from "@/lib/utils";

export const generateMetadata = async () => {
  const payload = await getPayload({ config });
  const page = await payload.findGlobal({
    slug: "about-page",
  });

  return {
    title:
      page.meta?.title ||
      'За нас | Агенция за недвижими имоти "Hayatis Estates"',
    description:
      page.meta?.description ||
      "Hayatis Estates – агенция за недвижими имоти с мисия за лоялност, прозрачност и професионализъм. Договаряме най-добрите условия при покупка, продажба и наем на имоти.",
    keywords:
      "имот,свиленград,хасково,гърция,българия,недвижими имоти,hayatis estates,продава,наем,апартамент,къща,паркомясто",
    openGraph: {
      title:
        page.meta?.title ||
        'За нас | Агенция за недвижими имоти "Hayatis Estates"',
      description:
        page.meta?.description ||
        "Hayatis Estates – агенция за недвижими имоти с мисия за лоялност, прозрачност и професионализъм. Договаряме най-добрите условия при покупка, продажба и наем на имоти.",
      type: "website",
      locale: "bg-BG",
    },
  };
};

export default async function AboutPage() {
  const payload = await getPayload({ config });
  const getData = createCache(
    async () => await payload.findGlobal({ slug: "about-page" }),
    [],
    ["about-page"],
  );
  const aboutPage = await getData();
  return (
    <div>
      <HeroSection page={aboutPage} />
      <PrinciplesSection page={aboutPage} />
      <CtaSection page={aboutPage} />
    </div>
  );
}
