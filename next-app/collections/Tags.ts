import { formatSlug } from "@/lib/formatSlug";
import type { CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
  slug: "tags",
  labels: {
    singular: "Етикет",
    plural: "Етикети",
  },
  admin: {
    defaultColumns: ["title", "status", "createdAt"],
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
          label: "Наименование на етикета",
          admin: {
            width: "75%",
          },
        },
        {
          type: "text",
          name: "slug",
          label: "URL",
          admin: {
            readOnly: true,
            width: "25%",
          },
          hooks: {
            beforeValidate: [formatSlug("title")],
          },
        },
      ],
    },
  ],
};
