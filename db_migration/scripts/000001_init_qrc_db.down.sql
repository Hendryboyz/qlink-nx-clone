DROP TRIGGER IF EXISTS update_otp_modtime
  ON general_otp;

DROP TABLE IF EXISTS general_otp;

-- DROP posts

DROP TRIGGER IF EXISTS update_posts_modtime
  ON posts;

DROP TABLE IF EXISTS posts;

-- DROP product
DROP INDEX IF EXISTS idx_product_user_id;

DROP TRIGGER IF EXISTS update_product_modtime
  ON product;

DROP TABLE IF EXISTS product;

DROP SEQUENCE IF EXISTS vehicle_seq;

-- DROP users
DROP TRIGGER IF EXISTS update_users_updated_at
  ON users;

DROP TABLE IF EXISTS users;

DROP SEQUENCE IF EXISTS member_seq;

DROP TYPE IF EXISTS GENDER;

DROP FUNCTION IF EXISTS update_modified_column;
