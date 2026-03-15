"use client";

import { Bell, Search, User } from "lucide-react";
import { useState } from "react";
import { mockNotifications } from "@/lib/mock-data";

export function Header() {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#08080E]/80 backdrop-blur-md sticky top-0 z-40">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Rechercher une carte, un set..."
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-colors"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Bell className="w-5 h-5 text-white/60" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-[10px] font-bold text-[#08080E] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 top-12 w-80 bg-[#12121A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-sm font-semibold">Notifications</span>
                  <span className="text-xs text-gold">{unreadCount} non lues</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                        !notif.read ? "bg-gold/5" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            notif.type === "alert"
                              ? "bg-gold"
                              : notif.type === "preorder"
                              ? "bg-violet"
                              : "bg-white/30"
                          }`}
                        />
                        <div>
                          <p className="text-xs font-medium text-white/90">{notif.title}</p>
                          <p className="text-xs text-white/50 mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-white/30 mt-1">
                            {new Date(notif.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-gold flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white/90">Trader</p>
            <p className="text-[10px] text-white/40">Plan Free</p>
          </div>
        </div>
      </div>
    </header>
  );
}
