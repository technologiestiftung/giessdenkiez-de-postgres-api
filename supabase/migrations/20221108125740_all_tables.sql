CREATE SEQUENCE "public"."radolan_data_id_seq";

CREATE SEQUENCE "public"."radolan_geometry_id_seq";

CREATE SEQUENCE "public"."radolan_harvester_id_seq";

CREATE SEQUENCE "public"."radolan_temp_id_seq";

CREATE SEQUENCE "public"."trees_adopted_id_seq";

CREATE SEQUENCE "public"."trees_watered_id_seq";

CREATE TABLE "public"."radolan_data" (
	"id" integer NOT NULL DEFAULT nextval('radolan_data_id_seq'::regclass),
	"measured_at" timestamp without time zone,
	"value" smallint,
	"geom_id" smallint
);

CREATE TABLE "public"."radolan_geometry" (
	"id" integer NOT NULL DEFAULT nextval('radolan_geometry_id_seq'::regclass),
	"geometry" geometry(polygon, 4326),
	"centroid" geometry(point, 4326)
);

CREATE TABLE "public"."radolan_harvester" (
	"id" integer NOT NULL DEFAULT nextval('radolan_harvester_id_seq'::regclass),
	"collection_date" date,
	"start_date" timestamp without time zone,
	"end_date" timestamp without time zone
);

CREATE TABLE "public"."radolan_temp" (
	"id" integer NOT NULL DEFAULT nextval('radolan_temp_id_seq'::regclass),
	"geometry" geometry(MultiPolygon, 4326),
	"value" smallint,
	"measured_at" timestamp without time zone
);

CREATE TABLE "public"."trees" (
	"id" text NOT NULL,
	"lat" text,
	"lng" text,
	"artdtsch" text,
	"artbot" text,
	"gattungdeutsch" text,
	"gattung" text,
	"strname" text,
	"hausnr" text,
	"zusatz" text,
	"pflanzjahr" text,
	"standalter" text,
	"kronedurch" text,
	"stammumfg" text,
	"type" text,
	"baumhoehe" text,
	"bezirk" text,
	"eigentuemer" text,
	"adopted" text,
	"watered" text,
	"radolan_sum" integer,
	"radolan_days" integer[],
	"geom" geometry(point, 4326),
	"standortnr" text,
	"kennzeich" text,
	"caretaker" text,
	"gmlid" text
);

CREATE TABLE "public"."trees_adopted" (
	"id" integer NOT NULL DEFAULT nextval('trees_adopted_id_seq'::regclass),
	"uuid" text,
	"tree_id" text NOT NULL
);

CREATE TABLE "public"."trees_watered" (
	"time" text NOT NULL,
	"uuid" text,
	"amount" numeric,
	"timestamp" timestamp with time zone,
	"username" text,
	"id" integer NOT NULL DEFAULT nextval('trees_watered_id_seq'::regclass),
	"tree_id" text NOT NULL
);

CREATE UNIQUE INDEX radolan_data_pkey ON public.radolan_data USING btree (id);

CREATE UNIQUE INDEX radolan_geometry_pkey ON public.radolan_geometry USING btree (id);

CREATE UNIQUE INDEX radolan_harvester_pkey ON public.radolan_harvester USING btree (id);

CREATE UNIQUE INDEX radolan_temp_pkey ON public.radolan_temp USING btree (id);

CREATE UNIQUE INDEX trees_adopted_pkey ON public.trees_adopted USING btree (id);

CREATE UNIQUE INDEX trees_pkey ON public.trees USING btree (id);

CREATE UNIQUE INDEX trees_watered_pkey ON public.trees_watered USING btree (id);

ALTER TABLE "public"."radolan_data"
	ADD CONSTRAINT "radolan_data_pkey" PRIMARY KEY USING INDEX "radolan_data_pkey";

ALTER TABLE "public"."radolan_geometry"
	ADD CONSTRAINT "radolan_geometry_pkey" PRIMARY KEY USING INDEX "radolan_geometry_pkey";

ALTER TABLE "public"."radolan_harvester"
	ADD CONSTRAINT "radolan_harvester_pkey" PRIMARY KEY USING INDEX "radolan_harvester_pkey";

ALTER TABLE "public"."radolan_temp"
	ADD CONSTRAINT "radolan_temp_pkey" PRIMARY KEY USING INDEX "radolan_temp_pkey";

ALTER TABLE "public"."trees"
	ADD CONSTRAINT "trees_pkey" PRIMARY KEY USING INDEX "trees_pkey";

ALTER TABLE "public"."trees_adopted"
	ADD CONSTRAINT "trees_adopted_pkey" PRIMARY KEY USING INDEX "trees_adopted_pkey";

ALTER TABLE "public"."trees_watered"
	ADD CONSTRAINT "trees_watered_pkey" PRIMARY KEY USING INDEX "trees_watered_pkey";

ALTER TABLE "public"."trees_adopted"
	ADD CONSTRAINT "fk_trees_adopted_trees" FOREIGN KEY (tree_id) REFERENCES trees (id) NOT valid;

ALTER TABLE "public"."trees_adopted" validate CONSTRAINT "fk_trees_adopted_trees";

ALTER TABLE "public"."trees_watered"
	ADD CONSTRAINT "fk_trees_watered_trees" FOREIGN KEY (tree_id) REFERENCES trees (id) NOT valid;

ALTER TABLE "public"."trees_watered" validate CONSTRAINT "fk_trees_watered_trees";

ALTER TABLE "public"."trees_watered"
	ADD CONSTRAINT "trees_watered_amount_check" CHECK ((amount > (0)::numeric)) NOT valid;

ALTER TABLE "public"."trees_watered" validate CONSTRAINT "trees_watered_amount_check";

