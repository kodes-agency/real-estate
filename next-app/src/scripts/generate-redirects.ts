import { getPayload } from "payload";
import config from "@payload-config";
import fs from "fs";
import path from "path";

/**
 * Generate 301 redirect mappings from old WordPress property URLs
 * to new Next.js property URLs.
 *
 * Reads: lib/data/old-urls.json (output from extract-old-urls.py)
 * Outputs: lib/data/redirects.json
 *
 * Run with: npx payload run src/scripts/generate-redirects.ts
 */

interface OldUrlEntry {
  legacy_id: number;
  old_path: string;
  title: string;
}

interface RedirectEntry {
  source: string;
  destination: string;
}

async function run() {
  const payload = await getPayload({ config });

  // Read old URLs
  const oldUrlsPath = path.join(process.cwd(), "lib", "data", "old-urls.json");
  const oldUrls: OldUrlEntry[] = JSON.parse(
    fs.readFileSync(oldUrlsPath, "utf-8"),
  );
  console.log(`Loaded ${oldUrls.length} old URLs`);

  // Fetch all properties from Payload with legacy_id and slug
  const { docs: properties } = await payload.find({
    collection: "properties",
    limit: 500,
    select: {
      slug: true,
      legacy_id: true,
    },
  });

  console.log(`Fetched ${properties.length} properties from database`);

  // Build lookup map: legacy_id -> slug
  const legacyIdToSlug = new Map<number, string>();
  for (const prop of properties) {
    if (prop.legacy_id && prop.slug) {
      legacyIdToSlug.set(prop.legacy_id, prop.slug);
    }
  }

  console.log(`Built lookup map with ${legacyIdToSlug.size} entries`);

  // Generate redirects
  const redirects: RedirectEntry[] = [];
  let unmatched = 0;

  for (const entry of oldUrls) {
    const newSlug = legacyIdToSlug.get(entry.legacy_id);
    if (newSlug) {
      redirects.push({
        source: entry.old_path.endsWith("/")
          ? entry.old_path.slice(0, -1)
          : entry.old_path,
        destination: `/imoti/${newSlug}`,
      });
    } else {
      unmatched++;
      console.log(
        `  ⚠ No match for legacy_id=${entry.legacy_id} (${entry.title})`,
      );
    }
  }

  // Write output
  const outputPath = path.join(process.cwd(), "lib", "data", "redirects.json");
  fs.writeFileSync(outputPath, JSON.stringify(redirects, null, 2), "utf-8");

  console.log(
    `\n✓ Generated ${redirects.length} redirects (${unmatched} unmatched)`,
  );
  console.log(`Output written to: ${outputPath}`);

  // Show a few samples
  for (const r of redirects.slice(0, 3)) {
    console.log(`  ${r.source} → ${r.destination}`);
  }

  process.exit(0);
}

await run();
