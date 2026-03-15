"use client";

import { useState, useEffect, useCallback } from "react";
import type { CardCondition } from "./mock-data";

export interface PortfolioEntry {
  id: string;           // UUID local
  cardId: string;       // Référence à mockCards
  condition: CardCondition;
  addedAt: string;      // ISO date
  addedPrice: number;   // Prix Cardmarket au moment de l'ajout
  notes?: string;
}

const STORAGE_KEY = "raresignal_portfolio";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function usePortfolio() {
  const [entries, setEntries] = useState<PortfolioEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Charger depuis localStorage au montage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PortfolioEntry[];
        setEntries(parsed);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Persister à chaque changement
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, loaded]);

  const addCard = useCallback((cardId: string, condition: CardCondition, addedPrice: number) => {
    const entry: PortfolioEntry = {
      id: generateId(),
      cardId,
      condition,
      addedAt: new Date().toISOString(),
      addedPrice,
    };
    setEntries((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const removeCard = useCallback((entryId: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  }, []);

  const updateCondition = useCallback((entryId: string, condition: CardCondition) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, condition } : e))
    );
  }, []);

  const isTracked = useCallback(
    (cardId: string) => entries.some((e) => e.cardId === cardId),
    [entries]
  );

  return {
    entries,
    loaded,
    addCard,
    removeCard,
    updateCondition,
    isTracked,
    count: entries.length,
  };
}
