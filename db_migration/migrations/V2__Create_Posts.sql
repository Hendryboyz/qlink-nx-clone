--
-- PostgreSQL database dump
--

-- Dumped from database version 13.15 (Debian 13.15-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-09-26 19:02:42 CST

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 204 (class 1259 OID 16455)
-- Name: posts; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    content text NOT NULL,
    cover_image character varying(255),
    is_active boolean DEFAULT false NOT NULL,
    publish_start_date timestamp with time zone,
    publish_end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.posts OWNER TO local;

--
-- TOC entry 3026 (class 0 OID 16455)
-- Dependencies: 204
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.posts (id, title, category, content, cover_image, is_active, publish_start_date, publish_end_date, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 2894 (class 2606 OID 16466)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 2892 (class 1259 OID 16467)
-- Name: idx_posts_publish_dates; Type: INDEX; Schema: public; Owner: test
--

CREATE INDEX idx_posts_publish_dates ON public.posts USING btree (publish_start_date, publish_end_date);


--
-- TOC entry 2895 (class 2620 OID 16468)
-- Name: posts update_posts_modtime; Type: TRIGGER; Schema: public; Owner: test
--

CREATE TRIGGER update_posts_modtime BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


-- Completed on 2024-09-26 19:02:42 CST

--
-- PostgreSQL database dump complete
--

