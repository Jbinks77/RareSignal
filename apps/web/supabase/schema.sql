-- =============================================================================
-- RareSignal Database Schema (idempotent — safe to re-run)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Custom enum types
-- ---------------------------------------------------------------------------
DO $$ BEGIN CREATE TYPE plan_tier AS ENUM ('free', 'pro', 'expert'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE card_condition AS ENUM ('NM', 'EX', 'LP', 'PO'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE price_platform AS ENUM ('cardmarket', 'ebay', 'vinted'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE alert_type AS ENUM ('price_drop', 'price_spike', 'new_listing', 'arbitrage'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid', 'paused'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email         text,
  full_name     text,
  avatar_url    text,
  plan          plan_tier NOT NULL DEFAULT 'free',
  stripe_customer_id text UNIQUE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles (stripe_customer_id);

-- ---------------------------------------------------------------------------
-- tracked_cards
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tracked_cards (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  name        text,
  card_number text NOT NULL,          -- e.g. "215/247"
  set_name    text,
  set_code    text,
  rarity      text,
  condition   card_condition NOT NULL DEFAULT 'NM',
  image_url   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tracked_cards_user_id ON tracked_cards (user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_cards_set_code ON tracked_cards (set_code);
CREATE INDEX IF NOT EXISTS idx_tracked_cards_card_number ON tracked_cards (card_number);
CREATE INDEX IF NOT EXISTS idx_tracked_cards_condition ON tracked_cards (condition);

-- ---------------------------------------------------------------------------
-- card_prices
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS card_prices (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id     uuid NOT NULL REFERENCES tracked_cards (id) ON DELETE CASCADE,
  platform    price_platform NOT NULL,
  price       decimal NOT NULL,
  condition   card_condition,
  scraped_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_card_prices_card_id ON card_prices (card_id);
CREATE INDEX IF NOT EXISTS idx_card_prices_platform ON card_prices (platform);
CREATE INDEX IF NOT EXISTS idx_card_prices_scraped_at ON card_prices (scraped_at DESC);

-- ---------------------------------------------------------------------------
-- alerts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alerts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  card_id         uuid REFERENCES tracked_cards (id) ON DELETE CASCADE,
  card_name       text,
  card_number     text,
  type            alert_type NOT NULL,
  condition_text  text,
  threshold       decimal,
  active          boolean NOT NULL DEFAULT true,
  triggered_at    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts (user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_card_id ON alerts (card_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts (active) WHERE active = true;

-- ---------------------------------------------------------------------------
-- preorders
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS preorders (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  price           decimal,
  source          text,
  image_url       text,
  detected_at     timestamptz NOT NULL DEFAULT now(),
  release_date    date,
  stock_estimate  text,
  url             text
);

CREATE INDEX IF NOT EXISTS idx_preorders_release_date ON preorders (release_date);
CREATE INDEX IF NOT EXISTS idx_preorders_detected_at ON preorders (detected_at DESC);

-- ---------------------------------------------------------------------------
-- subscriptions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  stripe_subscription_id  text UNIQUE NOT NULL,
  stripe_price_id         text,
  status                  subscription_status NOT NULL,
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions (stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions (status);

-- ===========================================================================
-- Row Level Security
-- ===========================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE preorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ---- profiles ----
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ---- tracked_cards ----
DROP POLICY IF EXISTS "Users can read their own tracked cards" ON tracked_cards;
CREATE POLICY "Users can read their own tracked cards"
  ON tracked_cards FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tracked cards" ON tracked_cards;
CREATE POLICY "Users can insert their own tracked cards"
  ON tracked_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tracked cards" ON tracked_cards;
CREATE POLICY "Users can update their own tracked cards"
  ON tracked_cards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tracked cards" ON tracked_cards;
CREATE POLICY "Users can delete their own tracked cards"
  ON tracked_cards FOR DELETE
  USING (auth.uid() = user_id);

-- ---- card_prices ----
DROP POLICY IF EXISTS "Users can read prices for their tracked cards" ON card_prices;
CREATE POLICY "Users can read prices for their tracked cards"
  ON card_prices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tracked_cards
      WHERE tracked_cards.id = card_prices.card_id
        AND tracked_cards.user_id = auth.uid()
    )
  );

-- ---- alerts ----
DROP POLICY IF EXISTS "Users can read their own alerts" ON alerts;
CREATE POLICY "Users can read their own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own alerts" ON alerts;
CREATE POLICY "Users can insert their own alerts"
  ON alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own alerts" ON alerts;
CREATE POLICY "Users can update their own alerts"
  ON alerts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own alerts" ON alerts;
CREATE POLICY "Users can delete their own alerts"
  ON alerts FOR DELETE
  USING (auth.uid() = user_id);

-- ---- preorders ----
DROP POLICY IF EXISTS "Authenticated users can read preorders" ON preorders;
CREATE POLICY "Authenticated users can read preorders"
  ON preorders FOR SELECT
  USING (auth.role() = 'authenticated');

-- ---- subscriptions ----
DROP POLICY IF EXISTS "Users can read their own subscriptions" ON subscriptions;
CREATE POLICY "Users can read their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ===========================================================================
-- Triggers
-- ===========================================================================

-- Auto-update the updated_at column on profiles
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profiles_updated ON profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Auto-create a profile row when a new user signs up via auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
