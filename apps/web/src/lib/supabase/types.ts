// ============================================================
// RareSignal — Supabase Database Types
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          plan: "free" | "pro" | "expert";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "pro" | "expert";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          plan?: "free" | "pro" | "expert";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          updated_at?: string;
        };
      };
      tracked_cards: {
        Row: {
          id: string;
          user_id: string;
          card_name: string;
          set_name: string;
          set_code: string;
          rarity: string;
          condition: string;
          image_url: string | null;
          price_cardmarket: number | null;
          price_ebay: number | null;
          price_vinted: number | null;
          variation_7d: number;
          variation_30d: number;
          score: number;
          volume: number;
          last_scraped_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_name: string;
          set_name: string;
          set_code: string;
          rarity: string;
          condition?: string;
          image_url?: string | null;
          price_cardmarket?: number | null;
          price_ebay?: number | null;
          price_vinted?: number | null;
          variation_7d?: number;
          variation_30d?: number;
          score?: number;
          volume?: number;
          last_scraped_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          card_name?: string;
          set_name?: string;
          set_code?: string;
          rarity?: string;
          condition?: string;
          image_url?: string | null;
          price_cardmarket?: number | null;
          price_ebay?: number | null;
          price_vinted?: number | null;
          variation_7d?: number;
          variation_30d?: number;
          score?: number;
          volume?: number;
          last_scraped_at?: string | null;
          updated_at?: string;
        };
      };
      price_history: {
        Row: {
          id: string;
          card_id: string;
          date: string;
          price_cardmarket: number | null;
          price_ebay: number | null;
          price_vinted: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          card_id: string;
          date: string;
          price_cardmarket?: number | null;
          price_ebay?: number | null;
          price_vinted?: number | null;
          created_at?: string;
        };
        Update: {
          price_cardmarket?: number | null;
          price_ebay?: number | null;
          price_vinted?: number | null;
        };
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          card_name: string;
          type: "price_drop" | "price_spike" | "new_listing" | "arbitrage";
          condition_text: string;
          threshold: number;
          active: boolean;
          triggered_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_name: string;
          type: "price_drop" | "price_spike" | "new_listing" | "arbitrage";
          condition_text: string;
          threshold: number;
          active?: boolean;
          triggered_at?: string | null;
          created_at?: string;
        };
        Update: {
          card_name?: string;
          type?: "price_drop" | "price_spike" | "new_listing" | "arbitrage";
          condition_text?: string;
          threshold?: number;
          active?: boolean;
          triggered_at?: string | null;
        };
      };
      preorders: {
        Row: {
          id: string;
          name: string;
          price: number;
          source: string;
          image_url: string | null;
          detected_at: string;
          release_date: string;
          stock_estimate: string;
          is_new: boolean;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          source: string;
          image_url?: string | null;
          detected_at?: string;
          release_date: string;
          stock_estimate?: string;
          is_new?: boolean;
          url: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          price?: number;
          source?: string;
          image_url?: string | null;
          release_date?: string;
          stock_estimate?: string;
          is_new?: boolean;
          url?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: "alert" | "preorder" | "system";
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: "alert" | "preorder" | "system";
          read?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          message?: string;
          read?: boolean;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      plan_type: "free" | "pro" | "expert";
      alert_type: "price_drop" | "price_spike" | "new_listing" | "arbitrage";
    };
  };
}

// Helper types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type TrackedCard = Database["public"]["Tables"]["tracked_cards"]["Row"];
export type PriceHistory = Database["public"]["Tables"]["price_history"]["Row"];
export type AlertRow = Database["public"]["Tables"]["alerts"]["Row"];
export type PreorderRow = Database["public"]["Tables"]["preorders"]["Row"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
