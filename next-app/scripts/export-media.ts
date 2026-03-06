import { getPayload } from "payload";
import configPromise from "../payload.config";
import fs from "fs";
import path from "path";

const payload = await getPayload({ config: configPromise });

for (const slug of ["media", "images"] as const) {
  console.log(`Fetching ${slug}...`);
  const { docs } = await payload.find({
    collection: slug,
    limit: 100000,
    pagination: false,
    depth: 0,
  });
  const outPath = path.resolve(process.cwd(), `${slug}-export.json`);
  fs.writeFileSync(outPath, JSON.stringify(docs, null, 2));
  console.log(`✓ Exported ${docs.length} ${slug} records → ${outPath}`);
}

console.log("Done.");
