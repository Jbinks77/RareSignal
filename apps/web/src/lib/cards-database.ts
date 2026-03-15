// ============================================================
// RareSignal — Base de données locale des cartes Pokémon
// Couvre toutes les ères : Base Set (1999) → Scarlet & Violet (2024)
// Images via pokemontcg.io · Fallback quand l'API est indisponible
// ============================================================

export interface TcgCardLocal {
  id: string;
  name: string;
  number: string;
  rarity: string;
  set: { id: string; name: string; series: string };
  images: { small: string; large: string };
  cardmarket?: { prices?: { averageSellPrice?: number } };
}

function img(setId: string, num: string) {
  return {
    small: `https://images.pokemontcg.io/${setId}/${num}.png`,
    large: `https://images.pokemontcg.io/${setId}/${num}_hires.png`,
  };
}
function card(name: string, number: string, rarity: string, setId: string, setName: string, series: string, price?: number): TcgCardLocal {
  const id = `${setId}-${number}`;
  return { id, name, number, rarity, set: { id: setId, name: setName, series }, images: img(setId, number), ...(price ? { cardmarket: { prices: { averageSellPrice: price } } } : {}) };
}

export const localCardsDatabase: TcgCardLocal[] = [

  // ============================
  // BASE SET — 1999
  // ============================
  card("Charizard",   "4",   "Holo Rare",     "base1", "Base Set",  "Base", 350),
  card("Blastoise",   "2",   "Holo Rare",     "base1", "Base Set",  "Base", 90),
  card("Venusaur",    "15",  "Holo Rare",     "base1", "Base Set",  "Base", 75),
  card("Pikachu",     "58",  "Common",        "base1", "Base Set",  "Base", 45),
  card("Mewtwo",      "10",  "Holo Rare",     "base1", "Base Set",  "Base", 65),
  card("Zapdos",      "16",  "Holo Rare",     "base1", "Base Set",  "Base", 40),
  card("Gyarados",    "6",   "Holo Rare",     "base1", "Base Set",  "Base", 35),
  card("Magneton",    "9",   "Holo Rare",     "base1", "Base Set",  "Base", 25),

  // ============================
  // JUNGLE — 1999
  // ============================
  card("Clefable",    "1",   "Holo Rare",     "jungle", "Jungle", "Base", 20),
  card("Electrode",   "2",   "Holo Rare",     "jungle", "Jungle", "Base", 18),
  card("Flareon",     "5",   "Holo Rare",     "jungle", "Jungle", "Base", 22),
  card("Jolteon",     "7",   "Holo Rare",     "jungle", "Jungle", "Base", 22),
  card("Kangaskhan",  "8",   "Holo Rare",     "jungle", "Jungle", "Base", 15),
  card("Vaporeon",    "12",  "Holo Rare",     "jungle", "Jungle", "Base", 28),
  card("Fearow",      "3",   "Holo Rare",     "jungle", "Jungle", "Base", 15),
  card("Gengar",      "6",   "Holo Rare",     "jungle", "Jungle", "Base", 35),

  // ============================
  // FOSSIL — 1999
  // ============================
  card("Aerodactyl",  "1",   "Holo Rare",     "fossil", "Fossil", "Base", 25),
  card("Ditto",       "3",   "Holo Rare",     "fossil", "Fossil", "Base", 30),
  card("Gengar",      "5",   "Holo Rare",     "fossil", "Fossil", "Base", 40),
  card("Haunter",     "8",   "Holo Rare",     "fossil", "Fossil", "Base", 15),
  card("Lapras",      "10",  "Holo Rare",     "fossil", "Fossil", "Base", 28),
  card("Moltres",     "12",  "Holo Rare",     "fossil", "Fossil", "Base", 30),
  card("Zapdos",      "15",  "Holo Rare",     "fossil", "Fossil", "Base", 30),
  card("Articuno",    "14",  "Holo Rare",     "fossil", "Fossil", "Base", 30),

  // ============================
  // NEO GENESIS — 2000
  // ============================
  card("Lugia",       "9",   "Holo Rare",     "neo1", "Neo Genesis", "Neo", 120),
  card("Feraligatr",  "4",   "Holo Rare",     "neo1", "Neo Genesis", "Neo", 30),
  card("Meganium",    "8",   "Holo Rare",     "neo1", "Neo Genesis", "Neo", 22),
  card("Typhlosion",  "18",  "Holo Rare",     "neo1", "Neo Genesis", "Neo", 25),
  card("Pichu",       "12",  "Rare",          "neo1", "Neo Genesis", "Neo", 15),

  // ============================
  // NEO DESTINY — 2002
  // ============================
  card("Dark Charizard", "4", "Holo Rare",   "neo4", "Neo Destiny", "Neo", 45),
  card("Dark Blastoise", "2", "Holo Rare",   "neo4", "Neo Destiny", "Neo", 30),

  // ============================
  // EX RUBY & SAPPHIRE — 2003
  // ============================
  card("Blaziken ex",  "91", "Rare Holo EX", "ex1", "EX Ruby & Sapphire", "EX", 25),
  card("Gardevoir ex", "90", "Rare Holo EX", "ex1", "EX Ruby & Sapphire", "EX", 30),

  // ============================
  // EX HIDDEN LEGENDS — 2004
  // ============================
  card("Kyogre ex",    "95", "Rare Holo EX", "ex8", "EX Hidden Legends", "EX", 28),
  card("Groudon ex",   "94", "Rare Holo EX", "ex8", "EX Hidden Legends", "EX", 28),

  // ============================
  // EX DEOXYS — 2005
  // ============================
  card("Rayquaza ex",  "98", "Rare Holo EX", "ex7", "EX Deoxys", "EX", 45),
  card("Deoxys ex",    "99", "Rare Holo EX", "ex7", "EX Deoxys", "EX", 25),

  // ============================
  // DIAMOND & PEARL — 2007
  // ============================
  card("Dialga",       "1",  "Holo Rare",    "dp1", "Diamond & Pearl", "Diamond & Pearl", 18),
  card("Palkia",       "11", "Holo Rare",    "dp1", "Diamond & Pearl", "Diamond & Pearl", 18),
  card("Infernape",    "3",  "Holo Rare",    "dp2", "Mysterious Treasures", "Diamond & Pearl", 12),

  // ============================
  // PLATINUM — 2009
  // ============================
  card("Arceus",       "1",  "Holo Rare",    "pl3", "Arceus", "Platinum", 15),

  // ============================
  // HEARTGOLD SOULSILVER — 2010
  // ============================
  card("Ho-Oh",        "10", "Holo Rare",    "hgss1", "HeartGold SoulSilver", "HeartGold & SoulSilver", 35),
  card("Lugia",        "4",  "Holo Rare",    "hgss1", "HeartGold SoulSilver", "HeartGold & SoulSilver", 40),
  card("Meganium",     "6",  "Holo Rare",    "hgss1", "HeartGold SoulSilver", "HeartGold & SoulSilver", 12),

  // ============================
  // BLACK & WHITE — 2011
  // ============================
  card("Reshiram",     "113", "Holo Rare",   "bw1", "Black & White", "Black & White", 12),
  card("Zekrom",       "114", "Holo Rare",   "bw1", "Black & White", "Black & White", 12),
  card("Charizard EX", "17",  "Rare Holo EX","bw11","Legendary Treasures","Black & White", 30),

  // ============================
  // XY — 2014
  // ============================
  card("Charizard EX", "12", "Rare Holo EX", "xy1", "XY", "XY", 20),
  card("Pyroar",       "18", "Holo Rare",    "xy2", "Flashfire", "XY", 8),
  card("Yveltal EX",   "79", "Rare Holo EX", "xy4", "Phantom Forces", "XY", 12),

  // ============================
  // XY EVOLUTIONS — 2016
  // ============================
  card("Charizard EX", "12", "Rare Holo EX", "xy12", "Evolutions", "XY", 60),
  card("Blastoise EX", "21", "Rare Holo EX", "xy12", "Evolutions", "XY", 25),
  card("Venusaur EX",  "1",  "Rare Holo EX", "xy12", "Evolutions", "XY", 20),
  card("Pikachu",      "35", "Common",       "xy12", "Evolutions", "XY", 15),

  // ============================
  // SUN & MOON — 2017
  // ============================
  card("Solgaleo GX",  "89", "Rare Holo GX", "sm1", "Sun & Moon", "Sun & Moon", 12),
  card("Lunala GX",    "66", "Rare Holo GX", "sm1", "Sun & Moon", "Sun & Moon", 12),

  // ============================
  // SM BURNING SHADOWS — 2017
  // ============================
  card("Charizard GX", "150","Rare Secret",  "sm3", "Burning Shadows", "Sun & Moon", 45),
  card("Ho-Oh GX",     "131","Rare Secret",  "sm3", "Burning Shadows", "Sun & Moon", 22),

  // ============================
  // SM ULTRA PRISM — 2018
  // ============================
  card("Dawn Wings Necrozma GX", "63", "Rare Holo GX", "sm5", "Ultra Prism", "Sun & Moon", 15),

  // ============================
  // SM FORBIDDEN LIGHT — 2018
  // ============================
  card("Ultra Necrozma GX", "127","Rare Secret","sm6","Forbidden Light","Sun & Moon", 25),
  card("Zygarde GX",   "44", "Rare Holo GX", "sm6", "Forbidden Light", "Sun & Moon", 10),

  // ============================
  // SM CELESTIAL STORM — 2018
  // ============================
  card("Rayquaza GX",  "109","Rare Secret",  "sm7", "Celestial Storm", "Sun & Moon", 35),

  // ============================
  // SM LOST THUNDER — 2018
  // ============================
  card("Lugia GX",     "159","Rare Secret",  "sm8", "Lost Thunder", "Sun & Moon", 20),
  card("Suicune GX",   "210","Rare Secret",  "sm8", "Lost Thunder", "Sun & Moon", 18),

  // ============================
  // SM TEAM UP — 2019
  // ============================
  card("Gengar & Mimikyu GX TAG TEAM", "164","Rare Secret","sm9","Team Up","Sun & Moon", 25),

  // ============================
  // SM HIDDEN FATES — 2019
  // ============================
  card("Charizard GX", "SV49","Shiny Rare",  "sma", "Hidden Fates", "Sun & Moon", 120),
  card("Mewtwo GX",    "SV59","Shiny Rare",  "sma", "Hidden Fates", "Sun & Moon", 72),
  card("Gardevoir GX", "SV39","Shiny Rare",  "sma", "Hidden Fates", "Sun & Moon", 40),

  // ============================
  // SM COSMIC ECLIPSE — 2019
  // ============================
  card("Arceus & Dialga & Palkia GX", "221","Rare Secret","sm12","Cosmic Eclipse","Sun & Moon", 45),
  card("Giratina & Garchomp GX TAG TEAM","246","Rare Secret","sm12","Cosmic Eclipse","Sun & Moon", 20),

  // ============================
  // SWORD & SHIELD BASE — 2020
  // ============================
  card("Zacian V",     "138","Ultra Rare",   "swsh1","Sword & Shield","Sword & Shield", 15),
  card("Zacian V",     "195","Rare Rainbow", "swsh1","Sword & Shield","Sword & Shield", 25),
  card("Zamazenta V",  "139","Ultra Rare",   "swsh1","Sword & Shield","Sword & Shield", 10),

  // ============================
  // SWSH REBEL CLASH — 2020
  // ============================
  card("Dragapult VMAX","192","Rare Rainbow","swsh2","Rebel Clash","Sword & Shield", 35),
  card("Toxtricity VMAX","192","Rare Rainbow","swsh2","Rebel Clash","Sword & Shield", 12),

  // ============================
  // SWSH DARKNESS ABLAZE — 2020
  // ============================
  card("Charizard VMAX","189","Rare Rainbow","swsh3","Darkness Ablaze","Sword & Shield", 320),
  card("Charizard VMAX","20", "Rare Secret", "swsh3","Darkness Ablaze","Sword & Shield", 285),
  card("Eternatus VMAX","117","Ultra Rare",  "swsh3","Darkness Ablaze","Sword & Shield", 12),

  // ============================
  // SWSH CHAMPION'S PATH — 2020
  // ============================
  card("Charizard VMAX","74","Rare Secret",  "swsh35","Champion's Path","Sword & Shield", 300),
  card("Charizard V",   "73","Rare Secret",  "swsh35","Champion's Path","Sword & Shield", 55),

  // ============================
  // SWSH VIVID VOLTAGE — 2020
  // ============================
  card("Pikachu VMAX", "188","Rare Rainbow", "swsh4","Vivid Voltage","Sword & Shield", 195),
  card("Pikachu V",    "43", "Ultra Rare",   "swsh4","Vivid Voltage","Sword & Shield", 20),
  card("Togekiss VMAX","184","Rare Rainbow", "swsh4","Vivid Voltage","Sword & Shield", 18),

  // ============================
  // SWSH BATTLE STYLES — 2021
  // ============================
  card("Empoleon V",   "145","Ultra Rare",   "swsh5","Battle Styles","Sword & Shield", 8),
  card("Shadow Rider Calyrex VMAX","199","Rare Rainbow","swsh5","Battle Styles","Sword & Shield", 35),

  // ============================
  // SWSH CHILLING REIGN — 2021
  // ============================
  card("Shadow Rider Calyrex VMAX","198","Rare Rainbow","swsh6","Chilling Reign","Sword & Shield", 45),
  card("Ice Rider Calyrex VMAX","197","Rare Rainbow","swsh6","Chilling Reign","Sword & Shield", 40),
  card("Shadow Rider Calyrex VMAX","69","Ultra Rare","swsh6","Chilling Reign","Sword & Shield", 12),

  // ============================
  // SWSH EVOLVING SKIES — 2021
  // ============================
  card("Umbreon VMAX", "214","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 410),
  card("Rayquaza VMAX","217","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 320),
  card("Rayquaza VMAX","218","Rare Rainbow", "swsh7","Evolving Skies","Sword & Shield", 185),
  card("Leafeon VMAX", "203","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 80),
  card("Noivern V",    "196","Ultra Rare",   "swsh7","Evolving Skies","Sword & Shield", 6),
  card("Dracozolt VMAX","105","Ultra Rare",  "swsh7","Evolving Skies","Sword & Shield", 8),
  card("Suicune V",    "210","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 55),
  card("Glaceon VMAX", "209","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 55),
  card("Espeon VMAX",  "208","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 45),
  card("Umbreon V",    "188","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 55),

  // ============================
  // SWSH FUSION STRIKE — 2021
  // ============================
  card("Mew VMAX",     "268","Alt Art",      "swsh8","Fusion Strike","Sword & Shield", 145),
  card("Gengar VMAX",  "271","Alt Art",      "swsh8","Fusion Strike","Sword & Shield", 28),
  card("Espeon VMAX",  "270","Rare Rainbow", "swsh8","Fusion Strike","Sword & Shield", 165),
  card("Mew VMAX",     "269","Rare Rainbow", "swsh8","Fusion Strike","Sword & Shield", 55),
  card("Mew V",        "113","Alt Art",      "swsh8","Fusion Strike","Sword & Shield", 25),

  // ============================
  // SWSH BRILLIANT STARS — 2022
  // ============================
  card("Arceus VSTAR", "184","Rare Rainbow", "swsh9","Brilliant Stars","Sword & Shield", 18),
  card("Arceus VSTAR", "176","Alt Art",      "swsh9","Brilliant Stars","Sword & Shield", 95),
  card("Charizard V",  "154","Alt Art",      "swsh9","Brilliant Stars","Sword & Shield", 30),

  // ============================
  // SWSH ASTRAL RADIANCE — 2022
  // ============================
  card("Palkia VSTAR", "208","Alt Art",      "swsh10","Astral Radiance","Sword & Shield", 95),
  card("Dialga VSTAR", "198","Alt Art",      "swsh10","Astral Radiance","Sword & Shield", 22),
  card("Origin Forme Dialga VSTAR","186","Ultra Rare","swsh10","Astral Radiance","Sword & Shield", 15),
  card("Hisuian Zoroark VSTAR","174","Ultra Rare","swsh10","Astral Radiance","Sword & Shield", 12),

  // ============================
  // SWSH LOST ORIGIN — 2022
  // ============================
  card("Giratina VSTAR","201","Alt Art",     "swsh11","Lost Origin","Sword & Shield", 55),
  card("Giratina V",   "182","Alt Art",      "swsh11","Lost Origin","Sword & Shield", 15),
  card("Cramorant V",  "196","Alt Art",      "swsh11","Lost Origin","Sword & Shield", 8),

  // ============================
  // SWSH SILVER TEMPEST — 2022
  // ============================
  card("Lugia VSTAR",  "211","Alt Art",      "swsh12","Silver Tempest","Sword & Shield", 88),
  card("Regidrago VSTAR","217","Alt Art",    "swsh12","Silver Tempest","Sword & Shield", 25),
  card("Lugia V",      "138","Alt Art",      "swsh12","Silver Tempest","Sword & Shield", 18),

  // ============================
  // SWSH CROWN ZENITH — 2023
  // ============================
  card("Regieleki VMAX","160","Rare",     "swsh12pt5","Crown Zenith","Sword & Shield", 12),
  card("Mewtwo VSTAR","GG70","Rare",    "swsh12pt5","Crown Zenith","Sword & Shield", 25),

  // ============================
  // SCARLET & VIOLET BASE — 2023
  // ============================
  card("Miraidon ex",  "253","Special Illustration Rare","sv1","Scarlet & Violet","Scarlet & Violet", 55),
  card("Koraidon ex",  "254","Special Illustration Rare","sv1","Scarlet & Violet","Scarlet & Violet", 45),
  card("Miraidon ex",  "191","Ultra Rare",  "sv1","Scarlet & Violet","Scarlet & Violet", 12),
  card("Arcanine ex",  "248","Special Illustration Rare","sv1","Scarlet & Violet","Scarlet & Violet", 18),

  // ============================
  // SV PALDEA EVOLVED — 2023
  // ============================
  card("Quaxwell",     "207","Illustration Rare","sv2","Paldea Evolved","Scarlet & Violet", 8),
  card("Wo-Chien ex",  "232","Special Illustration Rare","sv2","Paldea Evolved","Scarlet & Violet", 38),
  card("Copperajah ex","245","Special Illustration Rare","sv2","Paldea Evolved","Scarlet & Violet", 18),
  card("Chien-Pao ex", "261","Special Illustration Rare","sv2","Paldea Evolved","Scarlet & Violet", 25),

  // ============================
  // SV OBSIDIAN FLAMES — 2023
  // ============================
  card("Charizard ex", "228","Special Illustration Rare","sv3","Obsidian Flames","Scarlet & Violet", 125),
  card("Lechonk",      "209","Illustration Rare","sv3","Obsidian Flames","Scarlet & Violet", 8),
  card("Lechonk",      "156","Illustration Rare","sv3","Obsidian Flames","Scarlet & Violet", 8),
  card("Tyranitar ex", "226","Special Illustration Rare","sv3","Obsidian Flames","Scarlet & Violet", 22),
  card("Eiscue",       "230","Special Illustration Rare","sv3","Obsidian Flames","Scarlet & Violet", 15),

  // ============================
  // SV 151 — 2023
  // ============================
  card("Pikachu",      "173","Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 12),
  card("Charizard ex", "199","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 68),
  card("Mew ex",       "205","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 95),
  card("Alakazam ex",  "201","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 42),
  card("Pikachu",      "174","Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 18),
  card("Venusaur ex",  "197","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 25),
  card("Gyarados ex",  "182","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 22),
  card("Zapdos ex",    "203","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 15),
  card("Mewtwo ex",    "195","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 95),
  card("Magikarp",     "129","Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 12),
  card("Charizard",    "6",  "Holo Rare",         "sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 10),

  // ============================
  // SV PARADOX RIFT — 2023
  // ============================
  card("Roaring Moon ex","244","Special Illustration Rare","sv4","Paradox Rift","Scarlet & Violet", 35),
  card("Iron Valiant ex","245","Special Illustration Rare","sv4","Paradox Rift","Scarlet & Violet", 22),
  card("Garchomp ex",  "184","Illustration Rare","sv4","Paradox Rift","Scarlet & Violet", 15),
  card("Walking Wake ex","258","Special Illustration Rare","sv4","Paradox Rift","Scarlet & Violet", 28),

  // ============================
  // SV TEMPORAL FORCES — 2024
  // ============================
  card("Terapagos ex", "196","Special Illustration Rare","sv5","Temporal Forces","Scarlet & Violet", 55),
  card("Raging Bolt ex","182","Illustration Rare","sv5","Temporal Forces","Scarlet & Violet", 25),
  card("Flutter Mane ex","197","Special Illustration Rare","sv5","Temporal Forces","Scarlet & Violet", 18),

  // ============================
  // SV TWILIGHT MASQUERADE — 2024
  // ============================
  card("Pecharunt ex", "204","Special Illustration Rare","sv6","Twilight Masquerade","Scarlet & Violet", 22),
  card("Ogerpon ex",   "168","Illustration Rare","sv6","Twilight Masquerade","Scarlet & Violet", 15),
  card("Bloodmoon Ursaluna ex","206","Special Illustration Rare","sv6","Twilight Masquerade","Scarlet & Violet", 45),

  // ============================
  // SV SHROUDED FABLE — 2024
  // ============================
  card("Pecharunt ex", "91","Special Illustration Rare","sv6pt5","Shrouded Fable","Scarlet & Violet", 15),

  // ============================
  // SV STELLAR CROWN — 2024
  // ============================
  card("Terapagos ex", "147","Illustration Rare","sv7","Stellar Crown","Scarlet & Violet", 35),
  card("Stellar Crown Terapagos ex","173","Special Illustration Rare","sv7","Stellar Crown","Scarlet & Violet", 60),

  // ============================
  // SV SURGING SPARKS — 2024
  // ============================
  card("Pikachu ex",   "241","Special Illustration Rare","sv8","Surging Sparks","Scarlet & Violet", 85),
  card("Pikachu ex",   "242","Special Illustration Rare","sv8","Surging Sparks","Scarlet & Violet", 75),
  card("Raichu ex",    "234","Special Illustration Rare","sv8","Surging Sparks","Scarlet & Violet", 18),
  card("Pikachu ex",   "220","Illustration Rare","sv8","Surging Sparks","Scarlet & Violet", 25),

  // ============================
  // SV PRISMATIC EVOLUTIONS — 2025
  // ============================
  card("Eevee",        "181","Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 22),
  card("Vaporeon ex",  "182","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 55),
  card("Jolteon ex",   "183","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 48),
  card("Flareon ex",   "184","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 45),
  card("Espeon ex",    "185","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 55),
  card("Umbreon ex",   "186","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 85),
  card("Leafeon ex",   "187","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 42),
  card("Glaceon ex",   "188","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 42),
  card("Sylveon ex",   "189","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 65),

];

// Recherche dans la base locale
export function searchLocalCards(query: string, limit = 20): TcgCardLocal[] {
  if (!query.trim()) return localCardsDatabase.slice(0, limit);
  const q = query.toLowerCase().trim();
  const isNumber = /^\d+\//.test(q) || /^\d+$/.test(q);

  return localCardsDatabase
    .filter((c) => {
      if (isNumber) {
        return c.number.toLowerCase().includes(q);
      }
      return (
        c.name.toLowerCase().includes(q) ||
        c.set.name.toLowerCase().includes(q) ||
        c.set.series.toLowerCase().includes(q) ||
        c.rarity.toLowerCase().includes(q)
      );
    })
    .slice(0, limit);
}
