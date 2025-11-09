CREATE TYPE BANNER_ALIGNMENT AS ENUM('top','bottom', 'middle');

CREATE TABLE IF NOT EXISTS public.banners (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  order number NOT NULL DEFAULT 0,
  enabled boolean DEFAULT true,
  main_title varchar() NOT NULL,
  subtitle varchar() NULL,
  label varchar() NULL,
  button_text NOT NULL,
  alignment BANNER_ALIGNMENT NOT NULL,
  image_url text NULL,
  link_url text NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
