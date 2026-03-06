import { getPropertyBySlug } from "@/actions/properties";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PropertyGallery } from "@/components/page/property-single/gallery";
import { Metadata } from "next";
import { PropertyFeatures } from "@/components/page/property-single/features";
import { propertyPurposeSelect } from "@/types/payload-select";
import { VisitRequestDialog } from "@/components/page/property-single/visit-request-dialog";
import { RichText } from "@/components/global/richtext";
import Link from "next/link";
import { createCache, getCollectionData } from "@/lib/utils";
import { GoldLine } from "@/components/ui/gold-line";
import { PropertyCard } from "@/components/page/property-archive/card";
import { ShareContainer } from "@/components/page/property-single/share";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { property } = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Имотът не е намерен",
    };
  }

  return {
    title:
      property.title + " | Hayatis Estate | Недвижими имоти" ||
      "Hayatis Estates - Недвижими имоти Свиленград, Хасково, Гърция, България",
    description: `Hayatis Estates предлага ${property.title}. Квадратура ${property.size} м², Цена ${property.price} €. | Недвижими имоти Свиленград, Хасково, Гърция, България`,
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const getData = createCache(
    async () => await getPropertyBySlug(slug),
    [slug],
    ["properties"],
  );
  const { property, similarProperties } = await getData();

  if (!property) {
    notFound();
  }

  const getImageUrl = (media: any) => {
    if (!media) return "/placeholder.jpg";
    if (typeof media === "string") return media;
    return media.url || "/placeholder.jpg";
  };

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[property.images.length - 1]
      : null;
  const mainImageUrl = getImageUrl(mainImage);

  const pricePerSqm = property.pricePerSquareMeter
    ? new Intl.NumberFormat("bg-BG", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(property.pricePerSquareMeter) + "/м²"
    : null;

  const location = `${
    typeof property.city === "object"
      ? property.city.type === "village"
        ? "с. " + property.city.title + ", "
        : property.city.title + ", "
      : ""
  } ${typeof property.region === "object" ? property.region.title : ""}`;

  const category =
    typeof property.category === "object" ? property.category.title : "";

  const tags = getCollectionData(property.tags);

  return (
    <div className=" pb-20">
      <div className="relative min-h-[70svh] overflow-hidden rounded-b-2xl shadow-2xl/30 flex flex-col items-start justify-end p-5 md:p-10 lg:p-14">
        <Image
          src={mainImageUrl}
          alt={property.title || "Property Image"}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/90 via-black/10 to-black z-20" />
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 w-full z-30">
          <div>
            <div className="flex gap-2 flex-wrap">
              {property.purpose.map((p) => {
                const purposeLabel =
                  propertyPurposeSelect.find((opt) => opt.value === p)?.label ||
                  p;
                return (
                  <Badge
                    key={p}
                    variant="ghost"
                    className="bg-primary text-white h-6 "
                  >
                    {purposeLabel}
                  </Badge>
                );
              })}
              {tags?.map((tag) => {
                const tagData = getCollectionData(tag);
                return (
                  <Badge
                    key={tagData?.id}
                    variant="ghost"
                    className="bg-black text-white h-6"
                  >
                    {tagData?.title}
                  </Badge>
                );
              })}
              {property.isFeatured === "true" && (
                <Badge variant="ghost" className="bg-black text-white h-6">
                  Обява на фокус
                </Badge>
              )}
            </div>
            <h1 className="md:text-4xl text-3xl font-medium z-30 text-white font-marlet mt-4">
              {property.title}
            </h1>
          </div>
          <div>
            <p className="md:text-4xl text-3xl font-medium font-marlet text-end text-white whitespace-nowrap">
              {property.price === 0
                ? "Цена по договаряне"
                : property.price.toLocaleString("bg-BG") + " €"}{" "}
              <span className="text-sm">
                {property.purpose.includes("for_rent") && property.price !== 0
                  ? "/месец"
                  : ""}
              </span>
            </p>
            {!property.purpose.includes("for_rent") && (
              <p className="text-xl text-end text-white whitespace-nowrap">
                {pricePerSqm}
              </p>
            )}
          </div>
        </div>
        <GoldLine className="z-30 w-full h-0.5 mt-1" />
      </div>

      {/* <BackgroundBlobs
        className=" p-5 pt-26 lg:p-14 lg:pt-34 rounded-b-2xl w-full shadow-2xl/30 "
        backgroundColor="#171717"
        baseFrequency={0.1}
        blobs={[
          { color: "#c5a059", size: "20vw", speed: 10 },
          { color: "#c5a059", size: "10vw", speed: 40 },
          { color: "#c5a059", size: "20vw", speed: 20 },
        ]}
      > */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 w-full "> */}
      {/* <h1 className="text-3xl text-white font-medium mt-4 col-span-1">
            {property.title}
          </h1> */}
      {/* <div className="col-span-2"> */}
      {/* <div className="w-full px-14 pt-32 pb-14 rounded-b-2xl shadow-2xl/30 bg-foreground"> */}
      {/* </div> */}
      {/* </div> */}
      {/* </div> */}
      {/* </BackgroundBlobs> */}
      {/* Main Image Gallery */}
      {/* Header Section */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-5 lg:gap-20 lg:mt-20 mt-10 px-5 lg:px-14">
        <div className=" order-2 mt-20 md:mt-0 md:order-1  col-span-1 bg-foreground h-fit p-6 rounded-xl space-y-4 sticky top-40   text-white shadow-2xl/30">
          <Image
            src="/keys.jpg"
            alt={property.title || "Property Image"}
            width={1000}
            height={1000}
            className="h-full object-cover rounded-md aspect-4/3 object-bottom"
          />
          <div>
            <h3 className="text-2xl font-medium mb-2 font-marlet text-primary ">
              Имате нужда от повече информация или искате да организирате оглед?
            </h3>
            <p>
              Свържете се с нас и ние ще отговорим на всички Ваши въпроси. Ще
              организираме оглед в удобно за Вас време. Най-удобната опция е да
              попълните формата запазване на час за оглед.
            </p>
            <div className="flex flex-col lg:flex-row gap-2 mt-4">
              <VisitRequestDialog
                propertyId={property.id.toString()}
                propertyTitle={property.title || "Unknown Property"}
              />
              <Link
                href="tel:+359882643334"
                className="w-full h-10 bg-foreground/50 text-sm flex items-center justify-center rounded-md text-white text-center"
              >
                Обадете ни се
              </Link>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2 space-y-4 md:col-span-2">
          <PropertyFeatures
            size={property.size}
            features={property.features}
            location={location}
            category={category}
            id={property.id}
          />
          <div className="text-base text-black mt-10">
            <div className="flex flex-col-reverse md:flex-row w-fit md:w-full md:items-center justify-between">
              <h2 className="text-3xl font-marlet font-medium mt-4  mb-2">
                Описание
              </h2>
              <ShareContainer property={property} />
            </div>
            <RichText data={property.description} />
          </div>
          <div className="mt-10">
            <h2 className="text-3xl font-marlet font-medium mt-4  mb-2">
              Галерия
            </h2>
            <PropertyGallery images={property.images?.reverse()} />
          </div>
        </div>
      </div>
      <div className="px-5 md:px-10 lg:px-14 mt-10">
        <h2 className="text-3xl font-marlet font-medium mt-20  mb-4">
          Подобни имоти
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...similarProperties]
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
        </div>
      </div>
    </div>
  );
}
