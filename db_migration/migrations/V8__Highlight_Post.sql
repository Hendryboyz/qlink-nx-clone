ALTER TABLE ONLY public.posts
  ADD is_highlight boolean DEFAULT false NOT NULL;

ALTER TABLE ONLY public.posts
  DROP COLUMN publish_start_date;

ALTER TABLE ONLY public.posts
  DROP COLUMN publish_end_date;

