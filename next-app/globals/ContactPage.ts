import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Контакти",
  admin: {
    group: "Страници",
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTag("contact-page");
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
      name: "contact",
      label: "",
      fields: [
        {
          type: "text",
          name: "title",
          label: "Заглавие",
        },
        {
          type: "array",
          name: "contacts",
          label: "Контакти",
          labels: {
            singular: "Контакт",
            plural: "Контакти",
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "label",
                  type: "text",
                  required: true,
                  label: "Вид",
                },
                {
                  name: "value",
                  type: "text",
                  label: "Стойност",
                },
                {
                  name: "link",
                  type: "text",
                  label: "Линк",
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "isSocial",
                  type: "checkbox",
                  label: "Социална мрежа",
                },
                {
                  name: "isMain",
                  type: "checkbox",
                  label: "Основен",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "group",
      name: "map",
      label: "Адрес",
      fields: [
        {
          name: "address",
          type: "text",
          required: true,
          label: "Адрес",
        },
        {
          name: "addressLink",
          type: "text",
          required: true,
          label: "Линк",
        },
        {
          name: "mapQuery",
          type: "text",
          required: true,
          label: "Търсене в картата",
        },
      ],
    },
  ],
};
