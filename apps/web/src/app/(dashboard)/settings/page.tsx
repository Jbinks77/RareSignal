"use client";

import { User, Bell, Key, CreditCard, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-sm text-white/40 mt-1">Gérez votre compte et vos préférences</p>
      </div>

      {/* Profile */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-gold" />
          <h2 className="text-sm font-semibold">Profil</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet to-gold flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <button className="text-xs text-gold hover:text-gold-light transition-colors border border-gold/20 px-3 py-1.5 rounded-lg">
              Changer l&apos;avatar
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Nom</label>
              <input
                type="text"
                defaultValue="Trader"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Email</label>
              <input
                type="email"
                defaultValue="trader@example.com"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-gold" />
          <h2 className="text-sm font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: "Alertes de prix par email", desc: "Recevez un email quand une alerte est déclenchée", checked: true },
            { label: "Notifications in-app", desc: "Notifications en temps réel dans le dashboard", checked: true },
            { label: "Résumé quotidien", desc: "Un email récapitulatif chaque matin à 8h", checked: false },
            { label: "Nouvelles précommandes", desc: "Alerté dès qu'un nouveau produit est détecté", checked: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm">{item.label}</p>
                <p className="text-xs text-white/40">{item.desc}</p>
              </div>
              <button
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  item.checked ? "bg-gold" : "bg-white/10"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    item.checked ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-gold" />
          <h2 className="text-sm font-semibold">Abonnement</h2>
        </div>
        <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-lg border border-white/5">
          <div>
            <p className="text-sm font-medium">Plan Free</p>
            <p className="text-xs text-white/40">3 alertes max, données limitées</p>
          </div>
          <a
            href="/pricing"
            className="px-4 py-2 bg-gold/10 text-gold text-sm font-medium rounded-lg hover:bg-gold/20 transition-colors"
          >
            Upgrade
          </a>
        </div>
      </div>

      {/* API Keys placeholder */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-5 h-5 text-gold" />
          <h2 className="text-sm font-semibold">Clés API</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet/10 text-violet">Expert</span>
        </div>
        <div className="text-center py-6">
          <Shield className="w-8 h-8 text-white/10 mx-auto mb-2" />
          <p className="text-xs text-white/30">
            Disponible avec le plan Expert
          </p>
        </div>
      </div>

      <button className="flex items-center gap-2 px-6 py-2.5 bg-gold text-[#08080E] font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm">
        <Save className="w-4 h-4" />
        Sauvegarder
      </button>
    </div>
  );
}
