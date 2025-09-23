ALTER TABLE ONLY public.product
  ALTER COLUMN dealer_name SET NOT NULL,
  ALTER COLUMN dealer_name SET DEFAULT '';
