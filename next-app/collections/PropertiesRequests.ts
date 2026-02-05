import type { CollectionConfig } from "payload";
import { formatSlug } from "../lib/formatSlug";
import {
  propertyIsFeaturedSelect,
  propertyPurposeSelect,
} from "@/types/payload-select";

export const PropertiesRequests: CollectionConfig = {
  slug: "properties-requests",
  labels: {
    singular: "Оценка и клиентска продажба",
    plural: "Оценки и клиентски продажби",
  },
  admin: {
    defaultColumns: ["firstName", "lastName", "email", "phone", "createdAt"],
    useAsTitle: "firstName",
    group: "Администрация",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Обща информация",
          fields: [
            {
              type: "group",
              label: "Клиентски данни",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "firstName",
                      type: "text",
                      label: "Име",
                      admin: {
                        width: "50%",
                      },
                    },
                    {
                      name: "lastName",
                      type: "text",
                      label: "Фамилия",
                      admin: {
                        width: "50%",
                      },
                    },
                    {
                      name: "email",
                      type: "text",
                      label: "Email",
                      admin: {
                        width: "50%",
                      },
                    },
                    {
                      name: "phone",
                      type: "text",
                      label: "Телефон",
                      admin: {
                        width: "50%",
                      },
                    },
                  ],
                },
                {
                  type: "select",
                  name: "requestType",
                  label: "Тип заявка",
                  options: [
                    {
                      label: "Оценка",
                      value: "evaluation",
                    },
                    {
                      label: "Клиентска продажба",
                      value: "client-sale",
                    },
                  ],
                },
              ],
            },
            {
              type: "group",
              label: "Информация за имота",
              fields: [
                {
                  type: "row",
                  fields: [
                    // {
                    //   name: "title",
                    //   type: "text",
                    //   label: "Наименование",
                    //   required: false,
                    //   admin: {
                    //     width: "50%",
                    //   },
                    //   hooks: {
                    //     beforeValidate: [],
                    //   },
                    // },
                    // {
                    //   name: "slug",
                    //   type: "text",
                    //   label: "URL",
                    //   admin: {
                    //     readOnly: true,
                    //     width: "25%",
                    //   },
                    //   hooks: {
                    //     beforeValidate: [formatSlug("title")],
                    //   },
                    // },
                    // {
                    //   name: "status",
                    //   type: "select",
                    //   label: "Статус на обявата",
                    //   admin: {
                    //     width: "25%",
                    //   },
                    //   required: true,
                    //   options: [
                    //     {
                    //       label: "Публикувана",
                    //       value: "published",
                    //     },
                    //     {
                    //       label: "Чернова",
                    //       value: "draft",
                    //     },
                    //   ],
                    //   defaultValue: "draft",
                    // },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    // {
                    //   type: "relationship",
                    //   name: "agent",
                    //   relationTo: "users",
                    //   label: "Агент",
                    //   defaultValue: ({ user }) => user?.id,
                    //   admin: {
                    //     width: "50%",
                    //   },
                    // },
                    // {
                    //   type: "select",
                    //   admin: {
                    //     width: "50%",
                    //   },
                    //   name: "isFeatured",
                    //   label: "Обява на фокус",
                    //   options: propertyIsFeaturedSelect,
                    //   defaultValue: "false",
                    // },
                    {
                      name: "purpose",
                      type: "select",
                      label: "Цел",
                      hasMany: true,
                      required: true,
                      admin: {
                        width: "50%",
                      },
                      options: propertyPurposeSelect,
                      defaultValue: "for_sale",
                    },
                    {
                      name: "category",
                      type: "relationship",
                      label: "Категория",
                      admin: {
                        width: "50%",
                      },
                      relationTo: "categories",
                      hasMany: false,
                      required: true,
                    },
                    // {
                    //   name: "tags",
                    //   type: "relationship",
                    //   label: "Етикети",
                    //   admin: {
                    //     width: "33.33%",
                    //   },
                    //   relationTo: "tags",
                    //   hasMany: true,
                    // },
                    {
                      name: "city",
                      type: "text",
                      label: "Населено място",
                      required: true,
                      admin: {
                        width: "50%",
                      },
                    },
                    {
                      name: "region",
                      type: "text",
                      label: "Област",
                      required: true,
                      admin: {
                        width: "50%",
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "price",
                      type: "number",
                      label: "Цена (€)",

                      admin: {
                        description:
                          'Въведете цената на имота в евро. При цена "по запитване" въведете 0 (нула)',
                        width: "40%",
                      },
                      required: true,
                    },
                    {
                      name: "size",
                      type: "number",
                      label: "Площ (м²)",
                      admin: {
                        description:
                          "Въведете площта в квадратни метри. При площ по запитване въведете 0 (нула)",
                        width: "40%",
                      },
                      required: true,
                    },
                    {
                      name: "pricePerSquareMeter",
                      type: "number",
                      label: "Цена на квадрат (€/м²)",

                      admin: {
                        readOnly: true,
                        description:
                          "Цена на квадратен метър (автоматично изчислена)",
                        width: "20%",
                      },
                      hooks: {
                        beforeValidate: [
                          ({ siblingData, originalDoc }) => {
                            const price =
                              siblingData?.price || originalDoc?.price;
                            const size = siblingData?.size || originalDoc?.size;

                            if (price && size) {
                              return parseFloat((price / size).toFixed());
                            }

                            return 0;
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: "group",
              label: "Описание",
              fields: [
                {
                  name: "description",
                  type: "richText",
                  label: "",
                  required: true,
                },
              ],
            },
            {
              type: "group",
              label: "Особености",
              fields: [
                {
                  name: "features",
                  type: "array",
                  labels: {
                    singular: "Особеност",
                    plural: "Особености",
                  },
                  label: "",
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "feature",
                          type: "relationship",
                          admin: {
                            width: "50%",
                          },
                          label: "Особеност",
                          relationTo: "characteristics",
                          required: true,
                        },
                        {
                          name: "value",
                          type: "text",
                          admin: {
                            width: "50%",
                          },
                          label: "Стойност",
                          required: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Изображения и видеа",
          fields: [
            {
              name: "images",
              type: "upload",
              relationTo: "media",
              hasMany: true,
            },
            {
              name: "video",
              type: "upload",
              relationTo: "media",
              hasMany: false,
            },
          ],
        },
      ],
    },
  ],
};
