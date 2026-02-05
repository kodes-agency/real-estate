import type { CollectionConfig } from "payload";
import { formatSlug } from "@/lib/formatSlug";

export const Regions: CollectionConfig = {
  slug: "regions",
  labels: {
    singular: "Област",
    plural: "Области",
  },
  admin: {
    defaultColumns: ["title", "createdAt"],
    useAsTitle: "title",
    group: "География",
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Област",
          required: true,
          admin: {
            width: "50%",
            description: "Име на областта",
          },
        },
        {
          name: "slug",
          type: "text",
          label: "URL",
          required: true,
          hooks: {
            beforeValidate: [formatSlug("title")],
          },
          admin: {
            readOnly: true,
            width: "50%",
            description: "URL на областта",
          },
        },
      ],
    },
  ],
};
