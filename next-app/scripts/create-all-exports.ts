import { getPayload } from "payload";
import configPromise from "../payload.config";

/**
 * Recursively extracts all field names that represent data points.
 */
function getFieldNames(fields: any[]): string[] {
  let names: string[] = [];
  fields.forEach((field) => {
    if (field.name) {
      names.push(field.name);
    } else if (field.fields) {
      names = names.concat(getFieldNames(field.fields));
    } else if (field.tabs) {
      field.tabs.forEach((tab: any) => {
        if (tab.fields) {
          names = names.concat(getFieldNames(tab.fields));
        }
      });
    }
  });
  return Array.from(new Set(names));
}

async function run() {
  const payload = await getPayload({ config: configPromise });

  // 1. Delete all existing jobs to start fresh
  console.log("Deleting all existing jobs...");
  await payload.db.deleteMany({
    collection: "payload-jobs",
    where: {},
  });
  console.log(" - Cleaned up payload-jobs collection");

  // 2. Find the admin user
  const adminEmail = process.env.DEV_USERNAME || "denev@kodes.agency";
  const users = await payload.find({
    collection: "users",
    where: {
      email: {
        equals: adminEmail,
      },
    },
  });

  if (users.docs.length === 0) {
    console.error(` - Admin user not found with email: ${adminEmail}`);
    process.exit(1);
  }

  const adminUser = users.docs[0];
  console.log(`Using admin user: ${adminUser.email} (ID: ${adminUser.id})`);

  const collections = [
    "users",
    "properties",
    "media",
    "images",
    "categories",
    "regions",
    "cities",
    "parent-categories",
    "tags",
    "characteristics",
    "requests",
    "properties-requests",
  ];

  console.log("Queueing fresh export jobs...");

  for (const slug of collections) {
    console.log(`Processing collection: ${slug}`);
    try {
      const collection = (payload.collections as any)[slug];
      if (!collection) {
        console.error(` - Collection not found: ${slug}`);
        continue;
      }

      const allFields = getFieldNames(collection.config.fields);
      const fieldsToInclude = allFields.filter(
        (name) => name !== "createdAt" && name !== "updatedAt",
      );

      const timestamp = new Date().getTime();
      const exportName = `export-${slug}-${timestamp}`;

      // We use payload.jobs.queue BUT we also set the auth context in the input
      // And we pass the user to the local API call if possible (though jobs.queue doesn't take 'user')
      await payload.jobs.queue({
        task: "createCollectionExport" as any,
        input: {
          id: `${slug}-${timestamp}`,
          name: exportName,
          collectionSlug: slug,
          format: "json",
          fields: fieldsToInclude,
          depth: 0,
          filename: exportName,
          exportCollection: "exports",
          userID: String(adminUser.id),
          userCollection: "users",
        } as any,
      });

      console.log(` - Export job queued for ${slug}`);
    } catch (err) {
      console.error(` - Error queueing export for ${slug}:`, err);
    }
  }

  console.log("\nFresh export jobs have been queued!");
  process.exit(0);
}

await run();
