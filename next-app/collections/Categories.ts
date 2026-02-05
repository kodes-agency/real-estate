import { formatSlug } from "@/lib/formatSlug";
import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    singular: "Категория",
    plural: "Категории",
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
          label: "Наименование на категорията",
          admin: {
            width: "50%",
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
        {
          type: "relationship",
          name: "parent",
          label: "Група на категорията",
          relationTo: "parent-categories",
          defaultValue: async ({ req }) => {
            const payload = req.payload;
            const parent = await payload.find({
              collection: "parent-categories",
              where: {
                slug: {
                  equals: "apartament",
                },
              },
            });
            return parent?.docs?.[0]?.id;
          },
          admin: {
            width: "25%",
          },
        },
      ],
    },
  ],
};
