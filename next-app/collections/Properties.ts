import type { CollectionConfig } from "payload";
import { formatSlug } from "../lib/formatSlug";
import {
  propertyIsFeaturedSelect,
  propertyPurposeSelect,
} from "@/types/payload-select";
import { revalidateTag } from "next/cache";

export const Properties: CollectionConfig = {
  slug: "properties",
  labels: {
    singular: "Имот",
    plural: "Имоти",
  },
  admin: {
    defaultColumns: ["title", "status", "createdAt"],
    useAsTitle: "title",
    group: "Администрация",
    components: {
      edit: {
        beforeDocumentControls: [
          "/components/admin/VisitPropertyButton#VisitPropertyButton",
        ],
      },
    },
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTag("properties");
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        const relatedRequests = await req.payload.find({
          collection: "requests",
          where: {
            property: {
              equals: id,
            },
          },
        });

        if (relatedRequests.totalDocs > 0) {
          await Promise.all(
            relatedRequests.docs.map(async (request) => {
              await req.payload.update({
                collection: "requests",
                id: request.id,
                data: {
                  property: null,
                },
              });
            }),
          );
        }
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Обща информация",
          fields: [
            {
              type: "number",
              name: "legacy_id",
              label: "Идентификатор",
              admin: {
                hidden: true,
                readOnly: true,
              },
            },
            {
              type: "group",
              label: "Информация за обавата",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "title",
                      type: "text",
                      label: "Наименование",
                      admin: {
                        width: "50%",
                      },
                      hooks: {
                        beforeValidate: [],
                      },
                    },
                    {
                      name: "slug",
                      type: "text",
                      label: "URL",
                      unique: true,
                      admin: {
                        readOnly: true,
                        width: "50%",
                      },
                      hooks: {
                        beforeValidate: [formatSlug("title", "id")],
                      },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      type: "relationship",
                      name: "agent",
                      relationTo: "users",
                      label: "Агент",
                      defaultValue: ({ user }) => user?.id,
                      admin: {
                        width: "50%",
                        hidden: true,
                      },
                    },
                    {
                      name: "isAvailable",
                      type: "select",
                      label: "Налично",
                      admin: {
                        width: "33.33%",
                      },
                      options: [
                        {
                          label: "Да",
                          value: "true",
                        },
                        {
                          label: "Не",
                          value: "false",
                        },
                      ],
                      defaultValue: "true",
                    },
                    {
                      type: "select",
                      admin: {
                        width: "33.33%",
                      },
                      name: "isFeatured",
                      label: "Обява на фокус",
                      options: propertyIsFeaturedSelect,
                      defaultValue: "false",
                    },
                    {
                      name: "isArchived",
                      type: "select",
                      label: "Архивирано",
                      admin: {
                        width: "33.33%",
                      },
                      options: [
                        {
                          label: "Да",
                          value: "true",
                        },
                        {
                          label: "Не",
                          value: "false",
                        },
                      ],
                      defaultValue: "false",
                    },
                    {
                      name: "purpose",
                      type: "select",
                      label: "Цел",
                      hasMany: true,
                      required: true,
                      admin: {
                        width: "33.33%",
                      },
                      options: propertyPurposeSelect,
                      defaultValue: "for_sale",
                    },
                    {
                      name: "category",
                      type: "relationship",
                      label: "Категория",
                      admin: {
                        width: "33.33%",
                      },
                      relationTo: "categories",
                      hasMany: false,
                      required: true,
                    },
                    {
                      name: "tags",
                      type: "relationship",
                      label: "Етикети",
                      admin: {
                        width: "33.33%",
                      },
                      relationTo: "tags",
                      hasMany: true,
                    },
                    {
                      type: "relationship",
                      admin: {
                        width: "50%",
                      },
                      name: "city",
                      label: "Населено място",
                      relationTo: "cities",
                      required: true,
                    },
                    {
                      type: "relationship",
                      admin: {
                        width: "50%",
                      },
                      name: "region",
                      label: "Област",
                      relationTo: "regions",
                      required: true,
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
              admin: {
                hidden: true,
              },
            },
          ],
        },
      ],
    },
  ],
};
