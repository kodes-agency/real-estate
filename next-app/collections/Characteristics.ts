import { formatSlug } from "@/lib/formatSlug";
import { iconPickerField } from "@/fields/IconPicker";
import type { CollectionConfig } from "payload";

export const Characteristics: CollectionConfig = {
  slug: "characteristics",
  labels: {
    singular: "Особеност",
    plural: "Особености",
  },
  admin: {
    defaultColumns: ["title", "icon", "createdAt"],
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
          label: "Наименование на особеността",
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
        iconPickerField({
          label: "Иконка",
          required: true,
          admin: {
            width: "30%",
          },
        }),
      ],
    },
  ],
};
