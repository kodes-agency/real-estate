import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_properties_purpose" AS ENUM('for_sale', 'for_rent');
  CREATE TYPE "public"."enum_properties_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_properties_is_featured" AS ENUM('true', 'false');
  CREATE TYPE "public"."enum_properties_requests_purpose" AS ENUM('for_sale', 'for_rent');
  CREATE TYPE "public"."enum_properties_requests_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_properties_requests_is_featured" AS ENUM('true', 'false');
  CREATE TYPE "public"."enum_cities_type" AS ENUM('city', 'village');
  CREATE TABLE "properties_purpose" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_properties_purpose",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "properties_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature_id" integer NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "properties" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"status" "enum_properties_status" DEFAULT 'draft' NOT NULL,
  	"agent_id" integer,
  	"is_featured" "enum_properties_is_featured" DEFAULT 'false',
  	"category_id" integer NOT NULL,
  	"city_id" integer NOT NULL,
  	"region_id" integer NOT NULL,
  	"price" numeric NOT NULL,
  	"size" numeric NOT NULL,
  	"price_per_square_meter" numeric,
  	"description" jsonb NOT NULL,
  	"video_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "properties_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "characteristics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"icon" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"property_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "properties_requests_purpose" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_properties_requests_purpose",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "properties_requests_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature_id" integer NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "properties_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"title" varchar,
  	"slug" varchar,
  	"status" "enum_properties_requests_status" DEFAULT 'draft' NOT NULL,
  	"agent_id" integer,
  	"is_featured" "enum_properties_requests_is_featured" DEFAULT 'false',
  	"category_id" integer NOT NULL,
  	"city" varchar NOT NULL,
  	"region" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"size" numeric NOT NULL,
  	"price_per_square_meter" numeric,
  	"description" jsonb NOT NULL,
  	"video_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "properties_requests_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "regions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_cities_type" DEFAULT 'city' NOT NULL,
  	"title" varchar NOT NULL,
  	"region_id" integer NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "parent_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'admin',
  	"phone" varchar,
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"properties_id" integer,
  	"characteristics_id" integer,
  	"requests_id" integer,
  	"properties_requests_id" integer,
  	"categories_id" integer,
  	"regions_id" integer,
  	"cities_id" integer,
  	"parent_categories_id" integer,
  	"tags_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "properties_purpose" ADD CONSTRAINT "properties_purpose_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_features" ADD CONSTRAINT "properties_features_feature_id_characteristics_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."characteristics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_features" ADD CONSTRAINT "properties_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_agent_id_users_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties" ADD CONSTRAINT "properties_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_rels" ADD CONSTRAINT "properties_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_rels" ADD CONSTRAINT "properties_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_rels" ADD CONSTRAINT "properties_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "requests" ADD CONSTRAINT "requests_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_requests_purpose" ADD CONSTRAINT "properties_requests_purpose_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."properties_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_requests_features" ADD CONSTRAINT "properties_requests_features_feature_id_characteristics_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."characteristics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_requests_features" ADD CONSTRAINT "properties_requests_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."properties_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_requests" ADD CONSTRAINT "properties_requests_agent_id_users_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_requests" ADD CONSTRAINT "properties_requests_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_requests" ADD CONSTRAINT "properties_requests_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "properties_requests_rels" ADD CONSTRAINT "properties_requests_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."properties_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_requests_rels" ADD CONSTRAINT "properties_requests_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "properties_requests_rels" ADD CONSTRAINT "properties_requests_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_parent_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parent_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cities" ADD CONSTRAINT "cities_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_properties_fk" FOREIGN KEY ("properties_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_characteristics_fk" FOREIGN KEY ("characteristics_id") REFERENCES "public"."characteristics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_requests_fk" FOREIGN KEY ("requests_id") REFERENCES "public"."requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_properties_requests_fk" FOREIGN KEY ("properties_requests_id") REFERENCES "public"."properties_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_regions_fk" FOREIGN KEY ("regions_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_categories_fk" FOREIGN KEY ("parent_categories_id") REFERENCES "public"."parent_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "properties_purpose_order_idx" ON "properties_purpose" USING btree ("order");
  CREATE INDEX "properties_purpose_parent_idx" ON "properties_purpose" USING btree ("parent_id");
  CREATE INDEX "properties_features_order_idx" ON "properties_features" USING btree ("_order");
  CREATE INDEX "properties_features_parent_id_idx" ON "properties_features" USING btree ("_parent_id");
  CREATE INDEX "properties_features_feature_idx" ON "properties_features" USING btree ("feature_id");
  CREATE INDEX "properties_agent_idx" ON "properties" USING btree ("agent_id");
  CREATE INDEX "properties_category_idx" ON "properties" USING btree ("category_id");
  CREATE INDEX "properties_city_idx" ON "properties" USING btree ("city_id");
  CREATE INDEX "properties_region_idx" ON "properties" USING btree ("region_id");
  CREATE INDEX "properties_video_idx" ON "properties" USING btree ("video_id");
  CREATE INDEX "properties_updated_at_idx" ON "properties" USING btree ("updated_at");
  CREATE INDEX "properties_created_at_idx" ON "properties" USING btree ("created_at");
  CREATE INDEX "properties_rels_order_idx" ON "properties_rels" USING btree ("order");
  CREATE INDEX "properties_rels_parent_idx" ON "properties_rels" USING btree ("parent_id");
  CREATE INDEX "properties_rels_path_idx" ON "properties_rels" USING btree ("path");
  CREATE INDEX "properties_rels_tags_id_idx" ON "properties_rels" USING btree ("tags_id");
  CREATE INDEX "properties_rels_media_id_idx" ON "properties_rels" USING btree ("media_id");
  CREATE INDEX "characteristics_updated_at_idx" ON "characteristics" USING btree ("updated_at");
  CREATE INDEX "characteristics_created_at_idx" ON "characteristics" USING btree ("created_at");
  CREATE INDEX "requests_property_idx" ON "requests" USING btree ("property_id");
  CREATE INDEX "requests_updated_at_idx" ON "requests" USING btree ("updated_at");
  CREATE INDEX "requests_created_at_idx" ON "requests" USING btree ("created_at");
  CREATE INDEX "properties_requests_purpose_order_idx" ON "properties_requests_purpose" USING btree ("order");
  CREATE INDEX "properties_requests_purpose_parent_idx" ON "properties_requests_purpose" USING btree ("parent_id");
  CREATE INDEX "properties_requests_features_order_idx" ON "properties_requests_features" USING btree ("_order");
  CREATE INDEX "properties_requests_features_parent_id_idx" ON "properties_requests_features" USING btree ("_parent_id");
  CREATE INDEX "properties_requests_features_feature_idx" ON "properties_requests_features" USING btree ("feature_id");
  CREATE INDEX "properties_requests_agent_idx" ON "properties_requests" USING btree ("agent_id");
  CREATE INDEX "properties_requests_category_idx" ON "properties_requests" USING btree ("category_id");
  CREATE INDEX "properties_requests_video_idx" ON "properties_requests" USING btree ("video_id");
  CREATE INDEX "properties_requests_updated_at_idx" ON "properties_requests" USING btree ("updated_at");
  CREATE INDEX "properties_requests_created_at_idx" ON "properties_requests" USING btree ("created_at");
  CREATE INDEX "properties_requests_rels_order_idx" ON "properties_requests_rels" USING btree ("order");
  CREATE INDEX "properties_requests_rels_parent_idx" ON "properties_requests_rels" USING btree ("parent_id");
  CREATE INDEX "properties_requests_rels_path_idx" ON "properties_requests_rels" USING btree ("path");
  CREATE INDEX "properties_requests_rels_tags_id_idx" ON "properties_requests_rels" USING btree ("tags_id");
  CREATE INDEX "properties_requests_rels_media_id_idx" ON "properties_requests_rels" USING btree ("media_id");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "regions_updated_at_idx" ON "regions" USING btree ("updated_at");
  CREATE INDEX "regions_created_at_idx" ON "regions" USING btree ("created_at");
  CREATE INDEX "cities_region_idx" ON "cities" USING btree ("region_id");
  CREATE INDEX "cities_updated_at_idx" ON "cities" USING btree ("updated_at");
  CREATE INDEX "cities_created_at_idx" ON "cities" USING btree ("created_at");
  CREATE INDEX "parent_categories_updated_at_idx" ON "parent_categories" USING btree ("updated_at");
  CREATE INDEX "parent_categories_created_at_idx" ON "parent_categories" USING btree ("created_at");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_properties_id_idx" ON "payload_locked_documents_rels" USING btree ("properties_id");
  CREATE INDEX "payload_locked_documents_rels_characteristics_id_idx" ON "payload_locked_documents_rels" USING btree ("characteristics_id");
  CREATE INDEX "payload_locked_documents_rels_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("requests_id");
  CREATE INDEX "payload_locked_documents_rels_properties_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("properties_requests_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_regions_id_idx" ON "payload_locked_documents_rels" USING btree ("regions_id");
  CREATE INDEX "payload_locked_documents_rels_cities_id_idx" ON "payload_locked_documents_rels" USING btree ("cities_id");
  CREATE INDEX "payload_locked_documents_rels_parent_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("parent_categories_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "properties_purpose" CASCADE;
  DROP TABLE "properties_features" CASCADE;
  DROP TABLE "properties" CASCADE;
  DROP TABLE "properties_rels" CASCADE;
  DROP TABLE "characteristics" CASCADE;
  DROP TABLE "requests" CASCADE;
  DROP TABLE "properties_requests_purpose" CASCADE;
  DROP TABLE "properties_requests_features" CASCADE;
  DROP TABLE "properties_requests" CASCADE;
  DROP TABLE "properties_requests_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "regions" CASCADE;
  DROP TABLE "cities" CASCADE;
  DROP TABLE "parent_categories" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_properties_purpose";
  DROP TYPE "public"."enum_properties_status";
  DROP TYPE "public"."enum_properties_is_featured";
  DROP TYPE "public"."enum_properties_requests_purpose";
  DROP TYPE "public"."enum_properties_requests_status";
  DROP TYPE "public"."enum_properties_requests_is_featured";
  DROP TYPE "public"."enum_cities_type";`)
}
