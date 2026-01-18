ALTER TABLE product
  ADD COLUMN IF NOT EXISTS is_delete bool DEFAULT false NULL;
