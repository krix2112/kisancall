-- Migration: user_roles table + Row Level Security policies for all tables
-- Run this in Supabase SQL Editor AFTER the init_schema migration

-- ============================================================
-- 1. user_roles table — maps Supabase Auth users to app roles
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('farmer', 'operator', 'supervisor', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by auth user id
CREATE INDEX IF NOT EXISTS idx_user_roles_auth_user_id ON user_roles(auth_user_id);

-- Unique index on price_cache for upsert support
CREATE UNIQUE INDEX IF NOT EXISTS idx_price_cache_mandi_commodity_date
    ON price_cache(mandi, commodity, date);

-- ============================================================
-- 2. Enable RLS on all tables
-- ============================================================
ALTER TABLE mandis ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. RLS Policies
-- ============================================================
-- Note: The service_role key bypasses ALL RLS automatically.
-- These policies apply when the anon/authenticated key is used
-- (e.g. from the mobile app directly).

-- Helper function: get the current user's role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM user_roles WHERE auth_user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: get the farmer_id linked to the current auth user
CREATE OR REPLACE FUNCTION public.get_my_farmer_id()
RETURNS UUID AS $$
  SELECT f.id FROM farmers f
  INNER JOIN user_roles ur ON ur.auth_user_id = auth.uid()
  WHERE f.phone = (SELECT phone FROM auth.users WHERE id = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- mandis: public read for all authenticated users ----
CREATE POLICY "mandis_read_authenticated" ON mandis
    FOR SELECT TO authenticated
    USING (true);

-- ---- farmers: farmers can read their own row, staff can read all ----
CREATE POLICY "farmers_read_own" ON farmers
    FOR SELECT TO authenticated
    USING (
        id = public.get_my_farmer_id()
        OR public.get_my_role() IN ('operator', 'supervisor', 'admin')
    );

CREATE POLICY "farmers_insert_self" ON farmers
    FOR INSERT TO authenticated
    WITH CHECK (true);  -- Registration is open; the backend validates

-- ---- slots: public read for all authenticated users ----
CREATE POLICY "slots_read_authenticated" ON slots
    FOR SELECT TO authenticated
    USING (true);

-- ---- bookings: farmers see their own, staff see all ----
CREATE POLICY "bookings_read" ON bookings
    FOR SELECT TO authenticated
    USING (
        farmer_id = public.get_my_farmer_id()
        OR public.get_my_role() IN ('operator', 'supervisor', 'admin')
    );

CREATE POLICY "bookings_insert" ON bookings
    FOR INSERT TO authenticated
    WITH CHECK (
        farmer_id = public.get_my_farmer_id()
        OR public.get_my_role() IN ('operator', 'supervisor', 'admin')
    );

CREATE POLICY "bookings_update" ON bookings
    FOR UPDATE TO authenticated
    USING (
        public.get_my_role() IN ('operator', 'supervisor', 'admin')
    );

-- ---- queue_events: farmers see their own bookings' events, staff see all ----
CREATE POLICY "queue_events_read" ON queue_events
    FOR SELECT TO authenticated
    USING (
        booking_id IN (SELECT id FROM bookings WHERE farmer_id = public.get_my_farmer_id())
        OR public.get_my_role() IN ('operator', 'supervisor', 'admin')
    );

CREATE POLICY "queue_events_insert" ON queue_events
    FOR INSERT TO authenticated
    WITH CHECK (
        public.get_my_role() IN ('operator', 'supervisor', 'admin')
    );

-- ---- procurements: farmers see their own, staff can manage ----
CREATE POLICY "procurements_read" ON procurements
    FOR SELECT TO authenticated
    USING (
        booking_id IN (SELECT id FROM bookings WHERE farmer_id = public.get_my_farmer_id())
        OR public.get_my_role() IN ('operator', 'supervisor', 'admin')
    );

CREATE POLICY "procurements_insert" ON procurements
    FOR INSERT TO authenticated
    WITH CHECK (
        public.get_my_role() IN ('operator', 'supervisor', 'admin')
    );

CREATE POLICY "procurements_update" ON procurements
    FOR UPDATE TO authenticated
    USING (
        public.get_my_role() IN ('operator', 'supervisor', 'admin')
    );

-- ---- payments: farmers see their own, supervisors/admins can manage ----
CREATE POLICY "payments_read" ON payments
    FOR SELECT TO authenticated
    USING (
        procurement_id IN (
            SELECT booking_id FROM procurements
            WHERE booking_id IN (SELECT id FROM bookings WHERE farmer_id = public.get_my_farmer_id())
        )
        OR public.get_my_role() IN ('supervisor', 'admin')
    );

CREATE POLICY "payments_update" ON payments
    FOR UPDATE TO authenticated
    USING (
        public.get_my_role() IN ('supervisor', 'admin')
    );

-- ---- price_cache: public read for all authenticated users ----
CREATE POLICY "price_cache_read" ON price_cache
    FOR SELECT TO authenticated
    USING (true);

-- ---- calls: farmers see their own, staff see all ----
CREATE POLICY "calls_read" ON calls
    FOR SELECT TO authenticated
    USING (
        farmer_id = public.get_my_farmer_id()
        OR public.get_my_role() IN ('operator', 'supervisor', 'admin')
    );

-- ---- proof_events: read-only for authenticated users ----
CREATE POLICY "proof_events_read" ON proof_events
    FOR SELECT TO authenticated
    USING (true);

-- ---- audit_logs: admin only ----
CREATE POLICY "audit_logs_read" ON audit_logs
    FOR SELECT TO authenticated
    USING (public.get_my_role() = 'admin');

-- ---- user_roles: users can read their own role, admins can manage ----
CREATE POLICY "user_roles_read_own" ON user_roles
    FOR SELECT TO authenticated
    USING (auth_user_id = auth.uid() OR public.get_my_role() = 'admin');

CREATE POLICY "user_roles_insert_admin" ON user_roles
    FOR INSERT TO authenticated
    WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "user_roles_update_admin" ON user_roles
    FOR UPDATE TO authenticated
    USING (public.get_my_role() = 'admin');
