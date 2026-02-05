import {
  getProperties,
  getFilterOptions,
  PropertyFilters,
} from "@/actions/properties";
import { PropertySearchFilters } from "@/components/page/property-archive/search-filters";
import { PropertyCard } from "@/components/page/property-archive/card";
import { Property } from "@/payload-types";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@/payload.config";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const dynamic = "force-dynamic";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const payload = await getPayload({ config });
  const homePage = await payload.findGlobal({
    slug: "home-page",
  });
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? Number(resolvedParams.page) : 1;
  const sort =
    typeof resolvedParams.sort === "string"
      ? resolvedParams.sort
      : "-createdAt";

  const filters: PropertyFilters = {
    priceFrom: resolvedParams.priceFrom
      ? Number(resolvedParams.priceFrom)
      : undefined,
    priceTo: resolvedParams.priceTo
      ? Number(resolvedParams.priceTo)
      : undefined,
    sizeFrom: resolvedParams.sizeFrom
      ? Number(resolvedParams.sizeFrom)
      : undefined,
    sizeTo: resolvedParams.sizeTo ? Number(resolvedParams.sizeTo) : undefined,
    purpose: Array.isArray(resolvedParams.purpose)
      ? resolvedParams.purpose
      : resolvedParams.purpose
        ? [resolvedParams.purpose]
        : [],
    region:
      typeof resolvedParams.region === "string"
        ? resolvedParams.region
        : undefined,
    city:
      typeof resolvedParams.city === "string" ? resolvedParams.city : undefined,
    category:
      typeof resolvedParams.category === "string"
        ? resolvedParams.category
        : undefined,
  };

  const [data, options] = await Promise.all([
    getProperties({
      page,
      limit: 9,
      sort,
      filters,
    }),
    getFilterOptions(filters),
  ]);

  return (
    <div className=" mx-auto space-y-8 ">
      <div className="space-y-8">
        <div className="py-5 md:py-20 relative bg-[url('/hayatis-estate.jpg')] bg-cover bg-center rounded-b-2xl px-5 min-h-80 shadow-2xl/30">
          <div className="absolute inset-0 bg-black/50 rounded-b-2xl"></div>
          <PropertySearchFilters options={options} homePage={homePage} />
          <div className="flex gap-5 flex-col bg-foreground/50 backdrop-blur-sm p-4 rounded-xl mb-0 mt-28 text-white z-20 relative md:hidden">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-medium tracking-tight text-white font-marlet">
                {filters.category
                  ? "Вашето търсене: " +
                      options.categories.find(
                        (c) => c.id === Number(filters.category),
                      )?.title || "Всички имоти"
                  : "Всички имоти"}
                {filters.purpose?.includes("for_rent") && " под наем"}
                {filters.purpose?.includes("for_sale") && " за продажба"}
              </h1>
              <p className="text-white">
                Открий своя мечтан дом или инвестиция сред нашите предложения.
              </p>
            </div>
            <div className="flex flex-col md:flex-row  justify-between gap-4">
              <p className="text-sm text-white">
                Намерени {data.totalDocs} резултата
              </p>

              {/* Simple Sort Replacement */}
              <div className="flex flex-wrap gap-4 text-sm">
                <Link
                  href={`?${new URLSearchParams({ ...(resolvedParams as any), sort: "-createdAt" }).toString()}`}
                  className={
                    sort === "-createdAt"
                      ? "font-bold underline text-white"
                      : "text-background/70 hover:text-background/90"
                  }
                >
                  Най-нови
                </Link>
                <Link
                  href={`?${new URLSearchParams({ ...(resolvedParams as any), sort: "price" }).toString()}`}
                  className={
                    sort === "price"
                      ? "font-bold underline"
                      : "text-background/70 hover:text-background/90"
                  }
                >
                  Цена (възходяща)
                </Link>
                <Link
                  href={`?${new URLSearchParams({ ...(resolvedParams as any), sort: "-price" }).toString()}`}
                  className={
                    sort === "-price"
                      ? "font-bold underline"
                      : "text-background/70 hover:text-background/90"
                  }
                >
                  Цена (низходяща)
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 md:px-10 lg:px-14 flex flex-col gap-5 md:pt-20 pb-10">
          <div className="md:flex gap-5 flex-col hidden">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-medium tracking-tight">
                {filters.category
                  ? "Категория: " +
                      options.categories.find(
                        (c) => c.id === Number(filters.category),
                      )?.title || "Всички имоти"
                  : "Всички имоти"}
              </h1>
              <p className="text-muted-foreground">
                Открий своя мечтан дом или инвестиция сред нашите предложения.
              </p>
            </div>
            <div className="flex flex-col md:flex-row  justify-between gap-4">
              <p className="text-sm text-black">
                Намерени {data.totalDocs} резултата
              </p>

              <div className="flex gap-2 text-sm">
                <Link
                  href={`?${new URLSearchParams({ ...(resolvedParams as any), sort: "-createdAt" }).toString()}`}
                  className={
                    sort === "-createdAt"
                      ? "font-bold underline"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  Най-нови
                </Link>
                <Link
                  href={`?${new URLSearchParams({ ...(resolvedParams as any), sort: "price" }).toString()}`}
                  className={
                    sort === "price"
                      ? "font-bold underline"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  Цена (възходяща)
                </Link>
                <Link
                  href={`?${new URLSearchParams({ ...(resolvedParams as any), sort: "-price" }).toString()}`}
                  className={
                    sort === "-price"
                      ? "font-bold underline"
                      : "text-muted-foreground hover:text-foreground"
                  }
                >
                  Цена (низходяща)
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.docs.map((property: Property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {data.docs.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p>Няма намерени имоти, отговарящи на вашите критерии.</p>
            </div>
          )}

          {data.totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {data.hasPrevPage && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`?${new URLSearchParams({ ...(resolvedParams as any), page: String(data.prevPage) }).toString()}`}
                    />
                  </PaginationItem>
                )}

                {/* Simple Page Numbers Logic - can be improved for many pages */}
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                  (p) => {
                    const currentPage = data.page || 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      p === 1 ||
                      p === data.totalPages ||
                      (p >= currentPage - 1 && p <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href={`?${new URLSearchParams({ ...(resolvedParams as any), page: String(p) }).toString()}`}
                            isActive={p === currentPage}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    // Show ellipsis
                    if (p === currentPage - 2 || p === currentPage + 2) {
                      return (
                        <PaginationItem key={p}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  },
                )}

                {data.hasNextPage && (
                  <PaginationItem>
                    <PaginationNext
                      href={`?${new URLSearchParams({ ...(resolvedParams as any), page: String(data.nextPage) }).toString()}`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
