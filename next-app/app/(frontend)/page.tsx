import { getPayload } from "payload";
import config from "@/payload.config";
import { AboutSection } from "@/components/page/home/about-section";
import { PropertiesSection } from "@/components/page/home/properties-section";
import { SearchSection } from "@/components/page/home/search-section";
import { HeroSection } from "@/components/page/home/hero-section";
import { createCache } from "@/lib/utils";

export const generateMetadata = async () => {
  const payload = await getPayload({ config });
  const page = await payload.findGlobal({
    slug: "home-page",
  });

  return {
    title: page.meta?.title || 'Aгенция за недвижими имоти "Hayatis Estates"',
    description:
      page.meta?.description ||
      "Професионализъм и висококачествени услуги в сферата на недвижимите имоти! Продажба, наеми и отпускане на кредит за имоти в гр. Свиленград и околността!",
    keywords:
      "имот,свиленград,хасково,гърция,българия,недвижими имоти,hayatis estates,продава,наем,апартамент,къща,паркомясто",
    openGraph: {
      title: page.meta?.title || 'Aгенция за недвижими имоти "Hayatis Estates"',
      description:
        page.meta?.description ||
        "Професионализъм и висококачествени услуги в сферата на недвижимите имоти! Продажба, наеми и отпускане на кредит за имоти в гр. Свиленград и околността!",
      type: "website",
      locale: "bg-BG",
    },
  };
};

export default async function HomePage() {
  const payload = await getPayload({ config });
  const getNewestPropertiesData = createCache(
    async () =>
      await payload.find({
        collection: "properties",
        where: {
          and: [
            {
              isArchived: {
                equals: "false",
              },
            },
            {
              isAvailable: {
                equals: "true",
              },
            },
          ],
        },
        sort: ["-createdAt"],
        limit: 6,
      }),
    [],
    ["properties"],
  );

  const getFeaturedPropertiesData = createCache(
    async () =>
      await payload.find({
        collection: "properties",
        where: {
          isFeatured: {
            equals: "true",
          },
        },

        sort: ["-createdAt"],
        limit: 6,
      }),
    [],
    ["properties"],
  );

  const getHomePageData = createCache(
    async () =>
      await payload.findGlobal({
        slug: "home-page",
      }),
    [],
    ["home-page"],
  );

  const page = await getHomePageData();
  const propertiesFeatured = await getFeaturedPropertiesData();
  const newProperties = await getNewestPropertiesData();

  return (
    <div className="border border-black pb-10 md:pb-20 rounded-b-2xl">
      <HeroSection page={page} />

      <SearchSection page={page} />

      <PropertiesSection
        properties={propertiesFeatured.docs}
        text={{
          title: page.propertiesFeatured.title,
          subtitle: page.propertiesFeatured.subtitle,
        }}
      />

      <PropertiesSection
        properties={newProperties.docs}
        text={{
          title: page.propertiesNewest.title,
          subtitle: page.propertiesNewest.subtitle,
        }}
      />

      <AboutSection page={page} />
    </div>
  );
}
