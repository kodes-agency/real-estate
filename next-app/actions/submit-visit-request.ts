"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "Моля въведете име"),
  lastName: z.string().min(1, "Моля въведете фамилия"),
  email: z.string().email("Невалиден имейл адрес"),
  phone: z.string().min(1, "Моля въведете телефон"),
  property: z.coerce.number().min(1, "ID на имота е задължително"),
  // Honeypot field
  website: z.string().optional(),
});

export type VisitRequestData = z.infer<typeof formSchema>;

export async function submitVisitRequest(data: VisitRequestData) {
  const result = formSchema.safeParse(data);

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

    await payload.create({
      collection: "requests",
      data: result.data,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit visit request:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
