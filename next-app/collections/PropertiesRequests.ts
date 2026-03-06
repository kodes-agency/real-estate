import type { CollectionConfig } from "payload";
import { formatSlug } from "../lib/formatSlug";
import {
  propertyIsFeaturedSelect,
  propertyPurposeSelect,
} from "@/types/payload-select";

export const PropertiesRequests: CollectionConfig = {
  slug: "properties-requests",
  labels: {
    singular: "Заявка за оценка и/или добавяне на имот",
    plural: "Заявки за оценки и/или добавяне на имоти",
  },
  hooks: {
    afterChange: [
      async ({ req, data }) => {
        const [adminEmailResponse, userEmailResponse] = await Promise.all([
          req.payload.sendEmail({
            to: process.env.ADMIN_EMAIL || "denev@kodes.agency",
            subject: `Нова заявка за ${data.requestType === "evaluation" ? "оценка на имот" : ""}`,
            html: `
            <h1>Нова заявка за оглед</h1>
            <p><strong>Име: </strong>${data.firstName}</p>
            <p><strong>Фамилия: </strong>${data.lastName}</p>
            <p><strong>Email: </strong>${data.email}</p>
            <p><strong>Телефон: </strong>${data.phone}</p>
          `,
          }),
          req.payload.sendEmail({
            to: data.email,
            subject: "Потвърждение за заявка за оглед",
            html: `
            <h1>Потвърждение за заявка за оглед</h1>
            <p>Здравейте, ${data.firstName} ${data.lastName},</p>
            <p>Ще се свържем с Вас възможно най-скоро за да уговорим точен ден и час за оглед.</p>
            <p>Поздрави,</p>
            <p>Екипът на Hayati Estate</p>
          `,
          }),
        ]);
      },
    ],
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
                      label: "Добавяне на имот",
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
            // {
            //   type: "group",
            //   label: "Особености",
            //   fields: [
            //     {
            //       name: "features",
            //       type: "array",
            //       labels: {
            //         singular: "Особеност",
            //         plural: "Особености",
            //       },
            //       label: "",
            //       fields: [
            //         {
            //           type: "row",
            //           fields: [
            //             {
            //               name: "feature",
            //               type: "relationship",
            //               admin: {
            //                 width: "50%",
            //               },
            //               label: "Особеност",
            //               relationTo: "characteristics",
            //               required: true,
            //             },
            //             {
            //               name: "value",
            //               type: "text",
            //               admin: {
            //                 width: "50%",
            //               },
            //               label: "Стойност",
            //               required: true,
            //             },
            //           ],
            //         },
            //       ],
            //     },
            //   ],
            // },
          ],
        },
        {
          label: "Изображения",
          fields: [
            {
              name: "images",
              type: "upload",
              relationTo: "images",
              hasMany: true,
            },
            // {
            //   name: "video",
            //   type: "upload",
            //   relationTo: "images",
            //   hasMany: false,
            //   admin: {
            //     hidden: true,
            //   },
            // },
          ],
        },
      ],
    },
  ],
};
