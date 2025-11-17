CREATE OR REPLACE FUNCTION update_modified_column() RETURNS trigger
  LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$;

-- members table

CREATE TYPE GENDER AS ENUM('Male','Female');

CREATE SEQUENCE IF NOT EXISTS member_seq
	AS INT
	INCREMENT BY 1
	START WITH 1;

-- Reset member seq every year
-- SELECT setval('member_seq', 0);

CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  phone varchar(32) NOT NULL,
  email varchar(128) NULL,
  "password" varchar(256) NOT NULL,
  first_name varchar(64) NOT NULL,
  mid_name varchar(64) NULL,
  last_name varchar(64) NOT NULL,
  address_state varchar(64) NOT NULL,
  address_city varchar(64) NOT NULL,
  address_detail varchar(128) NULL,
  birthday date NULL,
  "source" int2 NULL,
  whatsapp varchar(64) NULL,
  facebook varchar(64) NULL,
  is_delete bool DEFAULT false NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
  "type" varchar NOT NULL,
  avatar_s3uri varchar(256) NULL,
  member_id varchar(128) DEFAULT ''::character varying NOT NULL,
  gender public.gender DEFAULT 'Male'::gender NOT NULL,
  crm_id varchar(64) NULL,
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_phone_key UNIQUE (phone),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TRIGGER update_users_updated_at BEFORE
  UPDATE
  ON users FOR EACH ROW EXECUTE function update_modified_column();

CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users USING btree (email);

-- products(vehicles) table

CREATE SEQUENCE IF NOT EXISTS vehicle_seq
	AS INT
	INCREMENT BY 1
	START WITH 1;

-- Reset vehicle seq every year
-- SELECT setval('vehicle_seq', 0);

CREATE TABLE product (
  id varchar(256) NOT NULL,
  user_id uuid NOT NULL,
  vin varchar(32) NOT NULL,
  engine_number varchar(32) NOT NULL,
  model varchar(64) NOT NULL,
  purchase_date date NOT NULL,
  registration_date date NOT NULL,
  dealer_name varchar(128) DEFAULT ''::character NOT NULL,
  "year" int4 NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  crm_id varchar(64) NULL,
  is_verified bool DEFAULT false NULL,
  verify_times int4 DEFAULT 0 NOT NULL,
  CONSTRAINT product_pkey PRIMARY KEY (id),
  CONSTRAINT product_user_id FOREIGN KEY (user_id) references users(id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TRIGGER update_product_modtime BEFORE
  UPDATE
  ON
    public.product FOR EACH ROW EXECUTE function update_modified_column();

CREATE INDEX idx_product_user_id ON product USING btree (user_id);

CREATE TABLE posts (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  title varchar(256) NOT NULL,
  category varchar(64) NOT NULL,
  "content" text NOT NULL,
  cover_image varchar(256) NULL,
  is_active bool DEFAULT false NOT NULL,
  is_highlight bool DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);

CREATE TRIGGER update_posts_modtime BEFORE
  UPDATE
  ON
    posts FOR EACH ROW EXECUTE function update_modified_column();

CREATE TABLE general_otp (
  id serial4 NOT NULL,
  "type" varchar(32) NOT NULL,
  code varchar(6) NOT NULL,
  identifier varchar(512) NOT NULL,
  identifier_type varchar(32) NOT NULL,
  session_id uuid DEFAULT gen_random_uuid() NOT NULL,
  is_verified bool DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  expired_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER update_otp_modtime BEFORE
  UPDATE
  ON
    general_otp FOR EACH ROW EXECUTE function update_modified_column();

