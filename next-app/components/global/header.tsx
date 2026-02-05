import React from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { HeaderClient } from "./header-client";

export async function Header() {
  const payload = await getPayload({ config });

  const { docs: categories } = await payload.find({
    collection: "categories",
    limit: 1000,
    pagination: false,
  });

  const normalizedCategories = categories.map((c) => ({
    id: c.id,
    title: c.title,
  }));

  return <HeaderClient categories={normalizedCategories} />;
}
