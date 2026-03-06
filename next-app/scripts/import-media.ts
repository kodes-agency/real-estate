import { getPayload } from "payload";
import configPromise from "../payload.config";
import fs from "fs";
import path from "path";

// media-export.json and images-export.json are flat arrays produced by export-media.ts.
// Files already live in S3 — we only restore the DB records via payload.db.create
// to bypass Payload's upload middleware (which would demand an actual file).

const payload = await getPayload({ config: configPromise });

for (const slug of ["media", "images"] as const) {
  const filePath = path.resolve(process.cwd(), `${slug}-export.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${slug} — ${slug}-export.json not found.`);
    continue;
  }

  const docs: any[] = JSON.parse(fs.readFileSync(filePath, "utf8"));
  console.log(`Importing ${slug} (${docs.length} docs)...`);
  let created = 0,
    skipped = 0,
    errors = 0;

  for (const doc of docs) {
    try {
      await (payload.db as any).create({ collection: slug, data: doc });
      created++;
    } catch (err: any) {
      if (err?.message?.includes("duplicate") || err?.code === "23505") {
        skipped++;
      } else {
        console.error(`  ✗ doc ${doc.id}:`, err?.message ?? err);
        errors++;
      }
    }
  }

  console.log(
    `  ✓ created: ${created}  duplicates skipped: ${skipped}  errors: ${errors}\n`,
  );
}

console.log("Media import complete!");
