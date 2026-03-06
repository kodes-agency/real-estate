import type { GlobalConfig } from "payload";

export const PrivacyPolicy: GlobalConfig = {
  slug: "privacy-policy",
  label: "Политика за поверителност",
  admin: {
    group: "Страници",
    description: "Политика за поверителност",
  },

  fields: [
    {
      name: "content",
      label: "Съдържание",
      type: "richText",
      required: true,
    },
  ],
};
