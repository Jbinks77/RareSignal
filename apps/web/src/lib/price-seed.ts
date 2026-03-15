// Prix Cardmarket locaux (NM, toutes langues confondues)
// Utilisés comme fallback quand pokemontcg.io est inaccessible
// Clés = ID pokemontcg.io (dérivé de l'URL d'image : swsh35/74 → swsh35-74)
// Valeurs = averageSellPrice NM en EUR (source : Cardmarket mars 2026)

export const LOCAL_PRICE_CACHE: Record<string, number> = {
  "swsh35-74":   285.00, // Dracaufeu VMAX 074/073 · Destinées de Champion
  "swsh4-188":   195.00, // Pikachu VMAX 188/185 · Voltage Éclatant
  "swsh8-268":   142.50, // Mew VMAX 268/264 · Poing de Fusion
  "swsh7-217":   320.00, // Rayquaza VMAX 217/225 · Évolution Céleste
  "swsh7-214":   410.00, // Noctali VMAX 214/225 · Évolution Céleste
  "swsh11-201":   55.00, // Giratina VSTAR 201/196 · Origine Perdue
  "swsh12-211":   88.00, // Lugia VSTAR 211/195 · Tempête Argentée
  "sma-SV59":     72.00, // Mewtwo GX SV59/SV94 · Destinées Occultes
  "swsh8-270":   165.00, // Mentali VMAX 270/264 · Poing de Fusion
  "sv3-228":     125.00, // Dracaufeu ex 228/197 · Flammes Obsidiennes
  "sv2-232":      38.00, // Wo-Chien ex 232/193 · Évolutions à Paldea
  "sv1-253":      52.00, // Miraidon ex 253/198 · Écarlate et Violet
  "sv1-254":      45.00, // Koraidon ex 254/198 · Écarlate et Violet
  "swsh8-271":    28.00, // Ectoplasma VMAX 271/264 · Poing de Fusion
  "swsh9-184":    18.50, // Arceus VSTAR 184/172 · Stars Étincelantes
  "swsh10-208":   95.00, // Palkia VSTAR 208/189 · Astres Radieux
  "sv3-209":       8.50, // Gourmelet 209/197 · Flammes Obsidiennes
  "swsh10-198":   22.00, // Dialga VSTAR 198/189 · Astres Radieux
  "sv3pt5-173":   12.00, // Pikachu 173/165 · EV3.5 — 151
  "sv3pt5-199":   68.00, // Dracaufeu ex 199/165 · EV3.5 — 151
  "sv3pt5-205":   95.00, // Mew ex 205/165 · EV3.5 — 151
  "sv3pt5-201":   42.00, // Alakazam ex 201/165 · EV3.5 — 151
};
