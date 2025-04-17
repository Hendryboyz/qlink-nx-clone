ALTER TABLE ONLY public.users
  ADD avatar_s3uri varchar(256) NULL;

ALTER TABLE ONLY public.users
  ALTER COLUMN avatar_s3uri SET STORAGE EXTENDED;
