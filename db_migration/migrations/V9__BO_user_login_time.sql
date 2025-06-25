ALTER TABLE ONLY public.bo_users
  ADD last_login_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;

