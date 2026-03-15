"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Bell,
  ShoppingCart,
  Settings,
  TrendingUp,
  Crown,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "Mon Portfolio", icon: Briefcase },
  { href: "/cards", label: "Analyse prix", icon: CreditCard },
  { href: "/alerts", label: "Alertes", icon: Bell },
  { href: "/preorders", label: "Précommandes", icon: ShoppingCart },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#0C0C14] border-r border-white/5 flex flex-col z-50 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-4 h-4 text-[#08080E]" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gold tracking-wide">RARESIGNAL</span>
            <span className="text-[10px] text-white/40 tracking-widest">MARKET INTELLIGENCE</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                isActive
                  ? "bg-gold/10 text-gold"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive ? "text-gold" : "text-white/40 group-hover:text-white/60"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-lg bg-gradient-to-br from-violet/10 to-gold/10 border border-violet/20">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-gold" />
            <span className="text-xs font-semibold text-gold">Plan Free</span>
          </div>
          <p className="text-[11px] text-white/50 mb-2">
            Passez Pro pour des alertes illimitées
          </p>
          <Link
            href="/pricing"
            className="block text-center text-xs font-medium py-1.5 rounded-md bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
          >
            Voir les plans
          </Link>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-white/5 text-white/30 hover:text-white/60 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
