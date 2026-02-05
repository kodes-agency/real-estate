import type { CollectionConfig } from "payload";

export const Requests: CollectionConfig = {
  slug: "requests",
  labels: {
    singular: "Заявка за оглед",
    plural: "Заявки за оглед",
  },
  admin: {
    defaultColumns: ["firstName", "lastName", "email", "phone", "createdAt"],
    useAsTitle: "firstName",
    group: "Администрация",
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "firstName",
          type: "text",
          label: "Име",
          required: true,
        },
        {
          name: "lastName",
          type: "text",
          label: "Фамилия",
          required: true,
        },
        {
          name: "email",
          type: "text",
          label: "Email",
          required: true,
        },
        {
          name: "phone",
          type: "text",
          label: "Телефон",
          required: true,
        },
      ],
    },
    {
      type: "relationship",
      name: "property",
      relationTo: "properties",
      required: false,
    },
  ],
};
