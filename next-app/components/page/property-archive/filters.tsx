"use client";

import { PropertyFilters } from "@/actions/properties"; // We don't need getFilterOptions here anymore
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Region, City, Category } from "@/payload-types";
import { propertyPurposeSelect } from "@/types/payload-select";
import { getCollectionData } from "@/lib/utils";
import { HomePage } from "@/payload-types";

type FilterOptions = {
  regions: Region[];
  cities: City[];
  categories: Category[];
  purposes?: string[];
  stats: {
    minPrice: number;
    maxPrice: number;
    minSize: number;
    maxSize: number;
  };
};

export function PropertyFiltersComponent({
  options,
  homePage,
}: {
  options: FilterOptions;
  homePage: HomePage;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Parse params
  const initialPriceFrom = searchParams.get("priceFrom")
    ? Number(searchParams.get("priceFrom"))
    : undefined;
  const initialPriceTo = searchParams.get("priceTo")
    ? Number(searchParams.get("priceTo"))
    : undefined;
  const initialSizeFrom = searchParams.get("sizeFrom")
    ? Number(searchParams.get("sizeFrom"))
    : undefined;
  const initialSizeTo = searchParams.get("sizeTo")
    ? Number(searchParams.get("sizeTo"))
    : undefined;

  const currentFilters: PropertyFilters = {
    priceFrom: initialPriceFrom,
    priceTo: initialPriceTo,
    sizeFrom: initialSizeFrom,
    sizeTo: initialSizeTo,
    purpose: Array.from(new Set(searchParams.getAll("purpose"))),
    region: searchParams.get("region") || undefined,
    city: searchParams.get("city") || undefined,
    category: searchParams.get("category") || undefined,
  };

  // Local state for sliders
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sizeRange, setSizeRange] = useState<[number, number]>([0, 1000]);

  // Update slider local state when options load (if not filtering) or when URL changes
  useEffect(() => {
    if (options?.stats) {
      // Only update from options if we are not filtering in URL, OR if strict bounds enforcement is needed.
      // Here we prioritize URL params if present
      const minP = initialPriceFrom ?? options.stats.minPrice;
      const maxP = initialPriceTo ?? options.stats.maxPrice;
      // Ensure min <= max
      setPriceRange([minP, Math.max(minP, maxP)]);

      const minS = initialSizeFrom ?? options.stats.minSize;
      const maxS = initialSizeTo ?? options.stats.maxSize;
      setSizeRange([minS, Math.max(minS, maxS)]);
    }
  }, [
    options?.stats,
    initialPriceFrom,
    initialPriceTo,
    initialSizeFrom,
    initialSizeTo,
  ]);

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    const params = new URLSearchParams(searchParams.toString());

    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "all"
    ) {
      params.delete(key);
      // If clearing region, clear city too
      if (key === "region") {
        params.delete("city");
      }
    } else if (Array.isArray(value)) {
      params.delete(key);
      value.forEach((v) => params.append(key, v));
    } else {
      params.set(key, String(value));
    }

    params.set("page", "1"); // Reset page

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasFilters = searchParams.toString().length > 0;

  const purposeOptions =
    options?.purposes && options.purposes.length > 0
      ? options.purposes
      : ["for_sale", "for_rent"];

  return (
    <div
      style={{
        backgroundImage: `url(${getCollectionData(homePage?.hero?.images?.[3])?.url})`,
      }}
      className="w-full min-h-[50vh] rounded-2xl bg-cover bg-center border border-primary relative p-10 flex flex-col justify-end items-center"
    >
      <div className="absolute inset-0 bg-black opacity-50 rounded-2xl pointer-events-none z-0"></div>{" "}
      <section className="w-full bg-white rounded-2xl p-6 max-w-4xl z-10">
        <div className="flex items-center justify-w=">
          <h2 className="text-lg font-semibold sr-only">Филтри</h2>
          {isPending && (
            <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
          )}
          {!isPending && hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 text-muted-foreground"
            >
              Изчисти
              <X className="ml-2 h-3 w-3" />
            </Button>
          )}
        </div>
        {/* Top Row: Region, City, Type, Purpose */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Region */}
          <div className="space-y-2">
            <Label>Област</Label>
            <Select
              value={currentFilters.region || "all"}
              onValueChange={(v) => updateFilter("region", v)}
              disabled={!options}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Всички">
                  {currentFilters.region
                    ? options?.regions.find(
                        (r) => r.id === Number(currentFilters.region),
                      )?.title
                    : "Всички"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всички</SelectItem>
                {options?.regions.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* City */}
          <div className="space-y-2">
            <Label>Населено място</Label>
            <Select
              disabled={
                !currentFilters.region &&
                (!options?.cities || options.cities.length === 0)
              }
              value={currentFilters.city || "all"}
              onValueChange={(v) => updateFilter("city", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Всички">
                  {currentFilters.city
                    ? options?.cities.find(
                        (c) => c.id === Number(currentFilters.city),
                      )?.title
                    : "Всички"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всички</SelectItem>
                {options?.cities.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Type */}
          <div className="space-y-2">
            <Label>Тип имот</Label>
            <Select
              value={currentFilters.category || "all"}
              onValueChange={(v) => updateFilter("category", v)}
              disabled={!options}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Всички">
                  {currentFilters.category
                    ? options?.categories.find(
                        (c) => c.id === Number(currentFilters.category),
                      )?.title
                    : "Всички"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всички</SelectItem>
                {options?.categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Purpose */}
          <div className="space-y-2">
            <Label>Тип сделка</Label>
            <Select
              value={currentFilters.purpose?.[0] || "all"}
              onValueChange={(v) =>
                updateFilter("purpose", v === "all" ? undefined : [v])
              }
              disabled={!options}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Всички">
                  {currentFilters.purpose?.[0]
                    ? propertyPurposeSelect.find(
                        (opt) => opt.value === currentFilters.purpose?.[0],
                      )?.label || currentFilters.purpose?.[0]
                    : "Всички"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всички</SelectItem>
                {purposeOptions.map((p) => {
                  const label =
                    propertyPurposeSelect.find((opt) => opt.value === p)
                      ?.label || p;
                  return (
                    <SelectItem key={p} value={p}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Sliders Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* Price */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Цена (€)</Label>
              <span className="text-sm text-muted-foreground tabular-nums">
                {priceRange[0].toLocaleString()} -{" "}
                {priceRange[1].toLocaleString()} €
              </span>
            </div>
            <Slider
              min={options?.stats?.minPrice ?? 0}
              max={options?.stats?.maxPrice ?? 1000000}
              step={100}
              value={priceRange}
              onValueChange={(val) => setPriceRange(val as [number, number])}
              onValueCommitted={(val: number | readonly number[]) => {
                const params = new URLSearchParams(searchParams.toString());
                const values = Array.isArray(val) ? val : [val];
                params.set("priceFrom", String(values[0]));
                params.set("priceTo", String(values[1]));
                params.set("page", "1");
                startTransition(() => {
                  router.push(`?${params.toString()}`, { scroll: false });
                });
              }}
              disabled={!options}
            />
          </div>
          {/* Size */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Площ (м²)</Label>
              <span className="text-sm text-muted-foreground tabular-nums">
                {sizeRange[0]} - {sizeRange[1]} м²
              </span>
            </div>
            <Slider
              min={options?.stats?.minSize ?? 0}
              max={options?.stats?.maxSize ?? 1000}
              step={1}
              value={sizeRange}
              onValueChange={(val) => setSizeRange(val as [number, number])}
              onValueCommitted={(val: number | readonly number[]) => {
                const params = new URLSearchParams(searchParams.toString());
                const values = Array.isArray(val) ? val : [val];
                params.set("sizeFrom", String(values[0]));
                params.set("sizeTo", String(values[1]));
                params.set("page", "1");
                startTransition(() => {
                  router.push(`?${params.toString()}`, { scroll: false });
                });
              }}
              disabled={!options}
            />
          </div>
        </div>
        {/* Active Filters Badges */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {currentFilters.region && (
              <Badge variant="secondary" className="px-2 py-1 gap-1">
                Област:{" "}
                {
                  options?.regions.find(
                    (r) => r.id === Number(currentFilters.region),
                  )?.title
                }
                <span
                  role="button"
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => updateFilter("region", undefined)}
                >
                  <X className="h-3 w-3" />
                </span>
              </Badge>
            )}
            {currentFilters.city && (
              <Badge variant="secondary" className="px-2 py-1 gap-1">
                Населено място:{" "}
                {
                  options?.cities.find(
                    (c) => c.id === Number(currentFilters.city),
                  )?.title
                }
                <span
                  role="button"
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => updateFilter("city", undefined)}
                >
                  <X className="h-3 w-3" />
                </span>
              </Badge>
            )}
            {currentFilters.category && (
              <Badge variant="secondary" className="px-2 py-1 gap-1">
                Тип:{" "}
                {
                  options?.categories.find(
                    (c) => c.id === Number(currentFilters.category),
                  )?.title
                }
                <span
                  role="button"
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => updateFilter("category", undefined)}
                >
                  <X className="h-3 w-3" />
                </span>
              </Badge>
            )}
            {currentFilters.purpose &&
              currentFilters.purpose.length > 0 &&
              currentFilters.purpose.map((p) => {
                const label =
                  propertyPurposeSelect.find((opt) => opt.value === p)?.label ||
                  p;
                return (
                  <Badge
                    key={p}
                    variant="secondary"
                    className="px-2 py-1 gap-1"
                  >
                    Сделка: {label}
                    <span
                      role="button"
                      className="cursor-pointer hover:text-foreground"
                      onClick={() => updateFilter("purpose", "all")}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                );
              })}
            {/* Only show price badge if range is different from default min/max */}
            {((currentFilters.priceFrom !== undefined &&
              currentFilters.priceFrom !== options?.stats?.minPrice) ||
              (currentFilters.priceTo !== undefined &&
                currentFilters.priceTo !== options?.stats?.maxPrice)) && (
              <Badge variant="secondary" className="px-2 py-1 gap-1">
                Цена:{" "}
                {(
                  currentFilters.priceFrom ??
                  options?.stats?.minPrice ??
                  0
                ).toLocaleString()}{" "}
                -{" "}
                {(
                  currentFilters.priceTo ??
                  options?.stats?.maxPrice ??
                  1000000
                ).toLocaleString()}{" "}
                €
                <span
                  role="button"
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("priceFrom");
                    params.delete("priceTo");
                    startTransition(() => {
                      router.push(`?${params.toString()}`, { scroll: false });
                    });
                    // Reset local state
                    if (options?.stats) {
                      setPriceRange([
                        options.stats.minPrice,
                        options.stats.maxPrice,
                      ]);
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              </Badge>
            )}
            {/* Only show size badge if range is different from default min/max */}
            {((currentFilters.sizeFrom !== undefined &&
              currentFilters.sizeFrom !== options?.stats?.minSize) ||
              (currentFilters.sizeTo !== undefined &&
                currentFilters.sizeTo !== options?.stats?.maxSize)) && (
              <Badge variant="secondary" className="px-2 py-1 gap-1">
                Площ: {currentFilters.sizeFrom ?? options?.stats?.minSize ?? 0}{" "}
                - {currentFilters.sizeTo ?? options?.stats?.maxSize ?? 1000} м²
                <span
                  role="button"
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("sizeFrom");
                    params.delete("sizeTo");
                    startTransition(() => {
                      router.push(`?${params.toString()}`, { scroll: false });
                    });
                    // Reset local state
                    if (options?.stats) {
                      setSizeRange([
                        options.stats.minSize,
                        options.stats.maxSize,
                      ]);
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              </Badge>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
