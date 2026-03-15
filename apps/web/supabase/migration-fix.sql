-- =============================================================================
-- RareSignal — Migration fix: drop existing tables and recreate cleanly
-- Run this FIRST, then run schema.sql
-- =============================================================================

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS card_prices CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS tracked_cards CASCADE;
DROP TABLE IF EXISTS preorders CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profiles_updated ON profiles;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS handle_updated_at();

-- Drop enums
DROP TYPE IF EXISTS plan_tier CASCADE;
DROP TYPE IF EXISTS card_condition CASCADE;
DROP TYPE IF EXISTS price_platform CASCADE;
DROP TYPE IF EXISTS alert_type CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
