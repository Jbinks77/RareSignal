"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Zap, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/settings`,
      });

      if (error) {
        setError(error.message);
        return;
      }
      setSent(true);
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080E] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#08080E]" />
            </div>
            <span className="text-xl font-bold text-gold tracking-wider">RARESIGNAL</span>
          </Link>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Email envoyé !</h2>
              <p className="text-white/50 mb-6">
                Si un compte existe avec <span className="text-gold">{email}</span>, vous recevrez un lien de réinitialisation.
              </p>
              <Link href="/login" className="text-gold hover:text-gold-light transition-colors font-medium">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-2">Mot de passe oublié</h2>
              <p className="text-white/50 text-sm mb-6">Entrez votre email pour recevoir un lien de réinitialisation.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/25 transition-colors"
                    placeholder="trader@email.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-gold to-gold-dark text-[#08080E] font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#08080E]/30 border-t-[#08080E] rounded-full animate-spin mx-auto" />
                  ) : (
                    "Envoyer le lien"
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center mt-6">
          <Link href="/login" className="text-white/40 hover:text-white/60 text-sm inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
