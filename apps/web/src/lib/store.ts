// ============================================================
// RareSignal — Global State (Zustand)
// ============================================================
import { create } from "zustand";
import type { PokemonCard, Alert, Preorder, Notification } from "./mock-data";

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  plan: "free" | "pro" | "expert";
}

interface AppState {
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;

  // Cards
  cards: PokemonCard[];
  cardsLoading: boolean;
  setCards: (cards: PokemonCard[]) => void;
  setCardsLoading: (loading: boolean) => void;

  // Alerts
  alerts: Alert[];
  alertsLoading: boolean;
  setAlerts: (alerts: Alert[]) => void;
  toggleAlert: (id: string) => void;

  // Preorders
  preorders: Preorder[];
  preordersLoading: boolean;
  setPreorders: (preorders: Preorder[]) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;

  // UI
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // Cards
  cards: [],
  cardsLoading: false,
  setCards: (cards) => set({ cards }),
  setCardsLoading: (cardsLoading) => set({ cardsLoading }),

  // Alerts
  alerts: [],
  alertsLoading: false,
  setAlerts: (alerts) => set({ alerts }),
  toggleAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    })),

  // Preorders
  preorders: [],
  preordersLoading: false,
  setPreorders: (preorders) => set({ preorders }),

  // Notifications
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  // UI
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
