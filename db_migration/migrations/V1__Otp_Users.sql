--
-- PostgreSQL database dump
--

-- Dumped from database version 13.15 (Debian 13.15-1.pgdg120+1)
-- Dumped by pg_dump version 16.3

-- Started on 2024-09-26 18:31:39 CST

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
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: test
--

CREATE SCHEMA IF NOT EXISTS public;


ALTER SCHEMA public OWNER TO local;

--
-- TOC entry 3038 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: test
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 203 (class 1255 OID 16385)
-- Name: update_modified_column(); Type: FUNCTION; Schema: public; Owner: test
--

CREATE FUNCTION public.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_modified_column() OWNER TO local;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 200 (class 1259 OID 16386)
-- Name: otp; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.otp (
    id integer NOT NULL,
    type character varying(20) NOT NULL,
    code character varying(6) NOT NULL,
    phone character varying(20) NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.otp OWNER TO local;

--
-- TOC entry 201 (class 1259 OID 16392)
-- Name: otp_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.otp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.otp_id_seq OWNER TO local;

--
-- TOC entry 3040 (class 0 OID 0)
-- Dependencies: 201
-- Name: otp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.otp_id_seq OWNED BY public.otp.id;


--
-- TOC entry 202 (class 1259 OID 16394)
-- Name: users; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    phone character varying(50) NOT NULL,
    email character varying(100),
    password character varying(255) NOT NULL,
    first_name character varying(50) NOT NULL,
    mid_name character varying(50),
    last_name character varying(50) NOT NULL,
    address_state character varying(50) NOT NULL,
    address_city character varying(50) NOT NULL,
    address_detail character varying(50),
    birthday date,
    source smallint,
    whatsapp character varying(50),
    facebook character varying(50),
    is_delete boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    type character varying NOT NULL
);


ALTER TABLE public.users OWNER TO local;

--
-- TOC entry 3041 (class 0 OID 0)
-- Dependencies: 202
-- Name: COLUMN users.type; Type: COMMENT; Schema: public; Owner: test
--

COMMENT ON COLUMN public.users.type IS 'The user type';


--
-- TOC entry 2882 (class 2604 OID 16404)
-- Name: otp id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.otp ALTER COLUMN id SET DEFAULT nextval('public.otp_id_seq'::regclass);


--
-- TOC entry 3030 (class 0 OID 16386)
-- Dependencies: 200
-- Data for Name: otp; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.otp (id, type, code, phone, is_verified, created_at, updated_at) FROM stdin;
17	reset-password	6004	111111111112	t	2024-07-28 06:10:55.690364+00	2024-07-28 06:11:04.402517+00
18	reset-password	8668	111111111112	t	2024-07-28 06:22:27.233852+00	2024-07-28 06:22:43.871029+00
19	reset-password	4447	111111111112	t	2024-08-24 07:02:43.907902+00	2024-08-24 07:03:03.963275+00
20	register	1026	110000000000	t	2024-09-09 08:50:02.861599+00	2024-09-09 08:50:33.336462+00
21	register	2572	123456789000	t	2024-09-14 14:43:56.804973+00	2024-09-14 14:44:07.081685+00
22	register	5081	123456677888	f	2024-09-17 02:56:02.33344+00	2024-09-17 02:56:02.33344+00
23	register	6828	123456677888	f	2024-09-17 02:56:16.993015+00	2024-09-17 02:56:16.993015+00
24	register	8236	111111111111	t	2024-09-24 12:55:36.469318+00	2024-09-24 12:56:11.903391+00
\.


--
-- TOC entry 3032 (class 0 OID 16394)
-- Dependencies: 202
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.users (id, phone, email, password, first_name, mid_name, last_name, address_state, address_city, address_detail, birthday, source, whatsapp, facebook, is_delete, created_at, updated_at, type) FROM stdin;
c2335839-0dd1-4d12-b8b2-62d8716f8c67	110000000000	\N	$2b$10$zYDuNAatfMnWpVAcjYnMce1BuvSWYeRxB0zCsIUZ8FA46XoMElzNW	Chen	\N	Vian	Taiwan	Taipei	\N	\N	\N	\N	\N	f	2024-09-09 08:55:06.042976+00	2024-09-09 08:55:06.042976+00	client
20020357-4b4e-4c81-9806-4deab687b706	111111111112	quentin.tu.sc@gmail.com	$2b$10$3NHFw7bEYiqN6pRFSktu8eqdiyQvZlEf.oyg6j79YCQO2VNvCFcmC	Tuu	Szu	Chiii	Taiwan	Taipei		1995-02-26	0	sdfsdf123	sdf123	f	2024-07-28 03:16:07.533436+00	2024-09-23 12:09:12.218751+00	client
bc4a7ae1-d0d6-488d-9a5d-69988207f791	111111111111	21212@cool.com	$2b$10$gMiRj.UCP85vHhBR0exc8.y12W26myfHfufQHsIvnRX1ZUY388EiG	ff	sf	sf	Bayelsa	Arlington	\N	2024-09-12	\N	121	2121	f	2024-09-24 12:58:04.145642+00	2024-09-24 12:58:04.145642+00	client
\.


--
-- TOC entry 3042 (class 0 OID 0)
-- Dependencies: 201
-- Name: otp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.otp_id_seq', 24, true);


--
-- TOC entry 2891 (class 2606 OID 16406)
-- Name: otp otp_pkey; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.otp
    ADD CONSTRAINT otp_pkey PRIMARY KEY (id);


--
-- TOC entry 2893 (class 2606 OID 16408)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 2895 (class 2606 OID 16410)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 2897 (class 2606 OID 16412)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2898 (class 2620 OID 16413)
-- Name: otp update_otp_updated_at; Type: TRIGGER; Schema: public; Owner: test
--

CREATE TRIGGER update_otp_updated_at BEFORE UPDATE ON public.otp FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- TOC entry 2899 (class 2620 OID 16414)
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: test
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- TOC entry 3039 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: test
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2024-09-26 18:31:39 CST

--
-- PostgreSQL database dump complete
--

