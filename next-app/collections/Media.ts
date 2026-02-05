import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Медия",
    plural: "Медия",
  },
  access: {
    read: () => true,
  },
  admin: {
    group: "Медия",
  },
  fields: [
    {
      label: "Алтернативен текст",
      name: "alt",
      type: "text",
    },
  ],
  upload: {
    formatOptions: {
      format: "webp",
      options: {
        quality: 95,
      },
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === "create" || operation === "update") {
          const path = (await import("path")).default;
          const sharp = (await import("sharp")).default;

          // Debug logs
          console.log("[Watermark] Hook triggered for operation:", operation);

          let fileBuffer;
          if (data.file && data.file.buffer) {
            console.log("[Watermark] Found buffer in data.file.buffer");
            fileBuffer = data.file.buffer;
          } else if (req.file && req.file.data) {
            console.log("[Watermark] Found buffer in req.file.data");
            fileBuffer = req.file.data;
          } else {
            console.log("[Watermark] No file buffer found.");
            return data;
          }

          const watermarkPath = path.resolve(
            process.cwd(),
            "public/logo/logo-watermark.png",
          );
          console.log("[Watermark] Looking for watermark at:", watermarkPath);

          try {
            if (!Buffer.isBuffer(fileBuffer)) {
              console.log("[Watermark] File data is not a buffer");
              return data;
            }

            const image = sharp(fileBuffer);
            const metadata = await image.metadata();

            if (metadata.width) {
              console.log("[Watermark] Image width:", metadata.width);
              const watermark = sharp(watermarkPath);

              // Check if watermark exists/can be read
              try {
                await watermark.metadata();
              } catch (e) {
                console.error("[Watermark] Failed to load watermark image:", e);
                return data;
              }

              const resizedWatermarkBuffer = await watermark
                .resize({ width: metadata.width })
                .toBuffer();

              const compositedImageBuffer = await image
                .composite([
                  { input: resizedWatermarkBuffer, gravity: "center" },
                ])
                .toBuffer();

              console.log("[Watermark] Watermark applied successfully.");

              // Update the buffer in the location Payload expects
              // For local upload, updating data.file.buffer is usually correct if it existed,
              // but modifying req.file.data might be needed if that's where source truth is.
              // Payload eventually writes from one of these.

              if (data.file) {
                data.file.buffer = compositedImageBuffer;
                data.file.size = compositedImageBuffer.length;
              }

              // Also update req.file.data to be safe if that was the source
              if (req.file) {
                req.file.data = compositedImageBuffer;
                req.file.size = compositedImageBuffer.length;
              }

              const newMeta = await sharp(compositedImageBuffer).metadata();
              data.width = newMeta.width;
              data.height = newMeta.height;
            }
          } catch (error) {
            console.error("[Watermark] Error applying watermark:", error);
          }
        }
        return data;
      },
    ],
  },
};
