import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Начало",
  admin: {
    group: "Страници",
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTag("home-page");
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
          type: "text",
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
      name: "search",
      label: "Търсене",
      fields: [
        {
          name: "title",
          type: "richText",
          required: true,
          label: "Заглавие",
        },
        {
          name: "disclaimer",
          type: "text",
          label: "Дребен текст",
        },
      ],
    },
    {
      type: "group",
      name: "propertiesFeatured",
      label: "Препоръчани обяви",
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
      ],
    },
    {
      type: "group",
      name: "propertiesNewest",
      label: "Най-нови обяви",
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
          type: "array",
          name: "stats",
          label: "Статистика",
          required: true,
          minRows: 2,
          maxRows: 4,
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "number",
                  type: "number",
                  required: true,
                  label: "Номер",
                },
                {
                  name: "sign",
                  type: "text",
                  required: true,
                  label: "Знак",
                },
                {
                  name: "subtitle",
                  type: "text",
                  label: "Подзаглавие",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          type: "richText",
          name: "content",
          label: "Съдържание",
          required: true,
        },
        {
          type: "upload",
          name: "image",
          relationTo: "images",
          required: true,
          label: "Изображение",
        },
      ],
    },
  ],
};
