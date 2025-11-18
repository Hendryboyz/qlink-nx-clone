CREATE TYPE BANNERS_ALIGNMENT AS ENUM('top','middle', 'bottom');

CREATE TABLE IF NOT EXISTS banners (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  label varchar(32) NULL,
  title varchar(64) NOT NULL,
  subtitle varchar(128) NULL,
  image varchar(256) NULL,
  button varchar(32) NOT NULL DEFAULT 'View Detail',
  link varchar(256) NULL,
  alignment BANNERS_ALIGNMENT DEFAULT 'middle'::BANNERS_ALIGNMENT NOT NULL,
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL
);

CREATE TRIGGER update_banners_updated_at BEFORE
  UPDATE
  ON banners FOR EACH ROW EXECUTE function update_modified_column();

