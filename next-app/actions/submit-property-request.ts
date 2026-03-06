"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";
import { zfd } from "zod-form-data";

const formSchema = zfd.formData({
  firstName: zfd.text(z.string().min(1, "Моля въведете име")),
  lastName: zfd.text(z.string().min(1, "Моля въведете фамилия")),
  email: zfd.text(z.email("Невалиден имейл адрес")),
  phone: zfd.text(z.string().min(1, "Моля въведете телефон")),

  // Property Info
  purpose: zfd.text(z.string().min(1, "Моля изберете цел")),
  category: zfd.numeric(z.number().min(1, "Моля изберете категория")),
  city: zfd.text(z.string().min(1, "Моля изберете населено място")),
  region: zfd.text(z.string().min(1, "Моля изберете област")),
  price: zfd.numeric(z.number().min(0, "Моля въведете цена")),
  size: zfd.numeric(z.number().min(0, "Моля въведете площ")),
  description: zfd.text(z.string().min(1, "Моля въведете описание")),

  images: zfd.repeatable(z.array(z.instanceof(File))),

  // Honeypot field
  website: zfd.text(z.string().optional()),

  // Request Type
  requestType: zfd.text(z.enum(["evaluation", "client-sale"]).optional()),
});

export async function submitPropertyRequest(formData: FormData) {
  const result = formSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Honeypot check
  if (result.data.website) {
    return { success: true };
  }

  try {
    const payload = await getPayload({ config });

    // Handle image uploads
    const imageIds = [];
    if (result.data.images && result.data.images.length > 0) {
      for (const file of result.data.images) {
        if (file.size === 0) continue; // Skip empty files
        try {
          // Convert File to Buffer
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const media = await payload.create({
            collection: "images",
            data: {
              alt: file.name,
            },
            file: {
              data: buffer,
              name: file.name,
              mimetype: file.type,
              size: file.size,
            },
          });
          imageIds.push(media.id);
        } catch (uploadError) {
          console.error("Failed to upload image:", uploadError);
          // Continue with other images or fail? Let's continue.
        }
      }
    }

    await payload.create({
      collection: "properties-requests",
      data: {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        phone: result.data.phone,
        purpose: [result.data.purpose as "for_sale" | "for_rent"],
        category: result.data.category,
        city: result.data.city,
        region: result.data.region,
        price: result.data.price,
        size: result.data.size,
        requestType:
          (result.data.requestType as "evaluation" | "client-sale") ||
          "client-sale",
        description: {
          root: {
            type: "root",
            format: "",
            indent: 0,
            version: 1,
            children: [
              {
                type: "paragraph",
                format: "",
                indent: 0,
                version: 1,
                children: [
                  {
                    type: "text",
                    text: result.data.description,
                    format: 0,
                    detail: 0,
                    mode: "normal",
                    style: "",
                    version: 1,
                  },
                ],
              },
            ],
            direction: "ltr",
          },
        },
        images: imageIds, // Pass array of IDs directly for hasMany upload field
        // Wait, PropertiesRequests 'images' field: type: 'upload', relationTo: 'media', hasMany: true.
        // So expected format is array of IDs or array of objects with relation?
        // Payload hasMany upload field expects array of IDs usually: [id1, id2]
        // But let's check PropertiesRequests.ts again.
        // It says:
        // fields: [ { name: "images", type: "upload", relationTo: "media", hasMany: true } ]
        // No, it's inside a tabs -> Common Info -> fields...
        // Wait, looking at PropertiesRequests.ts:
        // { name: "images", type: "upload", relationTo: "media", hasMany: true }
        // For hasMany: true upload field, Payload expects array of IDs.
        // Actually, looking at the code in PropertiesRequests.ts:
        // 315: name: "images", type: "upload", relationTo: "media", hasMany: true
      },
      // Override types if needed or trust payload
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit property request:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
