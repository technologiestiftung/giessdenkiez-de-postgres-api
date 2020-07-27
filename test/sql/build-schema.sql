--
-- PostgreSQL database dump
--
-- Dumped from database version 11.2
-- Dumped by pg_dump version 11.8 (Debian 11.8-1.pgdg90+1)

\set ON_ERROR_STOP on

DO $$ BEGIN IF EXISTS (
    SELECT
    FROM information_schema.tables
    WHERE table_schema = 'public'
        AND table_name = 'trees'
) THEN RAISE 'DB is allready provisioned';
END IF;
END $$;
--    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES
--            WHERE TABLE_NAME = N'employee_ids')
-- BEGIN
--   PRINT 'Yes'
-- END
-- ELSE
-- BEGIN
--   PRINT 'No'
-- End
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
--
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: fangorn
--
CREATE SCHEMA IF NOT EXISTS tiger;
ALTER SCHEMA tiger OWNER TO fangorn;
--
-- Name: tiger_data; Type: SCHEMA; Schema: -; Owner: fangorn
--
CREATE SCHEMA IF NOT EXISTS tiger_data;
ALTER SCHEMA tiger_data OWNER TO fangorn;
--
-- Name: topology; Type: SCHEMA; Schema: -; Owner: fangorn
--
CREATE SCHEMA IF NOT EXISTS topology;
ALTER SCHEMA topology OWNER TO fangorn;
--
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: fangorn
--
COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';
--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner:
--
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;
--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner:
--
COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';
--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner:
--
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;
--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner:
--
COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';
--
-- Name: postgis_tiger_geocoder; Type: EXTENSION; Schema: -; Owner:
--
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;
--
-- Name: EXTENSION postgis_tiger_geocoder; Type: COMMENT; Schema: -; Owner:
--
COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';
--
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner:
--
CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;
--
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner:
--
COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';
--
-- Name: exec(text); Type: FUNCTION; Schema: public; Owner: fangorn
--
DROP FUNCTION IF EXISTS public.exec(text);
CREATE FUNCTION public.exec(text) RETURNS text LANGUAGE plpgsql AS $_$ BEGIN EXECUTE $1;
RETURN $1;
END;
$_$;
ALTER FUNCTION public.exec(text) OWNER TO fangorn;
SET default_tablespace = '';
SET default_with_oids = false;
--
-- Name: radolan_data; Type: TABLE; Schema: public; Owner: fangorn
--
CREATE TABLE IF NOT EXISTS public.radolan_data (
    id integer NOT NULL,
    measured_at timestamp without time zone,
    value smallint,
    geom_id smallint
);
ALTER TABLE public.radolan_data OWNER TO fangorn;
--
-- Name: radolan_data_id_seq; Type: SEQUENCE; Schema: public; Owner: fangorn
--
CREATE SEQUENCE IF NOT EXISTS public.radolan_data_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE public.radolan_data_id_seq OWNER TO fangorn;
--
-- Name: radolan_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fangorn
--
ALTER SEQUENCE public.radolan_data_id_seq OWNED BY public.radolan_data.id;
--
-- Name: radolan_geometry; Type: TABLE; Schema: public; Owner: fangorn
--
CREATE TABLE IF NOT EXISTS public.radolan_geometry (
    id integer NOT NULL,
    geometry public.geometry(Polygon, 4326),
    centroid public.geometry(Point, 4326)
);
ALTER TABLE public.radolan_geometry OWNER TO fangorn;
--
-- Name: radolan_geometry_id_seq; Type: SEQUENCE; Schema: public; Owner: fangorn
--
CREATE SEQUENCE IF NOT EXISTS public.radolan_geometry_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE public.radolan_geometry_id_seq OWNER TO fangorn;
--
-- Name: radolan_geometry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fangorn
--
ALTER SEQUENCE public.radolan_geometry_id_seq OWNED BY public.radolan_geometry.id;
--
-- Name: radolan_harvester; Type: TABLE; Schema: public; Owner: fangorn
--
CREATE TABLE IF NOT EXISTS public.radolan_harvester (
    id integer NOT NULL,
    collection_date date,
    start_date timestamp without time zone,
    end_date timestamp without time zone
);
ALTER TABLE public.radolan_harvester OWNER TO fangorn;
--
-- Name: radolan_harvester_id_seq; Type: SEQUENCE; Schema: public; Owner: fangorn
--
CREATE SEQUENCE IF NOT EXISTS public.radolan_harvester_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE public.radolan_harvester_id_seq OWNER TO fangorn;
--
-- Name: radolan_harvester_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fangorn
--
ALTER SEQUENCE public.radolan_harvester_id_seq OWNED BY public.radolan_harvester.id;
--
-- Name: radolan_temp; Type: TABLE; Schema: public; Owner: fangorn
--
CREATE TABLE IF NOT EXISTS public.radolan_temp (
    id integer NOT NULL,
    geometry public.geometry(MultiPolygon, 4326),
    value smallint,
    measured_at timestamp without time zone
);
ALTER TABLE public.radolan_temp OWNER TO fangorn;
--
-- Name: radolan_temp_id_seq; Type: SEQUENCE; Schema: public; Owner: fangorn
--
CREATE SEQUENCE IF NOT EXISTS public.radolan_temp_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE public.radolan_temp_id_seq OWNER TO fangorn;
--
-- Name: radolan_temp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fangorn
--
ALTER SEQUENCE public.radolan_temp_id_seq OWNED BY public.radolan_temp.id;
--
-- Name: trees; Type: TABLE; Schema: public; Owner: fangorn
--
CREATE TABLE IF NOT EXISTS public.trees (
    id text NOT NULL,
    lat text,
    lng text,
    artdtsch text,
    "artBot" text,
    gattungdeutsch text,
    gattung text,
    strname text,
    hausnr text,
    zusatz text,
    pflanzjahr text,
    standalter text,
    kronedurch text,
    stammumfg text,
    type text,
    baumhoehe text,
    bezirk text,
    eigentuemer text,
    adopted text,
    watered text,
    radolan_sum integer,
    radolan_days integer [],
    geom public.geometry(Point, 4326)
);
ALTER TABLE public.trees OWNER TO fangorn;
--
-- Name: trees_adopted; Type: TABLE; Schema: public; Owner: fangorn
--
CREATE TABLE IF NOT EXISTS public.trees_adopted (
    id integer NOT NULL,
    tree_id text,
    uuid text
);
ALTER TABLE public.trees_adopted OWNER TO fangorn;
--
-- Name: trees_adopted_id_seq; Type: SEQUENCE; Schema: public; Owner: fangorn
--
CREATE SEQUENCE IF NOT EXISTS public.trees_adopted_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE public.trees_adopted_id_seq OWNER TO fangorn;
--
-- Name: trees_adopted_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fangorn
--
ALTER SEQUENCE public.trees_adopted_id_seq OWNED BY public.trees_adopted.id;
--
-- Name: trees_extention; Type: TABLE; Schema: public; Owner: fangorn
--
CREATE TABLE IF NOT EXISTS public.trees_extention (
    id_ text NOT NULL,
    "STANDORTNR" text,
    "KENNZEICH" text,
    "NAMENR" text
);
ALTER TABLE public.trees_extention OWNER TO fangorn;
--
-- Name: trees_temp; Type: TABLE; Schema: public; Owner: fangorn
--
CREATE TABLE IF NOT EXISTS public.trees_temp (
    id text NOT NULL,
    lat text,
    lng text,
    artdtsch text,
    "artBot" text,
    gattungdeutsch text,
    gattung text,
    strname text,
    hausnr text,
    zusatz text,
    pflanzjahr text,
    standalter text,
    kronedurch text,
    stammumfg text,
    type text,
    baumhoehe text,
    bezirk text,
    eigentuemer text,
    adopted text,
    watered text,
    radolan_sum integer,
    radolan_days integer [],
    geom public.geometry(Point, 4326)
);
ALTER TABLE public.trees_temp OWNER TO fangorn;
--
-- Name: trees_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: fangorn
--
CREATE MATERIALIZED VIEW IF NOT EXISTS public.trees_mv AS
SELECT trees.id,
    trees.lat,
    trees.lng,
    trees.artdtsch,
    trees."artBot",
    trees.gattungdeutsch,
    trees.gattung,
    trees.strname,
    trees.hausnr,
    trees.zusatz,
    trees.pflanzjahr,
    trees.standalter,
    trees.kronedurch,
    trees.stammumfg,
    trees.type,
    trees.baumhoehe,
    trees.bezirk,
    trees.eigentuemer,
    trees.adopted,
    trees.watered,
    trees.radolan_sum,
    trees.radolan_days,
    trees.geom
FROM public.trees
UNION ALL
SELECT trees_temp.id,
    trees_temp.lat,
    trees_temp.lng,
    trees_temp.artdtsch,
    trees_temp."artBot",
    trees_temp.gattungdeutsch,
    trees_temp.gattung,
    trees_temp.strname,
    trees_temp.hausnr,
    trees_temp.zusatz,
    trees_temp.pflanzjahr,
    trees_temp.standalter,
    trees_temp.kronedurch,
    trees_temp.stammumfg,
    trees_temp.type,
    trees_temp.baumhoehe,
    trees_temp.bezirk,
    trees_temp.eigentuemer,
    trees_temp.adopted,
    trees_temp.watered,
    trees_temp.radolan_sum,
    trees_temp.radolan_days,
    trees_temp.geom
FROM public.trees_temp WITH NO DATA;
ALTER TABLE public.trees_mv OWNER TO fangorn;
--
-- Name: trees_mv2; Type: MATERIALIZED VIEW; Schema: public; Owner: fangorn
--
CREATE MATERIALIZED VIEW IF NOT EXISTS public.trees_mv2 AS
SELECT trees_mv.id,
    trees_mv.lat,
    trees_mv.lng,
    trees_mv.artdtsch,
    trees_mv."artBot",
    trees_mv.gattungdeutsch,
    trees_mv.gattung,
    trees_mv.strname,
    trees_mv.hausnr,
    trees_mv.zusatz,
    trees_mv.pflanzjahr,
    trees_mv.standalter,
    trees_mv.kronedurch,
    trees_mv.stammumfg,
    trees_mv.type,
    trees_mv.baumhoehe,
    trees_mv.bezirk,
    trees_mv.eigentuemer,
    trees_mv.adopted,
    trees_mv.watered,
    trees_mv.radolan_sum,
    trees_mv.radolan_days,
    trees_mv.geom,
    trees_extention.id_,
    trees_extention."STANDORTNR",
    trees_extention."KENNZEICH",
    trees_extention."NAMENR"
FROM (
        public.trees_mv
        LEFT JOIN public.trees_extention ON ((trees_mv.id = trees_extention.id_))
    ) WITH NO DATA;
ALTER TABLE public.trees_mv2 OWNER TO fangorn;
--
-- Name: trees_watered; Type: TABLE; Schema: public; Owner: fangorn
--
CREATE TABLE IF NOT EXISTS public.trees_watered (
    tree_id text NOT NULL,
    "time" text NOT NULL,
    uuid text,
    amount text,
    "timestamp" timestamp without time zone,
    username text
);
ALTER TABLE public.trees_watered OWNER TO fangorn;
--
-- Name: trees_watered_batch; Type: TABLE; Schema: public; Owner: fangorn
--
CREATE TABLE IF NOT EXISTS public.trees_watered_batch (
    tree_id text,
    "time" text,
    uuid text,
    amount text,
    "timestamp" timestamp without time zone,
    username text
);
ALTER TABLE public.trees_watered_batch OWNER TO fangorn;
--
-- Name: users; Type: TABLE; Schema: public; Owner: fangorn
--
CREATE TABLE IF NOT EXISTS public.users (email text, uuid text);
ALTER TABLE public.users OWNER TO fangorn;
--
-- Name: radolan_data id; Type: DEFAULT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.radolan_data
ALTER COLUMN id
SET DEFAULT nextval('public.radolan_data_id_seq'::regclass);
--
-- Name: radolan_geometry id; Type: DEFAULT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.radolan_geometry
ALTER COLUMN id
SET DEFAULT nextval('public.radolan_geometry_id_seq'::regclass);
--
-- Name: radolan_harvester id; Type: DEFAULT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.radolan_harvester
ALTER COLUMN id
SET DEFAULT nextval('public.radolan_harvester_id_seq'::regclass);
--
-- Name: radolan_temp id; Type: DEFAULT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.radolan_temp
ALTER COLUMN id
SET DEFAULT nextval('public.radolan_temp_id_seq'::regclass);
--
-- Name: trees_adopted id; Type: DEFAULT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.trees_adopted
ALTER COLUMN id
SET DEFAULT nextval('public.trees_adopted_id_seq'::regclass);
--
-- Name: radolan_data radolan_data_pkey; Type: CONSTRAINT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.radolan_data
ADD CONSTRAINT radolan_data_pkey PRIMARY KEY (id);
--
-- Name: radolan_geometry radolan_geometry_pkey; Type: CONSTRAINT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.radolan_geometry
ADD CONSTRAINT radolan_geometry_pkey PRIMARY KEY (id);
--
-- Name: radolan_harvester radolan_harvester_pkey; Type: CONSTRAINT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.radolan_harvester
ADD CONSTRAINT radolan_harvester_pkey PRIMARY KEY (id);
--
-- Name: radolan_temp radolan_temp_pkey; Type: CONSTRAINT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.radolan_temp
ADD CONSTRAINT radolan_temp_pkey PRIMARY KEY (id);
--
-- Name: trees_adopted trees_adopted_pkey; Type: CONSTRAINT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.trees_adopted
ADD CONSTRAINT trees_adopted_pkey PRIMARY KEY (id);
--
-- Name: trees_extention trees_extention_pkey; Type: CONSTRAINT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.trees_extention
ADD CONSTRAINT trees_extention_pkey PRIMARY KEY (id_);
--
-- Name: trees trees_pkey; Type: CONSTRAINT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.trees
ADD CONSTRAINT trees_pkey PRIMARY KEY (id);
--
-- Name: trees_temp trees_temp_pkey; Type: CONSTRAINT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.trees_temp
ADD CONSTRAINT trees_temp_pkey PRIMARY KEY (id);
--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: fangorn
--
ALTER TABLE ONLY public.users
ADD CONSTRAINT users_email_key UNIQUE (email);
--
-- Name: pflanzjahr_index; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS pflanzjahr_index ON public.trees USING btree (pflanzjahr);
--
-- Name: pflanzjahr_temp_index; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS pflanzjahr_temp_index ON public.trees_temp USING btree (pflanzjahr);
--
-- Name: radolan_data_geom_id; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS radolan_data_geom_id ON public.radolan_data USING btree (geom_id);
--
-- Name: radolan_data_measured_at; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS radolan_data_measured_at ON public.radolan_data USING btree (measured_at);
--
-- Name: radolan_geometry_centroid; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS radolan_geometry_centroid ON public.radolan_geometry USING gist (centroid);
--
-- Name: radolan_geometry_geometry; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS radolan_geometry_geometry ON public.radolan_geometry USING gist (geometry);
--
-- Name: radolan_temp_geometry; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS radolan_temp_geometry ON public.radolan_temp USING gist (geometry);
--
-- Name: trees_adopted_tree_id; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS trees_adopted_tree_id ON public.trees_adopted USING btree (tree_id);
--
-- Name: trees_adopted_uuid; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS trees_adopted_uuid ON public.trees_adopted USING btree (uuid);
--
-- Name: trees_geom; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS trees_geom ON public.trees USING gist (geom);
--
-- Name: trees_id_idx; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS trees_id_idx ON public.trees USING btree (id);
--
-- Name: trees_temp_geom; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS trees_temp_geom ON public.trees_temp USING gist (geom);
--
-- Name: trees_temp_id_idx; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS trees_temp_id_idx ON public.trees_temp USING btree (id);
--
-- Name: trees_temp_temp_pkey; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE UNIQUE INDEX IF NOT EXISTS trees_temp_temp_pkey ON public.trees_temp USING btree (id);
--
-- Name: trees_watered_timestamp; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS trees_watered_timestamp ON public.trees_watered USING btree ("timestamp");
--
-- Name: trees_watered_tree_id; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS trees_watered_tree_id ON public.trees_watered USING btree (tree_id);
--
-- Name: trees_watered_uuid; Type: INDEX; Schema: public; Owner: fangorn
--
CREATE INDEX IF NOT EXISTS trees_watered_uuid ON public.trees_watered USING btree (uuid);
--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: fangorn
--
REVOKE ALL ON SCHEMA public
FROM fangorn;
REVOKE ALL ON SCHEMA public
FROM PUBLIC;
GRANT ALL ON SCHEMA public TO fangorn;
GRANT ALL ON SCHEMA public TO PUBLIC;
--
-- Name: TABLE geocode_settings; Type: ACL; Schema: tiger; Owner: fangorn
--
REVOKE ALL ON TABLE tiger.geocode_settings
FROM fangorn;
REVOKE
SELECT ON TABLE tiger.geocode_settings
FROM PUBLIC;
GRANT ALL ON TABLE tiger.geocode_settings TO fangorn;
GRANT SELECT ON TABLE tiger.geocode_settings TO PUBLIC;
--
-- Name: TABLE geocode_settings_default; Type: ACL; Schema: tiger; Owner: fangorn
--
REVOKE ALL ON TABLE tiger.geocode_settings_default
FROM fangorn;
REVOKE
SELECT ON TABLE tiger.geocode_settings_default
FROM PUBLIC;
GRANT ALL ON TABLE tiger.geocode_settings_default TO fangorn;
GRANT SELECT ON TABLE tiger.geocode_settings_default TO PUBLIC;
--
-- Name: TABLE loader_lookuptables; Type: ACL; Schema: tiger; Owner: fangorn
--
REVOKE ALL ON TABLE tiger.loader_lookuptables
FROM fangorn;
REVOKE
SELECT ON TABLE tiger.loader_lookuptables
FROM PUBLIC;
GRANT ALL ON TABLE tiger.loader_lookuptables TO fangorn;
GRANT SELECT ON TABLE tiger.loader_lookuptables TO PUBLIC;
--
-- Name: TABLE loader_platform; Type: ACL; Schema: tiger; Owner: fangorn
--
REVOKE ALL ON TABLE tiger.loader_platform
FROM fangorn;
REVOKE
SELECT ON TABLE tiger.loader_platform
FROM PUBLIC;
GRANT ALL ON TABLE tiger.loader_platform TO fangorn;
GRANT SELECT ON TABLE tiger.loader_platform TO PUBLIC;
--
-- Name: TABLE loader_variables; Type: ACL; Schema: tiger; Owner: fangorn
--
REVOKE ALL ON TABLE tiger.loader_variables
FROM fangorn;
REVOKE
SELECT ON TABLE tiger.loader_variables
FROM PUBLIC;
GRANT ALL ON TABLE tiger.loader_variables TO fangorn;
GRANT SELECT ON TABLE tiger.loader_variables TO PUBLIC;
--
-- Name: TABLE pagc_gaz; Type: ACL; Schema: tiger; Owner: fangorn
--
REVOKE ALL ON TABLE tiger.pagc_gaz
FROM fangorn;
REVOKE
SELECT ON TABLE tiger.pagc_gaz
FROM PUBLIC;
GRANT ALL ON TABLE tiger.pagc_gaz TO fangorn;
GRANT SELECT ON TABLE tiger.pagc_gaz TO PUBLIC;
--
-- Name: TABLE pagc_lex; Type: ACL; Schema: tiger; Owner: fangorn
--
REVOKE ALL ON TABLE tiger.pagc_lex
FROM fangorn;
REVOKE
SELECT ON TABLE tiger.pagc_lex
FROM PUBLIC;
GRANT ALL ON TABLE tiger.pagc_lex TO fangorn;
GRANT SELECT ON TABLE tiger.pagc_lex TO PUBLIC;
--
-- Name: TABLE pagc_rules; Type: ACL; Schema: tiger; Owner: fangorn
--
REVOKE ALL ON TABLE tiger.pagc_rules
FROM fangorn;
REVOKE
SELECT ON TABLE tiger.pagc_rules
FROM PUBLIC;
GRANT ALL ON TABLE tiger.pagc_rules TO fangorn;
GRANT SELECT ON TABLE tiger.pagc_rules TO PUBLIC;
--
-- PostgreSQL database dump complete
--