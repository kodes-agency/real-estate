"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Region, City, Category } from "@/payload-types";
import { getFilterOptions, PropertyFilters } from "@/actions/properties";

import { Label } from "@/components/ui/label";
import { GoldButton } from "@/components/ui/gold-button";

type FilterOptions = {
  regions: Region[];
  cities: City[];
  categories: Category[];
  purposes: string[];
};

export function HomeSearchBar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Local state for filters
  const [filters, setFilters] = useState<PropertyFilters>({
    region: undefined,
    city: undefined,
    category: undefined,
    purpose: ["for_sale"],
  });

  const [options, setOptions] = useState<FilterOptions>({
    regions: [],
    cities: [],
    categories: [],
    purposes: [],
  });

  // Fetch options when filters change
  useEffect(() => {
    let isMounted = true;

    const fetchOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const result = await getFilterOptions({
          ...filters,
          // Ensure we don't pass 'all' or empty strings
          region: filters.region === "all" ? undefined : filters.region,
          city: filters.city === "all" ? undefined : filters.city,
          category: filters.category === "all" ? undefined : filters.category,
        });

        if (isMounted) {
          setOptions({
            regions: result.regions,
            cities: result.cities,
            categories: result.categories,
            purposes: result.purposes || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch filter options", error);
      } finally {
        if (isMounted) {
          setIsLoadingOptions(false);
        }
      }
    };

    // Debounce slightly to avoid rapid updates if user clicks fast, though for selects it's usually fine.
    // Ideally we just want to fetch when the dependent filters change.
    fetchOptions();

    return () => {
      isMounted = false;
    };
  }, [filters.region, filters.city, filters.category, filters.purpose]);

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    setFilters((prev) => {
      const next = { ...prev };

      if (value === "all" || value === undefined) {
        // @ts-ignore
        next[key] = undefined;
        // If clearing region, clear city
        if (key === "region") {
          next.city = undefined;
        }
      } else {
        // @ts-ignore
        next[key] = value;
      }
      return next;
    });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.region && filters.region !== "all")
      params.set("region", filters.region);
    if (filters.city && filters.city !== "all")
      params.set("city", filters.city);
    if (filters.category && filters.category !== "all")
      params.set("category", filters.category);
    if (
      filters.purpose &&
      filters.purpose.length > 0 &&
      filters.purpose[0] !== "all"
    ) {
      // Logic for purpose array (single select in UI but array in filter type usually)
      params.append("purpose", filters.purpose[0]);
    }

    startTransition(() => {
      router.push(`/imoti?${params.toString()}`);
    });
  };

  return (
    <div className="bg-background rounded-b-md rounded-tr-md p-2 shadow-xl w-full max-w-4xl mx-auto relative">
      <div className="absolute bg-gray-300 left-0 w-60 h-10 rounded-t-md -top-10 flex overflow-hidden">
        <button
          onClick={() => updateFilter("purpose", ["for_sale"])}
          className={`flex-1 flex items-center justify-center font-medium transition-colors text-sm ${
            filters.purpose?.includes("for_sale")
              ? "bg-background text-foreground font-bold! rounded-tr-md!"
              : " text-black font-normal!"
          }`}
        >
          Продажба
        </button>
        <button
          onClick={() => updateFilter("purpose", ["for_rent"])}
          className={`flex-1 flex items-center justify-center font-medium transition-colors text-sm ${
            filters.purpose?.includes("for_rent")
              ? "bg-background text-foreground font-bold! rounded-tl-md!"
              : " text-black font-normal!"
          }`}
        >
          Наем
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-2 items-end">
        {/* Region */}

        {/* <Label className="text-xs text-muted-foreground uppercase font-semibold">
            Област
          </Label> */}
        <Select
          value={filters.region || "all"}
          onValueChange={(v) => updateFilter("region", v)}
          disabled={isLoadingOptions && options.regions.length === 0}
        >
          <SelectTrigger label="Област" className="w-full h-14! bg-white">
            <SelectValue placeholder="Изберете област">
              {filters.region && filters.region !== "all"
                ? options.regions.find((r) => r.id === Number(filters.region))
                    ?.title || "Изберете област"
                : "Изберете област"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички</SelectItem>
            {options.regions.map((r) => (
              <SelectItem key={r.id} value={String(r.id)}>
                {r.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* City */}
        <div className="h-px w-full md:h-14 md:min-w-px md:w-px bg-foreground/20"></div>

        <Select
          value={filters.city || "all"}
          onValueChange={(v) => updateFilter("city", v)}
          disabled={
            (!filters.region && options.cities.length === 0) ||
            (isLoadingOptions && options.cities.length === 0)
          }
        >
          <SelectTrigger
            label="Населено място"
            className="w-full h-14! bg-white"
          >
            <SelectValue placeholder="Изберете населено място">
              {filters.city && filters.city !== "all"
                ? options.cities.find((c) => c.id === Number(filters.city))
                    ?.title || "Изберете населено място"
                : "Изберете населено място"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички</SelectItem>
            {options.cities.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type */}

        {/* <Label className="text-xs text-muted-foreground uppercase font-semibold">
            Тип имот
          </Label> */}
        <div className="h-px w-full md:h-14 md:min-w-px md:w-px bg-foreground/20"></div>
        <Select
          value={filters.category || "all"}
          onValueChange={(v) => updateFilter("category", v)}
          disabled={isLoadingOptions && options.categories.length === 0}
        >
          <SelectTrigger label="Категория" className="w-full h-14! bg-white">
            <SelectValue placeholder="Категория">
              {filters.category && filters.category !== "all"
                ? options.categories.find(
                    (c) => c.id === Number(filters.category),
                  )?.title || "Категория"
                : "Категория"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички</SelectItem>
            {options.categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Purpose */}

        {/* <Label className="text-xs text-muted-foreground uppercase font-semibold">
            Тип сделка
          </Label> */}
        {/* <Select
          value={filters.purpose?.[0] || "all"}
          onValueChange={(v) => updateFilter("purpose", v === "all" ? [] : [v])}
          disabled={
            isLoadingOptions &&
            (!options.purposes || options.purposes.length === 0)
          }
        >
          <SelectTrigger
            label="Продажба/Наем"
            className="w-full h-14! bg-white"
          >
            <SelectValue placeholder="Изберете продажба или наем">
              {filters.purpose?.[0]
                ? propertyPurposeSelect.find(
                    (opt) => opt.value === filters.purpose?.[0],
                  )?.label || filters.purpose?.[0]
                : "Изберете между продажба/наем"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички</SelectItem>
            {purposeOptions.map((p) => {
              const label =
                propertyPurposeSelect.find((opt) => opt.value === p)?.label ||
                p;
              return (
                <SelectItem key={p} value={p}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select> */}

        {/* Search Button */}

        <GoldButton
          borderWidth={2}
          onClick={handleSearch}
          className="rounded-md  h-14 w-full md:w-auto md:min-w-max font-medium bg-foreground text-white shadow-md/20 hover:shadow-lg/40 cursor-pointer hover:bg-foreground transition-all ease-in-out duration-300 "
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Търси"}
        </GoldButton>
      </div>
    </div>
  );
}
