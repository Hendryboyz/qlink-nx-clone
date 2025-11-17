CREATE TABLE bo_users (
   id uuid DEFAULT gen_random_uuid() NOT NULL,
   username varchar(56) NOT NULL,
   "password" varchar(256) NOT NULL,
   "role" varchar(32) NOT NULL,
   created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
   updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
   last_login_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
   CONSTRAINT bo_users_pkey PRIMARY KEY (id),
   CONSTRAINT bo_users_username_key UNIQUE (username)
);

-- default bo users
INSERT INTO bo_users (username, password, role) VALUES
-- password: admin123
  ('admin', '$2b$10$4I1V032XSoogyZy5iA7Xp.GYsXIaEf/nNJpiQYplHtX7hLX4dNoj2', 'admin'),
-- password: agent123
  ('agent', '$2b$10$QyYcTz.Y1kWGAg00pkBSgOmcg51WoVDtHni551uJKt7p9huqRI5Ku', 'agent');

CREATE TRIGGER update_bo_users_modtime BEFORE
  UPDATE
  ON
    bo_users FOR EACH ROW EXECUTE function update_modified_column();

CREATE UNIQUE INDEX IF NOT EXISTS idx_bo_users_username_key
  ON bo_users USING btree (username);

CREATE TABLE bo_refresh_tokens (
  user_id uuid NOT NULL,
  "token" text NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
  CONSTRAINT bo_refresh_tokens_pkey PRIMARY KEY (user_id),
  CONSTRAINT bo_refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES bo_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bo_refresh_tokens_token
  ON bo_refresh_tokens USING btree (token);
