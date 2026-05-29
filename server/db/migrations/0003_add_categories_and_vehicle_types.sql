ALTER TABLE "home_categories" ADD COLUMN "description" text DEFAULT '' NOT NULL;

CREATE TABLE "vehicle_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicle_types_value_unique" UNIQUE("value")
);

ALTER TABLE "cars" ADD COLUMN "category_id" uuid;
ALTER TABLE "cars" ADD COLUMN "vehicle_type_id" uuid;
ALTER TABLE "cars" ADD CONSTRAINT "cars_category_id_home_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."home_categories"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "cars" ADD CONSTRAINT "cars_vehicle_type_id_vehicle_types_id_fk" FOREIGN KEY ("vehicle_type_id") REFERENCES "public"."vehicle_types"("id") ON DELETE set null ON UPDATE no action;
