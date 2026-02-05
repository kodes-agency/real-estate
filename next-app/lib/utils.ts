import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { unstable_cache } from "next/cache";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCollectionData<T>(
  data: number | T | null | undefined,
): T | null {
  if (data && typeof data === "object") {
    return data;
  }
  return null;
}

export function createCache<T>(
  fetcher: () => Promise<T>,
  key: string[] = [],
  tags: string[] = [],
) {
  return unstable_cache(fetcher, key, { tags });
}
