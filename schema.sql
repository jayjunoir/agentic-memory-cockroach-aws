-- 1. Multi-tenant framing
CREATE TABLE IF NOT EXISTS tenants (
    tenant_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            STRING NOT NULL,
    crdb_region     STRING NOT NULL DEFAULT 'eu-central-1', 
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Raw ingested alerts
CREATE TABLE IF NOT EXISTS alerts (
    alert_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(tenant_id),
    source          STRING NOT NULL,          
    raw_payload     JSONB NOT NULL,
    s3_artifact_key STRING,                   
    severity        STRING,
    status          STRING NOT NULL DEFAULT 'new',
    received_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    INDEX idx_alerts_status (tenant_id, status, received_at)
);

-- 3. Case management ledger
CREATE TABLE IF NOT EXISTS incidents (
    incident_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(tenant_id),
    alert_id        UUID NOT NULL REFERENCES alerts(alert_id),
    title           STRING NOT NULL,
    summary         STRING,
    status          STRING NOT NULL DEFAULT 'open', 
    disposition     STRING,                         
    opened_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at       TIMESTAMPTZ
);

-- 4. Long-term semantic memory with INLINE vector index definition
CREATE TABLE IF NOT EXISTS incident_embeddings (
    embedding_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(tenant_id),
    crdb_region     STRING NOT NULL DEFAULT 'eu-central-1',
    incident_id     UUID NOT NULL REFERENCES incidents(incident_id),
    content_summary STRING NOT NULL,          
    embedding       VECTOR(1024) NOT NULL,    
    outcome         STRING,                   
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    VECTOR INDEX idx_incident_embedding (crdb_region, tenant_id, embedding)
);

-- 5. Full audit trail of agent decisions
CREATE TABLE IF NOT EXISTS agent_actions (
    action_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id     UUID NOT NULL REFERENCES incidents(incident_id),
    action_type     STRING NOT NULL,   
    reasoning_trace STRING,            
    tool_call       JSONB,             
    result          JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Resumable agent state checkpoints
CREATE TABLE IF NOT EXISTS agent_checkpoints (
    checkpoint_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id     UUID NOT NULL REFERENCES incidents(incident_id),
    step            STRING NOT NULL,
    state           JSONB NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);