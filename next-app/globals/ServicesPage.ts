import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  label: "Услуги",
  hooks: {
    afterChange: [
      () => {
        revalidateTag("services-page");
      },
    ],
  },
  admin: {
    group: "Страници",
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
          ],
        },
      ],
    },
    {
      type: "group",
      name: "whyUs",
      label: "Защо да изберете нас",
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
        },
        {
          type: "array",
          name: "whyUs",
          label: "Защо да изберете нас",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              label: "Заглавие",
            },
          ],
        },
        {
          name: "image",
          type: "upload",
          relationTo: "images",
          required: true,
          label: "Изображение",
        },
      ],
    },
    {
      type: "group",
      name: "additionalServices",
      label: "Допълнителни услуги",
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
          type: "array",
          name: "additionalServices",
          label: "Допълнителни услуги",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              label: "Заглавие",
            },
            {
              name: "content",
              type: "textarea",
              label: "Подзаглавие",
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
        {
          name: "images",
          type: "upload",
          relationTo: "images",
          hasMany: true,
          label: "Изображения",
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
          type: "textarea",
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
};
