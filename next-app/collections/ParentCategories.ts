import type { CollectionConfig } from "payload";
import { formatSlug } from "../lib/formatSlug";

export const ParentCategories: CollectionConfig = {
  slug: "parent-categories",

  labels: {
    singular: "Категория (Група)",
    plural: "Категории (Групи)",
  },
  admin: {
    defaultColumns: ["title"],
    useAsTitle: "title",
    group: "Категории, особености и етикети",
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "title",
          required: true,
          type: "text",
          label: "Наименование на категорията",
        },
        {
          type: "text",
          name: "slug",
          label: "URL",
          admin: {
            readOnly: true,
          },
          hooks: {
            beforeValidate: [formatSlug("title")],
          },
        },
      ],
    },
  ],
};
