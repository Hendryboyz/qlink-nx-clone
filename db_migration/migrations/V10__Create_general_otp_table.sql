CREATE TABLE public.general_otp (
    id integer NOT NULL,
    type character varying(20) NOT NULL,
    code character varying(6) NOT NULL,
    identifier character varying(512) NOT NULL,
    identifier_type character varying(20) NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE general_otp_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

ALTER SEQUENCE general_otp_id_seq OWNED BY general_otp.id;

ALTER TABLE ONLY public.general_otp ALTER COLUMN id SET DEFAULT nextval('public.general_otp_id_seq'::regclass);
