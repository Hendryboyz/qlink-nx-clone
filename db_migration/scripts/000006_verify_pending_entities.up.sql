CREATE TYPE CRM_ENTITIES AS ENUM('vehicle', 'member');

CREATE TABLE crm_pending_entities (
  id varchar(256) NOT NULL,
  entity_id varchar(16) NOT NULL, -- ex: M-2601-200027, VRD-2511-200044
  "type" CRM_ENTITIES NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  is_done bool DEFAULT false NULL,
  CONSTRAINT crm_pending_entities_pkey PRIMARY KEY (id)
);
