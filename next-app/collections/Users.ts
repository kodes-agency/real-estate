import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Агент",
    plural: "Агенти",
  },
  admin: {
    useAsTitle: "name",
    group: "Администрация",
  },
  auth: true,
  fields: [
    {
      type: "text",
      name: "name",
      label: "Име",
      // required: true,
      defaultValue: "admin",
    },
    {
      type: "text",
      name: "phone",
      label: "Телефон",
    },
    {
      type: "upload",
      name: "avatar",
      label: "Аватар",
      relationTo: "media",
    },

    // Email added by default
    // Add more fields as needed
  ],
};
