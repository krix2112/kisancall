-- Migration: Async proof-events with idempotency, nullable chain_tx_hash, and retry state
-- Run this in Supabase SQL Editor AFTER the init_schema migration

-- ============================================================
-- 1. Add async-friendly columns to proof_events
-- ============================================================

-- chain_tx_hash is nullable: it won't exist yet when the row is first queued.
-- The background worker fills it in once the on-chain tx is mined.
ALTER TABLE proof_events DROP COLUMN IF EXISTS chain_tx_hash;
ALTER TABLE proof_events ADD COLUMN chain_tx_hash TEXT;  -- nullable

-- Status tracks the lifecycle: pending → confirmed | failed
ALTER TABLE proof_events ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'failed'));

-- Idempotency key prevents duplicate anchoring when the same procurement event
-- is retried (e.g. staff re-clicks "Mark Procured" or the worker crashes mid-submit).
ALTER TABLE proof_events ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE;

-- Error message from the last failed attempt (nullable)
ALTER TABLE proof_events ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Retry count — worker increments this on each failure, caps at MAX_RETRIES
ALTER TABLE proof_events ADD COLUMN IF NOT EXISTS retry_count INT NOT NULL DEFAULT 0;

-- ============================================================
-- 2. Index for the async worker polling query
-- ============================================================
-- The worker queries WHERE status = 'pending' ORDER BY created_at ASC LIMIT 1
-- A partial index makes this fast even at high row counts.
CREATE INDEX IF NOT EXISTS idx_proof_events_pending
    ON proof_events(created_at ASC)
    WHERE status = 'pending';

-- Index on idempotency_key for fast conflict/duplicate lookups
CREATE INDEX IF NOT EXISTS idx_proof_events_idempotency_key
    ON proof_events(idempotency_key);

-- ============================================================
-- 3. Grant permissions for the service role
-- ============================================================
-- proof_events INSERT/UPDATE/SELECT is handled by the service_role key
-- (which bypasses RLS). The worker runs with service_role, so no additional
-- RLS policy changes are needed beyond what init_schema already set.
