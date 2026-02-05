import { getPayload } from "payload";
import config from "@/payload.config";
import { HeroSection } from "@/components/page/about/hero-section";
import { PrinciplesSection } from "@/components/page/about/principles-section";
import { CtaSection } from "@/components/page/about/cta-section";
import { createCache } from "@/lib/utils";

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
