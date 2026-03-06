import type { CollectionConfig } from "payload";

export const Requests: CollectionConfig = {
  slug: "requests",
  labels: {
    singular: "Заявка за оглед",
    plural: "Заявки за оглед",
  },
  hooks: {
    afterChange: [
      async ({ req, data }) => {
        const property = await req.payload.findByID({
          collection: "properties",
          id: data.property,
        });
        const [adminEmailResponse, userEmailResponse] = await Promise.all([
          req.payload.sendEmail({
            to: process.env.ADMIN_EMAIL || "denev@kodes.agency",
            subject: "Нова заявка за оглед",
            html: `
            <h1>Нова заявка за оглед</h1>
            <p><strong>Име: </strong>${data.firstName}</p>
            <p><strong>Фамилия: </strong>${data.lastName}</p>
            <p><strong>Email: </strong>${data.email}</p>
            <p><strong>Телефон: </strong>${data.phone}</p>
            <p><strong>Имот: </strong>${property.title}</p>
            <a href="https://hayatisesates.com/imoti/${property.slug}">Виж имота</a>
          `,
          }),
          req.payload.sendEmail({
            to: data.email,
            subject: "Потвърждение за заявка за оглед",
            html: `
            <h1>Потвърждение за заявка за оглед</h1>
            <p>Здравейте, ${data.firstName} ${data.lastName},</p>
            <p>Благодарим Ви за проявения интерес към ${property.title}</p>
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
      type: "row",
      fields: [
        {
          name: "firstName",
          type: "text",
          label: "Име",
          required: true,
        },
        {
          name: "lastName",
          type: "text",
          label: "Фамилия",
          required: true,
        },
        {
          name: "email",
          type: "text",
          label: "Email",
          required: true,
        },
        {
          name: "phone",
          type: "text",
          label: "Телефон",
          required: true,
        },
      ],
    },
    {
      type: "relationship",
      name: "property",
      relationTo: "properties",
      required: false,
    },
  ],
};
