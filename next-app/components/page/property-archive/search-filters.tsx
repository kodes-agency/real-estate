"use client";

import { PropertyFilters } from "@/actions/properties";
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
import { Loader2, X, SlidersHorizontal, Check } from "lucide-react";
import { Region, City, Category } from "@/payload-types";
import { propertyPurposeSelect } from "@/types/payload-select";
import { HomePage } from "@/payload-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { GoldButton } from "@/components/ui/gold-button";
import { SlidersHorizontalIcon } from "@phosphor-icons/react";

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

export function PropertySearchFilters({
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
      const minP = initialPriceFrom ?? options.stats.minPrice;
      const maxP = initialPriceTo ?? options.stats.maxPrice;
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
      if (key === "region") {
        params.delete("city");
      }
    } else if (Array.isArray(value)) {
      params.delete(key);
      value.forEach((v) => params.append(key, v));
    } else {
      params.set(key, String(value));
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasFilters = Array.from(searchParams.keys()).some(
    (key) => key !== "page" && key !== "sort",
  );
  const isLoadingOptions = !options;
  const isForSale = currentFilters.purpose?.includes("for_sale");
  const isForRent = currentFilters.purpose?.includes("for_rent");

  const commonProps = {
    currentFilters,
    options,
    isLoadingOptions,
    hasFilters,
    priceRange,
    sizeRange,
    setPriceRange,
    setSizeRange,
    updateFilter,
    clearFilters,
    searchParams,
    router,
    pathname,
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block w-full max-w-5xl mx-auto relative mt-28">
        {/* Tabs */}
        <div className="absolute bg-gray-300 left-0 w-60 h-10 rounded-t-md -top-10 flex overflow-hidden">
          <button
            onClick={() => updateFilter("purpose", ["for_sale"])}
            className={`flex-1 cursor-pointer flex items-center justify-center font-medium transition-colors text-sm ${
              isForSale
                ? "bg-background text-foreground font-bold! underline"
                : " text-black font-normal! bg-background"
            }`}
          >
            Продажба
          </button>
          <button
            onClick={() => updateFilter("purpose", ["for_rent"])}
            className={`flex-1 cursor-pointer flex items-center justify-center font-medium transition-colors text-sm ${
              isForRent
                ? "bg-background text-foreground font-bold!  underline"
                : " text-black font-normal! bg-background"
            }`}
          >
            Наем
          </button>
        </div>

        {/* Main Container */}
        <div className="bg-background rounded-b-md rounded-tr-md pb-6 pt-4 px-6 shadow-xl w-full">
          <FilterControls {...commonProps} isMobile={false} />
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <Dialog open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          {/* 
            Fix for validateDOMNesting: <button> cannot appear as a descendant of <button>.
            DialogTrigger renders a button by default (Base UI / Radix).
            Button component also renders a button.
            Using asChild on DialogTrigger should merge them, but checking components/ui/dialog.tsx shows it just spreads props to DialogPrimitive.Trigger.
            If Base UI's Trigger supports asChild, it should work. But to be safe and fix the error, 
            we will apply the button styles to the Trigger directly and NOT render a nested Button component.
          */}
          <DialogTrigger
            className={cn(
              "fixed bottom-6 left-0 right-0 w-fit p-2 rounded-md group shadow-2xl/30 mx-auto z-50 bg-white flex items-center justify-center cursor-pointer",
              // We can manually add buttonVariants utils or just copy typical button classes as above.
              // Let's use standard button classes for "default" "lg" vriant.
            )}
          >
            <GoldButton
              as="div"
              borderWidth={2}
              className="flex items-center gap-2 bg-foreground rounded-md group-hover:bg-foreground! hover:shadow-xl/30  h-12 px-8 font-medium text-white shadow-md/30"
            >
              <SlidersHorizontalIcon size={20} />
              Филтри
            </GoldButton>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto w-[95%] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Филтри</DialogTitle>
            </DialogHeader>

            {/* Mobile Purpose Selection */}
            <div className="flex gap-2 mb-4 bg-primary/70 p-1 rounded-md">
              <button
                onClick={() => updateFilter("purpose", ["for_sale"])}
                className={cn(
                  "flex-1 py-3 text-sm font-medium rounded-sm transition-all",
                  isForSale
                    ? "bg-foreground shadow-sm text-background"
                    : "text-black hover:text-black",
                )}
              >
                Продажба
              </button>
              <button
                onClick={() => updateFilter("purpose", ["for_rent"])}
                className={cn(
                  "flex-1 py-3 text-sm font-medium rounded-sm transition-all",
                  isForRent
                    ? "bg-foreground shadow-sm text-background"
                    : "text-black hover:text-black",
                )}
              >
                Наем
              </button>
            </div>

            <FilterControls {...commonProps} isMobile={true} />

            <DialogFooter className="sticky bottom-0 bg-background pt-4 mt-6 border-t">
              <div className="flex gap-2 w-full">
                {hasFilters && (
                  <button
                    className="flex-1 rounded-md border-2"
                    onClick={clearFilters}
                  >
                    Изчисти
                  </button>
                )}
                <GoldButton
                  borderWidth={2}
                  className="flex-1 rounded-md bg-black text-white h-12 shadow-md/30 hover:bg-foreground"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Виж резултати
                </GoldButton>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

// Extracted Filter Controls Component
function FilterControls({
  currentFilters,
  options,
  isLoadingOptions,
  hasFilters,
  priceRange,
  sizeRange,
  setPriceRange,
  setSizeRange,
  updateFilter,
  clearFilters,
  searchParams,
  router,
  pathname,
  isMobile,
}: any) {
  const [startTransition] = useTransition();

  return (
    <div className="space-y-6">
      {/* Selects Row */}
      <div className="flex flex-col md:flex-row gap-2 items-end">
        {/* Region */}
        <div className="w-full space-y-2">
          {isMobile && <Label>Област</Label>}
          <Select
            value={currentFilters.region || "all"}
            onValueChange={(v) => updateFilter("region", v)}
            disabled={!options || options.regions.length === 0}
          >
            <SelectTrigger
              label={isMobile ? undefined : "Област"}
              className="w-full h-12 md:h-14 bg-white"
            >
              <SelectValue placeholder="Изберете област">
                {currentFilters.region
                  ? options?.regions.find(
                      (r: Region) => r.id === Number(currentFilters.region),
                    )?.title || "Изберете област"
                  : "Изберете област"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всички</SelectItem>
              {options?.regions.map((r: Region) => (
                <SelectItem key={r.id} value={String(r.id)}>
                  {r.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Divider - Only on Desktop */}
        {!isMobile && (
          <div className="h-px w-full md:h-14 md:min-w-px md:w-px bg-foreground/20"></div>
        )}

        {/* City */}
        <div className="w-full space-y-2">
          {isMobile && <Label>Населено място</Label>}
          <Select
            value={currentFilters.city || "all"}
            onValueChange={(v) => updateFilter("city", v)}
            disabled={
              (!currentFilters.region &&
                (!options?.cities || options.cities.length === 0)) ||
              !options ||
              options.cities.length === 0
            }
          >
            <SelectTrigger
              label={isMobile ? undefined : "Населено място"}
              className="w-full h-12 md:h-14 bg-white"
            >
              <SelectValue placeholder="Изберете населено място">
                {currentFilters.city
                  ? options?.cities.find(
                      (c: City) => c.id === Number(currentFilters.city),
                    )?.title || "Изберете населено място"
                  : "Изберете населено място"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всички</SelectItem>
              {options?.cities.map((c: City) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Divider - Only on Desktop */}
        {!isMobile && (
          <div className="h-px w-full md:h-14 md:min-w-px md:w-px bg-foreground/20"></div>
        )}

        {/* Category */}
        <div className="w-full space-y-2">
          {isMobile && <Label>Категория</Label>}
          <Select
            value={currentFilters.category || "all"}
            onValueChange={(v) => updateFilter("category", v)}
            disabled={!options || options.categories.length === 0}
          >
            <SelectTrigger
              label={isMobile ? undefined : "Категория"}
              className="w-full h-12 md:h-14 bg-white"
            >
              <SelectValue placeholder="Категория">
                {currentFilters.category
                  ? options?.categories.find(
                      (c: Category) => c.id === Number(currentFilters.category),
                    )?.title || "Категория"
                  : "Категория"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всички</SelectItem>
              {options?.categories.map((c: Category) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sliders Row */}
      <div
        className={cn(
          "grid grid-cols-1 gap-8 pt-4",
          isMobile ? "" : "md:grid-cols-2 border-t border-border/50",
        )}
      >
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
              // startTransition happens in parent logic via router push?
              // The passed update logic is mainly updateFilter.
              // For sliders we need to manually trigger router push or expose a commit function.
              // Since we passed router/pathname/startTransition logic via updateFilter wrapper or raw params?
              // We passed 'router' and 'pathname'.
              router.push(`${pathname}?${params.toString()}`, {
                scroll: false,
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
            className=""
            value={sizeRange}
            onValueChange={(val) => setSizeRange(val as [number, number])}
            onValueCommitted={(val: number | readonly number[]) => {
              const params = new URLSearchParams(searchParams.toString());
              const values = Array.isArray(val) ? val : [val];
              params.set("sizeFrom", String(values[0]));
              params.set("sizeTo", String(values[1]));
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
            disabled={!options}
          />
        </div>
      </div>

      {/* Active Filters Badges - Only visible on Desktop within this component. 
          For mobile, we might want them inside or just rely on the UI state? 
          The previous design had them at the bottom.
       */}
      {!isMobile && hasFilters && (
        <div className="flex flex-wrap gap-2 pt-0">
          <div className="w-full flex justify-between items-center mb-2">
            <Label className="text-foreground text-xs uppercase font-bold">
              Активни филтри
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-muted-foreground text-xs"
            >
              Изчисти всички
              <X className="ml-2 h-3 w-3" />
            </Button>
          </div>

          {currentFilters.region && (
            <Badge
              variant="secondary"
              className="px-2 py-1 gap-1 bg-primary h-6"
            >
              Област:{" "}
              {
                options?.regions.find(
                  (r: Region) => r.id === Number(currentFilters.region),
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
            <Badge
              variant="secondary"
              className="px-2 py-1 gap-1 bg-primary h-6"
            >
              Населено място:{" "}
              {
                options?.cities.find(
                  (c: City) => c.id === Number(currentFilters.city),
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
            <Badge
              variant="secondary"
              className="px-2 py-1 gap-1 bg-primary h-6"
            >
              Тип:{" "}
              {
                options?.categories.find(
                  (c: Category) => c.id === Number(currentFilters.category),
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

          {/* Price Badge */}
          {((currentFilters.priceFrom !== undefined &&
            currentFilters.priceFrom !== options?.stats?.minPrice) ||
            (currentFilters.priceTo !== undefined &&
              currentFilters.priceTo !== options?.stats?.maxPrice)) && (
            <Badge
              variant="secondary"
              className="px-2 py-1 gap-1 bg-primary h-6"
            >
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
                  router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
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

          {/* Size Badge */}
          {((currentFilters.sizeFrom !== undefined &&
            currentFilters.sizeFrom !== options?.stats?.minSize) ||
            (currentFilters.sizeTo !== undefined &&
              currentFilters.sizeTo !== options?.stats?.maxSize)) && (
            <Badge
              variant="secondary"
              className="px-2 py-1 gap-1 bg-primary h-6"
            >
              Площ: {currentFilters.sizeFrom ?? options?.stats?.minSize ?? 0} -{" "}
              {currentFilters.sizeTo ?? options?.stats?.maxSize ?? 1000} м²
              <span
                role="button"
                className="cursor-pointer hover:text-foreground"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("sizeFrom");
                  params.delete("sizeTo");
                  router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
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
          {/* Purpose Badge */}
          {currentFilters.purpose && currentFilters.purpose.length > 0 && (
            <>
              {currentFilters.purpose.map((p: string) => (
                <Badge
                  key={p}
                  variant="secondary"
                  className="px-2 py-1 gap-1 bg-primary h-6"
                >
                  Сделка:{" "}
                  {propertyPurposeSelect.find((opt) => opt.value === p)
                    ?.label || p}
                  <span
                    role="button"
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => {
                      const newPurpose = currentFilters.purpose?.filter(
                        (x: string) => x !== p,
                      );
                      updateFilter(
                        "purpose",
                        newPurpose && newPurpose.length > 0
                          ? newPurpose
                          : undefined,
                      );
                    }}
                  >
                    <X className="h-3 w-3" />
                  </span>
                </Badge>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
