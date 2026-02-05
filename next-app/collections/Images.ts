import type { CollectionConfig } from "payload";

export const Images: CollectionConfig = {
  slug: "images",
  labels: {
    singular: "Изображение за сайта",
    plural: "Изображения за сайта",
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "alt",
    group: "Медия",
  },
  fields: [
    {
      label: "Алтернативен текст",
      name: "alt",
      type: "text",
    },
  ],
  upload: {
    formatOptions: {
      format: "webp",
      options: {
        quality: 90,
      },
    },
  },
};
