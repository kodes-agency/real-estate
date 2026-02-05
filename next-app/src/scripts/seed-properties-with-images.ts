import { getPayload } from "payload";
import config from "@payload-config";
import properties from "../../lib/data/properties.json";
import fs from "fs";
import path from "path";

// Type for property data
interface PropertyData {
  title: string;
  purpose: string[];
  category: number;
  images: string[];
  city: number;
  region: number;
  price: number;
  size: number;
  description: any[];
  features: Array<{ feature: number; value: string }>;
  legacy_id: number;
  video?: string[];
}

// Helper to generate a basic Lexical paragraph with text
const createLexicalParagraph = (text: string) => ({
  type: "paragraph",
  version: 1,
  children: [
    {
      type: "text",
      version: 1,
      text,
      format: 0,
      mode: "normal",
      style: "",
      detail: 0,
    },
  ],
  direction: "ltr",
  format: "",
  indent: 0,
  textFormat: 0,
  textStyle: "",
});

// Helper to convert simple Slate structure to Lexical
const convertSlateToLexical = (slateContent: any[]) => {
  const children = [];

  // Iterate through slate blocks
  for (const block of slateContent) {
    if (block.children) {
      for (const child of block.children) {
        if (child.text) {
          // Split by double newlines to create separate paragraphs
          const paragraphs = child.text
            .split("\n\n")
            .filter((t: string) => t.trim().length > 0);

          for (const text of paragraphs) {
            children.push(createLexicalParagraph(text.trim()));
          }
        }
      }
    }
  }

  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children,
      direction: "ltr",
    },
  };
};

// Upload a single image to the Media collection using HTTP API
async function uploadImage(
  payload: any,
  filename: string,
  propertyTitle: string,
): Promise<number | null> {
  try {
    const imagePath = path.join(process.cwd(), "photos", filename);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.log(`  ⚠️  Image not found: ${filename}`);
      return null;
    }

    // Read file as buffer
    const fileBuffer = fs.readFileSync(imagePath);
    const mimeType = getMimeType(filename);

    // Create FormData with the file
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: mimeType });
    formData.append("file", blob, filename);
    formData.append("alt", `${propertyTitle} - ${filename}`);

    // Upload using the HTTP API
    const baseUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/media`, {
      method: "POST",
      body: formData,
      // Note: Don't set Content-Type header, let FormData set it with boundary
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `  ✗ Failed to upload ${filename}: HTTP ${response.status}`,
      );
      console.error(`     Error: ${errorText.substring(0, 200)}`);
      return null;
    }

    const result = await response.json();
    const mediaId = result.doc?.id || result.id;

    console.log(`  ✓ Uploaded: ${filename} -> ID: ${mediaId}`);
    return mediaId;
  } catch (error) {
    console.error(`  ✗ Failed to upload ${filename}:`, error);
    return null;
  }
}

// Get MIME type based on file extension
function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };
  return mimeTypes[ext || ""] || "image/jpeg";
}

async function run() {
  try {
    const payload = await getPayload({ config });

    console.log(
      `Starting seed of ${properties.length} properties with images...`,
    );
    console.log(
      "This will upload images to the Media collection first, then create properties.\n",
    );

    for (const prop of properties) {
      console.log(
        `\nProcessing property: ${prop.title} (legacy_id: ${prop.legacy_id})`,
      );

      // Upload images first
      const uploadedImageIds: number[] = [];
      const imageFilenames = prop.images || [];

      if (imageFilenames.length > 0) {
        console.log(`  Uploading ${imageFilenames.length} images...`);

        for (const filename of imageFilenames) {
          const mediaId = await uploadImage(payload, filename, prop.title);
          if (mediaId) {
            uploadedImageIds.push(mediaId);
          }
        }

        console.log(
          `  ✓ Uploaded ${uploadedImageIds.length}/${imageFilenames.length} images`,
        );
      }

      // Convert Slate description to Lexical
      const lexicalDescription = convertSlateToLexical(prop.description);

      // Create property with uploaded image IDs
      await payload.create({
        collection: "properties",
        data: {
          title: prop.title,
          legacy_id: prop.legacy_id,
          isFeatured: prop.isFeatured as "true" | "false",
          isArchived: prop.isArchived as "true" | "false",
          isAvailable: prop.isAvailable as "true" | "false",
          purpose: prop.purpose as ("for_sale" | "for_rent")[],
          category: prop.category === 0 ? 5 : prop.category,
          city: Number(prop.city),
          region: Number(prop.region),
          images: uploadedImageIds,
          price: prop.price,
          size: prop.size,
          description: lexicalDescription as any,
          features: prop.features.map((f) => ({
            feature: f.feature,
            value: f.value,
          })),
        },
      });

      console.log(
        `  ✓ Property created with ${uploadedImageIds.length} images`,
      );
    }

    console.log("\n✓ Seed completed successfully.");
  } catch (error) {
    console.error("Error seeding properties:", error);
    process.exit(1);
  }

  process.exit(0);
}

console.log("Script loaded");

await run();
