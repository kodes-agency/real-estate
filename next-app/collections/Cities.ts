import { placeTypeSelect } from "@/types/payload-select";
import type { CollectionConfig } from "payload";

export const Cities: CollectionConfig = {
  slug: "cities",
  labels: {
    singular: "Населено място",
    plural: "Населени места",
  },
  admin: {
    defaultColumns: ["title", "createdAt"],
    useAsTitle: "name",
    group: "География",
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "type",
          type: "select",
          label: "Тип",
          required: true,
          options: placeTypeSelect,
          admin: {
            width: "25%",
            description: "Тип на населеното място - град или село",
          },
          defaultValue: "city",
        },
        {
          name: "title",
          type: "text",
          label: "Наименование",
          required: true,
          admin: {
            width: "50%",
            description:
              "Име на населено място - София, Змейово, Казанлък (без уточнение за тип - село, град)",
          },
        },

        {
          name: "region",
          type: "relationship",
          label: "Област",
          required: true,
          relationTo: "regions",
          admin: {
            width: "25%",
            description: "Област на населеното място",
          },
        },
        {
          type: "text",
          name: "name",
          admin: {
            readOnly: true,
          },
          hooks: {
            beforeValidate: [
              ({ value, siblingData }) => {
                return `${placeTypeSelect.find((item) => item.value === siblingData.type)?.label.toLowerCase()} ${siblingData.title}`;
              },
            ],
          },
        },
      ],
    },
  ],
};
