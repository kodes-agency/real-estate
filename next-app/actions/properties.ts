"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { Property, Region, City, Category } from "@/payload-types";

export type PropertyFilters = {
  priceFrom?: number;
  priceTo?: number;
  sizeFrom?: number;
  sizeTo?: number;
  purpose?: string[];
  region?: string;
  city?: string;
  category?: string;
};

// Helper to build "where" clause based on filters
const buildPropertyWhere = (
  filters: PropertyFilters,
  excludeKey?: keyof PropertyFilters,
) => {
  const where: any = {
    // Exclude archived properties
    isArchived: {
      not_equals: "true",
    },
  };

  if (excludeKey !== "region" && filters.region) {
    where.region = { equals: filters.region };
  }
  if (excludeKey !== "city" && filters.city) {
    where.city = { equals: filters.city };
  }
  if (excludeKey !== "category" && filters.category) {
    where.category = { equals: filters.category };
  }
  if (
    excludeKey !== "purpose" &&
    filters.purpose &&
    filters.purpose.length > 0
  ) {
    where.purpose = { in: filters.purpose };
  }

  if (filters.priceFrom !== undefined) {
    where.price = { ...where.price, greater_than_equal: filters.priceFrom };
  }
  if (filters.priceTo !== undefined) {
    where.price = { ...where.price, less_than_equal: filters.priceTo };
  }
  if (filters.sizeFrom !== undefined) {
    where.size = { ...where.size, greater_than_equal: filters.sizeFrom };
  }
  if (filters.sizeTo !== undefined) {
    where.size = { ...where.size, less_than_equal: filters.sizeTo };
  }

  return where;
};

export async function getProperties({
  page = 1,
  limit = 9,
  sort = "-createdAt",
  filters = {},
}: {
  page?: number;
  limit?: number;
  sort?: string;
  filters?: PropertyFilters;
}) {
  const payload = await getPayload({ config });
  const where = buildPropertyWhere(filters);

  // Always sort by availability first
  // Then by the user selected sort
  const sortWithAvailability = ["isAvailable", sort];

  const result = await payload.find({
    collection: "properties",
    page,
    limit,
    sort: sortWithAvailability,
    where,
    depth: 1,
  });

  return result;
}

export async function getPropertyBySlug(slug: string) {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "properties",
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  });

  const similarProperties = await payload.find({
    collection: "properties",
    where: {
      slug: {
        not_equals: slug,
      },
      isArchived: {
        equals: false,
      },
      isAvailable: {
        equals: true,
      },
      category: {
        equals:
          typeof result.docs[0].category === "number"
            ? result.docs[0].category
            : result.docs[0].category.id,
      },
      purpose: {
        in: result.docs[0].purpose,
      },
    },
    limit: 20,
    depth: 2,
  });

  return {
    property: result.docs[0] || null,
    similarProperties: similarProperties.docs,
  };
}

export async function getFilterOptions(currentFilters: PropertyFilters) {
  const payloadClient = await getPayload({ config });

  const [
    regionsResult,
    citiesResult,
    categoriesResult,
    purposesResult,
    statsResult,
  ] = await Promise.all([
    // 1. Available Regions
    payloadClient.find({
      collection: "properties",
      where: buildPropertyWhere(currentFilters, "region"),
      limit: 1000,
      select: { region: true },
      depth: 0,
    }),
    // 2. Available Cities
    payloadClient.find({
      collection: "properties",
      where: buildPropertyWhere(currentFilters, "city"),
      limit: 1000,
      select: { city: true },
      depth: 0,
    }),
    // 3. Available Categories
    payloadClient.find({
      collection: "properties",
      where: buildPropertyWhere(currentFilters, "category"),
      limit: 1000,
      select: { category: true },
      depth: 0,
    }),
    // 4. Available Purposes
    payloadClient.find({
      collection: "properties",
      where: buildPropertyWhere(currentFilters, "purpose"),
      limit: 1000,
      select: { purpose: true },
      depth: 0,
    }),
    // 5. Stats (Price/Size) - uses ALL filters EXCEPT price/size themselves to determine full range
    payloadClient.find({
      collection: "properties",
      where: buildPropertyWhere({
        ...currentFilters,
        priceFrom: undefined,
        priceTo: undefined,
        sizeFrom: undefined,
        sizeTo: undefined,
      }),
      limit: 1000,
      select: { price: true, size: true },
      depth: 0,
    }),
  ]);

  // Extract unique IDs/Values
  const regionIds = Array.from(
    new Set(regionsResult.docs.map((p: any) => p.region).filter(Boolean)),
  );
  const cityIds = Array.from(
    new Set(citiesResult.docs.map((p: any) => p.city).filter(Boolean)),
  );
  const categoryIds = Array.from(
    new Set(categoriesResult.docs.map((p: any) => p.category).filter(Boolean)),
  );
  const distinctPurposes = Array.from(
    new Set(purposesResult.docs.flatMap((p: any) => p.purpose || [])),
  ) as string[];

  // Fetch full objects for Regions, Cities, Categories based on IDs
  // We use Promise.all again for these
  const [regionsDocs, citiesDocs, categoriesDocs] = await Promise.all([
    regionIds.length > 0
      ? payloadClient.find({
          collection: "regions",
          where: { id: { in: regionIds } },
          limit: 100,
          sort: "title",
        })
      : { docs: [] },
    cityIds.length > 0
      ? payloadClient.find({
          collection: "cities",
          where: { id: { in: cityIds } },
          limit: 100,
          sort: "title",
        })
      : { docs: [] },
    categoryIds.length > 0
      ? payloadClient.find({
          collection: "categories",
          where: { id: { in: categoryIds } },
          limit: 100,
          sort: "title",
        })
      : { docs: [] },
  ]);

  // Calculate Stats
  let minPrice = 0;
  let maxPrice = 1000000;
  let minSize = 0;
  let maxSize = 1000;

  if (statsResult.docs.length > 0) {
    const prices = statsResult.docs
      .map((p: any) => p.price)
      .filter((n: any) => typeof n === "number");
    const sizes = statsResult.docs
      .map((p: any) => p.size)
      .filter((n: any) => typeof n === "number");

    if (prices.length) {
      minPrice = Math.floor(Math.min(...prices));
      maxPrice = Math.ceil(Math.max(...prices));
    }
    if (sizes.length) {
      minSize = Math.floor(Math.min(...sizes));
      maxSize = Math.ceil(Math.max(...sizes));
    }
  }

  return {
    regions: regionsDocs.docs as Region[],
    cities: citiesDocs.docs as City[],
    categories: categoriesDocs.docs as Category[],
    purposes: distinctPurposes,
    stats: {
      minPrice,
      maxPrice,
      minSize,
      maxSize,
    },
  };
}
