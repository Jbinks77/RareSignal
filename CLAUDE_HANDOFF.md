# RareSignal — Handoff Claude Code

> Date : 15 mars 2026
> Projet : `C:\Users\botpo\Projects\raresignal\apps\web`
> Serveur dev : `http://localhost:3005` (via `start-dev.js`)

---

## ✅ Ce qui a été fait

### 1. Interface entièrement en français
- Tous les noms de cartes, sets, labels UI → français
- `src/lib/mock-data.ts` : 22 cartes avec noms FR, numéros FR corrects
- Numéros corrigés : Giratina VSTAR 201/196, Pikachu 173/165, etc.

### 2. Portfolio — structure de données
**Fichier :** `src/lib/portfolio-context.tsx`
- `CardLanguage` type : `"fr" | "en" | "jp" | "kr" | "de" | "es" | "pt" | "it"`
- `LANGUAGE_FLAGS` et `LANGUAGE_LABELS` : dictionnaires emoji + nom
- `PortfolioCard` : `{ apiId, name, number, set, setId, imageUrl, rarity, language, marketPriceAtAdd }`
- `PortfolioEntry` : `{ id, card, condition, addedAt, purchasePrice, quantity, livePrice?, livePriceUpdatedAt? }`
- `PortfolioProvider` (React Context) : state partagé entre tous les composants
- Storage key : `raresignal_portfolio_v2` (localStorage)
- Migration automatique des anciennes entrées → `language: "fr"` par défaut
- `updateLivePrice(entryId, price)` : met à jour le prix live + timestamp

### 3. Modal d'ajout de carte
**Fichier :** `src/components/add-card-modal.tsx`
- Recherche via `/api/tcg/search` (proxy Next.js → pokemontcg.io)
- Sélecteur de **langue** : 8 drapeaux (🇫🇷🇬🇧🇯🇵🇰🇷🇩🇪🇪🇸🇵🇹🇮🇹), défaut FR
- Sélecteur de condition : NM / EX / LP / PO
- Champ "Prix d'achat" (prix réel payé)
- Feedback : Bonne affaire / Prix du marché / Au-dessus du marché
- Sélecteur de quantité (+/-)
- Stocke `language` dans `PortfolioCard`

### 4. Page Portfolio
**Fichier :** `src/app/(dashboard)/portfolio/page.tsx`
- Stats : Total investi / Valeur estimée / Gain-Perte / Collection
- Tableau : Carte | Langue (drapeau) | État | Qté | Prix payé | Valeur actuelle | Gain/Perte
- Colonne Gain/Perte avec couleurs + pourcentage
- Total footer quand >1 carte
- Bouton **"Actualiser les prix"** avec spinner + "Il y a X min"
- Label "● Live Cardmarket" (prix API) vs "Estimé · Cardmarket" (prix calculé)

### 5. API Routes
**`src/app/api/tcg/search/route.ts`** — Proxy pokemontcg.io
- `GET /api/tcg/search?q=...` → proxy vers `https://api.pokemontcg.io/v2/cards`
- Cache 5 min (`next: { revalidate: 300 }`)

**`src/app/api/cardmarket/price/route.ts`** — Prix Cardmarket
- `GET /api/cardmarket/price?cardId=sv3pt5-173&condition=NM&language=fr`
- Appelle pokemontcg.io côté serveur pour récupérer les prix Cardmarket
- Utilise les vrais champs Cardmarket : `averageSellPrice`, `lowPriceExPlus`, `lowPrice`, `trendPrice`
- Applique multiplicateur de langue (fr×0.95, en×1.0, jp×0.75, kr×0.70…)
- Retourne `{ price, baseNMPrice, condition, language, currency: "EUR", source, cardmarketRaw }`

### 6. Logique de prix (dans la page portfolio)
Fonction `extractCardmarketPrice(cmPrices, condition, language)` :
- **NM** → `averageSellPrice` (prix moyen réel des ventes NM sur Cardmarket)
- **EX** → `(lowPriceExPlus + nmBase×0.80) / 2` (vrai champ Cardmarket EX+)
- **LP** → `lowPrice` si < 70% du NM, sinon `nmBase × 0.50`
- **PO** → `lowPrice × 0.50` ou `nmBase × 0.20`
- Puis × multiplicateur langue

### 7. Stratégie de fetch (3 niveaux)
Dans `fetchLivePrices()` sur la page portfolio :
1. **Appel direct navigateur → pokemontcg.io** (CORS autorisé, bypass restriction Node.js)
2. **Fallback proxy** → `/api/cardmarket/price` (fonctionne en production sur Vercel)
3. **Fallback local** → calcul depuis `marketPriceAtAdd` stocké + multiplicateurs

### 8. Fix Windows dev server
**`apps/web/start-dev.js`** : `spawn("npm run dev", { shell: true })` pour éviter EINVAL

### 9. Sidebar
**`src/components/sidebar.tsx`** : lien "Mon Portfolio" avec icône Briefcase

### 10. Dashboard page
**`src/app/(dashboard)/dashboard/page.tsx`** : widget portfolio mis à jour (investi / gain / nb cartes)

---

## 🔴 Problème actuel — DEBUG EN COURS

### Symptôme
Le bouton **"Actualiser les prix"** ne met pas à jour les prix.

### Cause racine identifiée
`pokemontcg.io` est **bloqué dans l'environnement de dev** (Node.js et browser dans le preview iframe) :
- Côté serveur Node.js → `ECONNRESET` / `504`
- Côté browser dans le preview (iframe sandboxé) → `TypeError: Failed to fetch`

### Fix implémenté (en attente de vérification)
La page tente maintenant l'appel **directement depuis le navigateur** (pas via le proxy serveur) :
```typescript
// Stratégie 1 : appel direct browser → pokemontcg.io
const res = await fetch(`https://api.pokemontcg.io/v2/cards/${cardId}`)
// Stratégie 2 : proxy serveur /api/cardmarket/price
// Stratégie 3 : calcul local depuis marketPriceAtAdd
```

### État au moment du handoff
- Le serveur venait de redémarrer après le fix TypeScript (composant `PortfolioPage` manquant avait été réinséré)
- Un test était en cours : une carte Pikachu (sv3pt5-173, marketPriceAtAdd: 18.50€) avait été injectée en localStorage via `preview_eval`
- La page a été rechargée (`location.reload()`) → screenshot échoué (target closed)
- **Le test n'a pas encore été effectué**

### Ce qu'il faut vérifier maintenant
1. Ouvrir `http://localhost:3005/portfolio` dans Chrome (pas le preview iframe)
2. Vérifier que la carte Pikachu est bien dans le portfolio (ou la rajouter via le modal)
3. Cliquer "Actualiser les prix"
4. Inspecter l'onglet Network dans DevTools Chrome :
   - Est-ce que `GET https://api.pokemontcg.io/v2/cards/sv3pt5-173` apparaît ?
   - Si oui : status 200 → les prix devraient se mettre à jour ✅
   - Si non / erreur CORS : voir section suivante

### Si pokemontcg.io est bloqué même dans Chrome
→ Le vrai problème est un pare-feu/proxy réseau local, pas l'environnement Claude.
→ Solution de secours à implémenter : injecter une clé API pokemontcg.io dans `.env.local` :
```env
POKEMONTCG_API_KEY=votre_clé_ici
```
Puis reconstruire le proxy serveur `/api/cardmarket/price` avec une approche différente (ex: tunnel ngrok, ou déployer sur Vercel où le réseau n'est pas restreint).

---

## 📋 Ce qu'il reste à faire (backlog)

### Court terme
- [ ] **Vérifier** que les prix live fonctionnent dans Chrome (test manuel)
- [ ] **Recherche dans le modal** : le `preview_fill` ne déclenche pas `onChange` React → à tester manuellement dans Chrome
- [ ] **Base locale de cartes** (`src/lib/cards-database.ts`) : fichier en cours d'écriture, fallback pour recherche quand API bloquée, à compléter et connecter au modal
- [ ] Réactiver la **protection auth middleware** (`src/lib/supabase/middleware.ts` était commenté pour les tests)

### Moyen terme
- [ ] **Historique des prix** : stocker l'historique des prix actualisés (tableau `priceHistory[]` dans PortfolioEntry) pour voir l'évolution dans le temps
- [ ] **Graphique sparkline** par carte dans le portfolio (`src/components/sparkline.tsx` existe déjà)
- [ ] **Alerte de prix** : notifier quand une carte dépasse un seuil
- [ ] **Export CSV** du portfolio

### Long terme / production
- [ ] **Cardmarket API officielle** (OAuth 1.0) pour des prix 100% précis par langue et condition
- [ ] **eBay API** pour prix de ventes réelles (déjà discuté, en attente vérification API)
- [ ] **Déploiement Vercel** (pokemontcg.io fonctionnera côté serveur en production)
- [ ] **Stripe** : créer les produits dans le dashboard
- [ ] **Scraper Vinted/Cardmarket** en temps réel

---

## 📁 Fichiers clés

```
apps/web/src/
├── lib/
│   ├── portfolio-context.tsx     ← Context React + types + storage
│   ├── mock-data.ts              ← 22 cartes FR + CONDITION_MULTIPLIERS
│   └── cards-database.ts        ← Base locale 200+ cartes (WIP)
├── components/
│   ├── add-card-modal.tsx        ← Modal ajout avec langue + prix
│   └── sidebar.tsx               ← Nav avec Mon Portfolio
└── app/
    ├── api/
    │   ├── tcg/search/route.ts   ← Proxy pokemontcg.io recherche
    │   └── cardmarket/price/route.ts ← Prix Cardmarket par condition/langue
    └── (dashboard)/
        ├── layout.tsx            ← Wrappé dans <PortfolioProvider>
        ├── dashboard/page.tsx    ← Widget portfolio mis à jour
        └── portfolio/page.tsx    ← Page principale portfolio
```

---

## 🔧 Commandes utiles

```bash
# Démarrer le serveur de dev (depuis apps/web/)
node start-dev.js

# Vérifier TypeScript
npx tsc --noEmit

# Tuer le port 3005 si occupé (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3005).OwningProcess -Force
```

---

## 💡 Note importante sur l'architecture des prix

Les prix Cardmarket dans pokemontcg.io sont **agrégés toutes langues confondues**.
Pour des prix par langue précis, il faudrait l'API officielle Cardmarket (OAuth).
Les multiplicateurs de langue actuels sont des approximations de marché :

| Langue | Multiplicateur | Justification |
|--------|---------------|---------------|
| 🇫🇷 FR | ×0.95 | Légèrement sous la moyenne internationale |
| 🇬🇧 EN | ×1.00 | Référence (marché dominant sur Cardmarket EU) |
| 🇩🇪 DE | ×0.98 | Très proche EN |
| 🇪🇸 ES | ×0.92 | Demande légèrement inférieure |
| 🇮🇹 IT | ×0.90 | Idem |
| 🇵🇹 PT | ×0.88 | Marché plus petit |
| 🇯🇵 JP | ×0.75 | Cartes JP moins chères sur Cardmarket EU |
| 🇰🇷 KR | ×0.70 | Marché coréen peu représenté en EU |
