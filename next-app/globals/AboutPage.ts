import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "За нас",
  admin: {
    group: "Страници",
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTag("about-page");
      },
    ],
  },
  fields: [
    {
      type: "group",
      name: "hero",
      label: "Начало",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: "Заглавие",
        },
        {
          name: "subtitle",
          type: "textarea",
          required: true,
          label: "Подзаглавие",
        },
        {
          name: "images",
          type: "upload",
          relationTo: "images",
          hasMany: true,
          required: true,
          label: "Изображения",
        },
      ],
    },
    {
      type: "group",
      name: "about",
      label: "За нас",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: "Заглавие",
        },
        {
          name: "subtitle",
          type: "textarea",
          label: "Подзаглавие",
          required: true,
        },
        {
          name: "image",
          type: "upload",
          relationTo: "images",
          label: "Изображение",
        },
        {
          type: "array",
          name: "principles",
          label: "Принципи",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              label: "Заглавие",
            },
            {
              name: "content",
              type: "richText",
              label: "Съдържание",
              required: true,
            },
            {
              name: "images",
              type: "upload",
              relationTo: "images",
              hasMany: true,
              required: true,
              label: "Изображения",
            },
          ],
        },
      ],
    },
    {
      type: "group",
      name: "cta",
      label: "Призив към действие",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: "Заглавие",
        },
        {
          name: "subtitle",
          type: "textarea",
          label: "Подзаглавие",
          // required: true,
        },
        {
          type: "row",
          fields: [
            {
              name: "buttonText",
              type: "text",
              required: true,
              label: "Текст на бутона",
            },
            {
              name: "buttonLink",
              type: "text",
              required: true,
              label: "Линк на бутона",
            },
          ],
        },
      ],
    },
  ],
};
