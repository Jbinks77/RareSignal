-- ============================================================
-- RareSignal — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- ENUMS
-- =====================
CREATE TYPE plan_type AS ENUM ('free', 'pro', 'expert');
CREATE TYPE alert_type AS ENUM ('price_drop', 'price_spike', 'new_listing', 'arbitrage');
CREATE TYPE notification_type AS ENUM ('alert', 'preorder', 'system');

-- =====================
-- PROFILES
-- =====================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  plan plan_type DEFAULT 'free' NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- TRACKED CARDS
-- =====================
CREATE TABLE tracked_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  card_name TEXT NOT NULL,
  set_name TEXT NOT NULL,
  set_code TEXT NOT NULL,
  rarity TEXT NOT NULL,
  condition TEXT DEFAULT 'NM',
  image_url TEXT,
  price_cardmarket DECIMAL(10,2),
  price_ebay DECIMAL(10,2),
  price_vinted DECIMAL(10,2),
  variation_7d DECIMAL(5,2) DEFAULT 0,
  variation_30d DECIMAL(5,2) DEFAULT 0,
  score INTEGER DEFAULT 0,
  volume INTEGER DEFAULT 0,
  last_scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(user_id, card_name, set_code, condition)
);

CREATE INDEX idx_tracked_cards_user ON tracked_cards(user_id);
CREATE INDEX idx_tracked_cards_score ON tracked_cards(score DESC);

-- =====================
-- PRICE HISTORY
-- =====================
CREATE TABLE price_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES tracked_cards(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  price_cardmarket DECIMAL(10,2),
  price_ebay DECIMAL(10,2),
  price_vinted DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(card_id, date)
);

CREATE INDEX idx_price_history_card_date ON price_history(card_id, date DESC);

-- =====================
-- ALERTS
-- =====================
CREATE TABLE alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  card_name TEXT NOT NULL,
  type alert_type NOT NULL,
  condition_text TEXT NOT NULL,
  threshold DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_active ON alerts(user_id, active) WHERE active = TRUE;

-- =====================
-- PREORDERS
-- =====================
CREATE TABLE preorders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  source TEXT NOT NULL,
  image_url TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  release_date DATE NOT NULL,
  stock_estimate TEXT DEFAULT 'En stock',
  is_new BOOLEAN DEFAULT TRUE,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_preorders_detected ON preorders(detected_at DESC);

-- =====================
-- NOTIFICATIONS
-- =====================
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type DEFAULT 'system',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = FALSE;

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE preorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Tracked cards: users CRUD their own cards
CREATE POLICY "Users can view own cards" ON tracked_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cards" ON tracked_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards" ON tracked_cards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cards" ON tracked_cards FOR DELETE USING (auth.uid() = user_id);

-- Price history: readable by card owner
CREATE POLICY "Users can view own card prices" ON price_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM tracked_cards WHERE tracked_cards.id = price_history.card_id AND tracked_cards.user_id = auth.uid()));

-- Alerts: users CRUD their own alerts
CREATE POLICY "Users can view own alerts" ON alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alerts" ON alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON alerts FOR DELETE USING (auth.uid() = user_id);

-- Preorders: readable by all authenticated users
CREATE POLICY "Authenticated users can view preorders" ON preorders FOR SELECT USING (auth.role() = 'authenticated');

-- Notifications: users CRUD their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- =====================
-- UPDATED_AT TRIGGER
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_tracked_cards_updated_at BEFORE UPDATE ON tracked_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at();
