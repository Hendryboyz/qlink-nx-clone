ALTER TABLE ONLY public.general_otp
  ADD session_id uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD expired_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP;
