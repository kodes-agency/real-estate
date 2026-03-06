import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { s3Storage } from "@payloadcms/storage-s3";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { bg } from "payload/i18n/bg";
import { importExportPlugin } from "@payloadcms/plugin-import-export";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Properties } from "./collections/Properties";
import { Categories } from "./collections/Categories";
import { Cities } from "./collections/Cities";
import { ParentCategories } from "./collections/ParentCategories";
import { Characteristics } from "./collections/Characteristics";
import { Regions } from "./collections/Regions";
import { Tags } from "./collections/Tags";
import { Requests } from "./collections/Requests";
import { PropertiesRequests } from "./collections/PropertiesRequests";
import { HomePage } from "./globals/HomePage";
import { Images } from "./collections/Images";
import { AboutPage } from "./globals/AboutPage";
import { ServicesPage } from "./globals/ServicesPage";
import { ContactPage } from "./globals/ContactPage";
import { PrivacyPolicy } from "./globals/PrivacyPolicy";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const enableAutoLogin =
  process.env.PAYLOAD_ENABLE_AUTOLOGIN === "true" &&
  !!process.env.DEV_USERNAME &&
  !!process.env.DEV_PASSWORD;

export default buildConfig({
  i18n: {
    supportedLanguages: { bg },
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    ...(enableAutoLogin
      ? {
          autoLogin: {
            email: process.env.DEV_USERNAME as string,
            password: process.env.DEV_PASSWORD as string,
          },
        }
      : {}),
  },
  collections: [
    Properties,
    Characteristics,
    Requests,
    PropertiesRequests,
    Categories,
    Regions,
    Cities,
    ParentCategories,
    Tags,
    Media,
    Images,
    Users,
  ],
  globals: [HomePage, AboutPage, ServicesPage, ContactPage, PrivacyPolicy],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_ADDRESS || "",
    defaultFromName: process.env.SMTP_FROM_NAME || "",
    // Nodemailer transportOptions
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }) as any,
  plugins: [
    importExportPlugin({
      debug: true,
      collections: [
        { slug: "users" },
        { slug: "properties" },
        { slug: "media" },
        { slug: "images" },
        { slug: "categories" },
        { slug: "regions" },
        { slug: "cities" },
        { slug: "parent-categories" },
        { slug: "tags" },
        { slug: "characteristics" },
        { slug: "requests" },
        { slug: "properties-requests" },
      ],
    }),
    seoPlugin({
      collections: ["properties"],
      globals: ["home-page", "about-page", "services-page", "contact-page"],
      tabbedUI: true,
    }),
    s3Storage({
      collections: {
        ["media"]: {
          prefix: "media",
        },
      },
      bucket: process.env.S3_BUCKET || "",
      config: {
        forcePathStyle: true,
        requestHandler: {
          connectionTimeout: 5 * 1000,
          requestTimeout: 5 * 1000,
          httpAgent: {
            maxSockets: 300,
            keepAlive: true,
          },
          httpsAgent: {
            maxSockets: 300,
            keepAlive: true,
          },
        },
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
      },
    }),
  ],
});
