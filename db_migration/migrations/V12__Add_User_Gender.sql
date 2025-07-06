CREATE TYPE GENDER AS ENUM('Male','Female', 'Other');

ALTER TABLE ONLY public.users
  ADD gender GENDER NOT NULL DEFAULT 'Other';
