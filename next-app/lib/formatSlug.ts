import type { FieldHook } from "payload";

const transliterate = (text: string): string => {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sht",
    ъ: "a",
    ь: "y",
    ю: "yu",
    я: "ya",
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Е: "E",
    Ж: "Zh",
    З: "Z",
    И: "I",
    Й: "Y",
    К: "K",
    Л: "L",
    М: "M",
    Н: "N",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "Ts",
    Ч: "Ch",
    Ш: "Sh",
    Щ: "Sht",
    Ъ: "A",
    Ь: "Y",
    Ю: "Yu",
    Я: "Ya",
  };

  return text
    .split("")
    .map((char) => map[char] || char)
    .join("");
};

export const formatSlug =
  (fallback: string, suffixVariable?: string): FieldHook =>
  async ({ value, originalDoc, data, req, collection }) => {
    if (typeof value === "string" && value.length > 0) {
      return toSlug(value);
    }
    const fallbackData = data?.[fallback] || originalDoc?.[fallback];

    if (fallbackData && typeof fallbackData === "string") {
      let slug = fallbackData;

      if (suffixVariable) {
        const suffixData =
          data?.[suffixVariable] || originalDoc?.[suffixVariable];
        if (suffixData) {
          slug = `${slug} ${suffixData}`;
        }
      }

      slug = toSlug(slug);

      if (!collection) {
        return slug;
      }

      const checkSlug = async (slugToCheck: string): Promise<string | null> => {
        const results = await req.payload.find({
          collection: collection.slug,
          where: {
            slug: {
              equals: slugToCheck,
            },
          },
        });

        if (results.totalDocs > 0) {
          // Check if the document found is the same one we are editing
          if (originalDoc && results.docs[0].id === originalDoc.id) {
            return slugToCheck;
          }
        } else {
          return slugToCheck;
        }

        return null; // Collision found
      };

      // Check original slug first
      let uniqueSlug = await checkSlug(slug);
      if (uniqueSlug) return uniqueSlug;

      // Append id if available and collision occurred (and id wasn't already part of slug)
      // Or just append counter
      let count = 1;

      while (!uniqueSlug) {
        const candidate = `${slug}-${count}`;
        uniqueSlug = await checkSlug(candidate);
        count++;
      }

      return uniqueSlug;
    }

    return value;
  };

const toSlug = (text: string): string => {
  return transliterate(text)
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove non-Latin characters
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
};
