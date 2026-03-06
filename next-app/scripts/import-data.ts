import { getPayload } from "payload";
import configPromise from "../payload.config";
import fs from "fs";
import path from "path";

// Upload collections: files already live in S3, so we only restore DB records.
// Using payload.db.create bypasses Payload's upload middleware (no file needed).
const UPLOAD_COLLECTIONS = new Set(["media", "images"]);

// Order matters: import dependencies before collections that reference them.
const COLLECTION_ORDER = [
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

const GLOBALS = [
  "home-page",
  "about-page",
  "services-page",
  "contact-page",
  "privacy-policy",
];

const dataPath = path.resolve(process.cwd(), "payload-export.json");
if (!fs.existsSync(dataPath)) {
  console.error("Error: payload-export.json not found in the project root.");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const payload = await getPayload({ config: configPromise });

console.log("Starting DB import...\n");

// ── Collections ──────────────────────────────────────────────────────────────
for (const slug of COLLECTION_ORDER) {
  const docs: any[] = data.collections?.[slug] ?? [];
  if (!docs.length) {
    console.log(`Skipping (no data): ${slug}`);
    continue;
  }

  console.log(`Importing ${slug} (${docs.length} docs)...`);
  let created = 0,
    skipped = 0,
    errors = 0;

  for (const doc of docs) {
    try {
      if (UPLOAD_COLLECTIONS.has(slug)) {
        // Bypass upload middleware — just write the metadata row directly.
        await (payload.db as any).create({ collection: slug, data: doc });
      } else {
        const { id, createdAt, updatedAt, ...fields } = doc;
        await payload.create({
          collection: slug as any,
          data: fields,
          disableVerificationEmail: true,
        });
      }
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

// ── Globals ───────────────────────────────────────────────────────────────────
for (const slug of GLOBALS) {
  const doc = data.globals?.[slug];
  if (!doc) {
    console.log(`Skipping global (no data): ${slug}`);
    continue;
  }

  console.log(`Importing global: ${slug}`);
  try {
    const { id, createdAt, updatedAt, globalType, ...fields } = doc;
    await payload.updateGlobal({ slug: slug as any, data: fields });
    console.log(`  ✓ Done\n`);
  } catch (err: any) {
    console.error(`  ✗ Error:`, err?.message ?? err);
  }
}

console.log("Import complete!");
