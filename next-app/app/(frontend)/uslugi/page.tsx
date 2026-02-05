import { getPayload } from "payload";
import config from "@/payload.config";
import { HeroSection } from "@/components/page/services/hero-section";
import { AdditionalServicesSection } from "@/components/page/services/additional-services-section";
import { CtaSection } from "@/components/page/services/cta-section";
import { PrinciplesSection } from "@/components/page/services/principles-section";
import { WhyUsSection } from "@/components/page/services/why-us-section";
import { createCache } from "@/lib/utils";

export default async function AboutPage() {
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
