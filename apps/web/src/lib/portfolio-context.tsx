"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { CardCondition } from "./mock-data";

export type CardLanguage = "fr" | "en" | "jp" | "kr" | "de" | "es" | "pt" | "it";

export const LANGUAGE_LABELS: Record<CardLanguage, string> = {
  fr: "Français",
  en: "Anglais",
  jp: "Japonais",
  kr: "Coréen",
  de: "Allemand",
  es: "Espagnol",
  pt: "Portugais",
  it: "Italien",
};

export const LANGUAGE_FLAGS: Record<CardLanguage, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  jp: "🇯🇵",
  kr: "🇰🇷",
  de: "🇩🇪",
  es: "🇪🇸",
  pt: "🇵🇹",
  it: "🇮🇹",
};

// Cardmarket language IDs
export const CARDMARKET_LANG_IDS: Record<CardLanguage, number> = {
  en: 1, fr: 2, de: 3, es: 4, it: 5, pt: 8, jp: 7, kr: 10,
};

// Données de la carte stockées localement (depuis pokemontcg.io API)
export interface PortfolioCard {
  apiId: string;       // ex: "sv3pt5-173"
  name: string;        // ex: "Pikachu"
  number: string;      // ex: "173/165"
  set: string;         // ex: "Scarlet & Violet 151"
  setId: string;       // ex: "sv3pt5"
  imageUrl: string;    // URL image pokemontcg.io
  rarity?: string;
  language: CardLanguage;  // langue de la carte physique
  // Prix de marché au moment de l'ajout (depuis l'API pokemontcg.io si dispo)
  marketPriceAtAdd?: number;
}

export interface PortfolioEntry {
  id: string;               // UUID local
  card: PortfolioCard;
  condition: CardCondition;
  addedAt: string;          // ISO date
  purchasePrice: number;    // Prix RÉEL payé par l'utilisateur
  quantity: number;         // Nombre d'exemplaires
  notes?: string;
  // Prix Cardmarket mis à jour (optionnel, mis en cache)
  livePrice?: number;
  livePriceUpdatedAt?: string;
}

interface PortfolioContextValue {
  entries: PortfolioEntry[];
  loaded: boolean;
  count: number;
  addCard: (
    card: PortfolioCard,
    condition: CardCondition,
    purchasePrice: number,
    quantity?: number
  ) => PortfolioEntry;
  removeCard: (entryId: string) => void;
  updateCondition: (entryId: string, condition: CardCondition) => void;
  updateQuantity: (entryId: string, quantity: number) => void;
  updateLivePrice: (entryId: string, price: number) => void;
  isTracked: (apiId: string) => boolean;
}

const STORAGE_KEY = "raresignal_portfolio_v2";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: PortfolioEntry[] = JSON.parse(raw);
        // Migration: ajouter language "fr" par défaut aux anciennes entrées
        const migrated = parsed.map((e) => ({
          ...e,
          card: { ...e.card, language: e.card.language ?? "fr" },
        }));
        setEntries(migrated);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, loaded]);

  const addCard = useCallback(
    (card: PortfolioCard, condition: CardCondition, purchasePrice: number, quantity = 1) => {
      const entry: PortfolioEntry = {
        id: generateId(),
        card,
        condition,
        addedAt: new Date().toISOString(),
        purchasePrice,
        quantity,
      };
      setEntries((prev) => [entry, ...prev]);
      return entry;
    },
    []
  );

  const removeCard = useCallback((entryId: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  }, []);

  const updateCondition = useCallback((entryId: string, condition: CardCondition) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, condition, livePrice: undefined } : e))
    );
  }, []);

  const updateQuantity = useCallback((entryId: string, quantity: number) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, quantity: Math.max(1, quantity) } : e))
    );
  }, []);

  const updateLivePrice = useCallback((entryId: string, price: number) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId
          ? { ...e, livePrice: price, livePriceUpdatedAt: new Date().toISOString() }
          : e
      )
    );
  }, []);

  const isTracked = useCallback(
    (apiId: string) => entries.some((e) => e.card.apiId === apiId),
    [entries]
  );

  return (
    <PortfolioContext.Provider
      value={{ entries, loaded, count: entries.length, addCard, removeCard, updateCondition, updateQuantity, updateLivePrice, isTracked }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used inside <PortfolioProvider>");
  return ctx;
}
