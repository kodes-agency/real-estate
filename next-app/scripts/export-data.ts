import { getPayload } from "payload";
import configPromise from "../payload.config";
import fs from "fs";
import path from "path";

async function exportData() {
  const payload = await getPayload({ config: configPromise });

  const collections = [
    "users",
    "media",
    "images",
    "regions",
    "cities",
    "tags",
    "parent-categories",
    "categories",
    "characteristics",
    "properties",
    "requests",
    "properties-requests",
  ];

  const globals = [
    "home-page",
    "about-page",
    "services-page",
    "contact-page",
    "privacy-policy",
  ];

  const data: Record<string, any> = { collections: {}, globals: {} };

  console.log("Starting DB export...");

  for (const slug of collections) {
    console.log(`Exporting collection: ${slug}`);
    try {
      const { docs } = await payload.find({
        collection: slug as any,
        depth: 0,
        limit: 10000, // adjust if you have more than 10k items in a single collection
        pagination: false,
      });
      data.collections[slug] = docs;
      console.log(` - Exported ${docs.length} documents from ${slug}`);
    } catch (err) {
      console.error(` - Error exporting collection ${slug}:`, err);
    }
  }

  for (const slug of globals) {
    console.log(`Exporting global: ${slug}`);
    try {
      const doc = await payload.findGlobal({
        slug: slug as any,
        depth: 0,
      });
      data.globals[slug] = doc;
      console.log(` - Exported global ${slug}`);
    } catch (err) {
      console.error(` - Error exporting global ${slug}:`, err);
    }
  }

  const outputPath = path.resolve(__dirname, "..", "payload-export.json");
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`\nExport complete! Data saved to: ${outputPath}`);
  process.exit(0);
}

exportData();
