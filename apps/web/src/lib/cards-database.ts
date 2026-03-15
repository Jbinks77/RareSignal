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
function card(id: string, name: string, number: string, rarity: string, setId: string, setName: string, series: string, price?: number): TcgCardLocal {
  return { id, name, number, rarity, set: { id: setId, name: setName, series }, images: img(setId, number), ...(price ? { cardmarket: { prices: { averageSellPrice: price } } } : {}) };
}

export const localCardsDatabase: TcgCardLocal[] = [

  // ============================
  // BASE SET — 1999
  // ============================
  card("base1-4",   "Charizard",   "4",   "Holo Rare",     "base1", "Base Set",  "Base", 350),
  card("base1-2",   "Blastoise",   "2",   "Holo Rare",     "base1", "Base Set",  "Base", 90),
  card("base1-15",  "Venusaur",    "15",  "Holo Rare",     "base1", "Base Set",  "Base", 75),
  card("base1-25",  "Pikachu",     "58",  "Common",        "base1", "Base Set",  "Base", 45),
  card("base1-10",  "Mewtwo",      "10",  "Holo Rare",     "base1", "Base Set",  "Base", 65),
  card("base1-16",  "Zapdos",      "16",  "Holo Rare",     "base1", "Base Set",  "Base", 40),
  card("base1-6",   "Gyarados",    "6",   "Holo Rare",     "base1", "Base Set",  "Base", 35),
  card("base1-9",   "Magneton",    "9",   "Holo Rare",     "base1", "Base Set",  "Base", 25),

  // ============================
  // JUNGLE — 1999
  // ============================
  card("jungle-1",  "Clefable",    "1",   "Holo Rare",     "jungle", "Jungle", "Base", 20),
  card("jungle-2",  "Electrode",   "2",   "Holo Rare",     "jungle", "Jungle", "Base", 18),
  card("jungle-5",  "Flareon",     "5",   "Holo Rare",     "jungle", "Jungle", "Base", 22),
  card("jungle-7",  "Jolteon",     "7",   "Holo Rare",     "jungle", "Jungle", "Base", 22),
  card("jungle-8",  "Kangaskhan",  "8",   "Holo Rare",     "jungle", "Jungle", "Base", 15),
  card("jungle-12", "Vaporeon",    "12",  "Holo Rare",     "jungle", "Jungle", "Base", 28),
  card("jungle-3",  "Fearow",      "3",   "Holo Rare",     "jungle", "Jungle", "Base", 15),
  card("jungle-6",  "Gengar",      "6",   "Holo Rare",     "jungle", "Jungle", "Base", 35),

  // ============================
  // FOSSIL — 1999
  // ============================
  card("fossil-1",  "Aerodactyl",  "1",   "Holo Rare",     "fossil", "Fossil", "Base", 25),
  card("fossil-2",  "Ditto",       "3",   "Holo Rare",     "fossil", "Fossil", "Base", 30),
  card("fossil-6",  "Gengar",      "5",   "Holo Rare",     "fossil", "Fossil", "Base", 40),
  card("fossil-9",  "Haunter",     "8",   "Holo Rare",     "fossil", "Fossil", "Base", 15),
  card("fossil-11", "Lapras",      "10",  "Holo Rare",     "fossil", "Fossil", "Base", 28),
  card("fossil-14", "Moltres",     "12",  "Holo Rare",     "fossil", "Fossil", "Base", 30),
  card("fossil-17", "Zapdos",      "15",  "Holo Rare",     "fossil", "Fossil", "Base", 30),
  card("fossil-16", "Articuno",    "14",  "Holo Rare",     "fossil", "Fossil", "Base", 30),

  // ============================
  // NEO GENESIS — 2000
  // ============================
  card("neo1-16",   "Lugia",       "9",   "Holo Rare",     "neo1", "Neo Genesis", "Neo", 120),
  card("neo1-4",    "Feraligatr",  "4",   "Holo Rare",     "neo1", "Neo Genesis", "Neo", 30),
  card("neo1-8",    "Meganium",    "8",   "Holo Rare",     "neo1", "Neo Genesis", "Neo", 22),
  card("neo1-24",   "Typhlosion",  "18",  "Holo Rare",     "neo1", "Neo Genesis", "Neo", 25),
  card("neo1-30",   "Pichu",       "12",  "Rare",          "neo1", "Neo Genesis", "Neo", 15),

  // ============================
  // NEO DESTINY — 2002
  // ============================
  card("neo4-18",   "Dark Charizard", "4", "Holo Rare",   "neo4", "Neo Destiny", "Neo", 45),
  card("neo4-8",    "Dark Blastoise", "2", "Holo Rare",   "neo4", "Neo Destiny", "Neo", 30),

  // ============================
  // EX RUBY & SAPPHIRE — 2003
  // ============================
  card("ex1-101",   "Blaziken ex",  "91", "Rare Holo EX", "ex1", "EX Ruby & Sapphire", "EX", 25),
  card("ex1-100",   "Gardevoir ex", "90", "Rare Holo EX", "ex1", "EX Ruby & Sapphire", "EX", 30),

  // ============================
  // EX HIDDEN LEGENDS — 2004
  // ============================
  card("ex8-101",   "Kyogre ex",    "95", "Rare Holo EX", "ex8", "EX Hidden Legends", "EX", 28),
  card("ex8-100",   "Groudon ex",   "94", "Rare Holo EX", "ex8", "EX Hidden Legends", "EX", 28),

  // ============================
  // EX DEOXYS — 2005
  // ============================
  card("ex7-99",    "Rayquaza ex",  "98", "Rare Holo EX", "ex7", "EX Deoxys", "EX", 45),
  card("ex7-100",   "Deoxys ex",    "99", "Rare Holo EX", "ex7", "EX Deoxys", "EX", 25),

  // ============================
  // DIAMOND & PEARL — 2007
  // ============================
  card("dp1-121",   "Dialga",       "1",  "Holo Rare",    "dp1", "Diamond & Pearl", "Diamond & Pearl", 18),
  card("dp1-122",   "Palkia",       "11", "Holo Rare",    "dp1", "Diamond & Pearl", "Diamond & Pearl", 18),
  card("dp2-121",   "Infernape",    "3",  "Holo Rare",    "dp2", "Mysterious Treasures", "Diamond & Pearl", 12),

  // ============================
  // PLATINUM — 2009
  // ============================
  card("pl3-127",   "Arceus",       "1",  "Holo Rare",    "pl3", "Arceus", "Platinum", 15),

  // ============================
  // HEARTGOLD SOULSILVER — 2010
  // ============================
  card("hgss1-10",  "Ho-Oh",        "10", "Holo Rare",    "hgss1", "HeartGold SoulSilver", "HeartGold & SoulSilver", 35),
  card("hgss1-4",   "Lugia",        "4",  "Holo Rare",    "hgss1", "HeartGold SoulSilver", "HeartGold & SoulSilver", 40),
  card("hgss1-6",   "Meganium",     "6",  "Holo Rare",    "hgss1", "HeartGold SoulSilver", "HeartGold & SoulSilver", 12),

  // ============================
  // BLACK & WHITE — 2011
  // ============================
  card("bw1-114",   "Reshiram",     "113", "Holo Rare",   "bw1", "Black & White", "Black & White", 12),
  card("bw1-113",   "Zekrom",       "114", "Holo Rare",   "bw1", "Black & White", "Black & White", 12),
  card("bw11-31",   "Charizard EX", "17",  "Rare Holo EX","bw11","Legendary Treasures","Black & White", 30),

  // ============================
  // XY — 2014
  // ============================
  card("xy1-54",    "Charizard EX", "12", "Rare Holo EX", "xy1", "XY", "XY", 20),
  card("xy2-15",    "Pyroar",       "18", "Holo Rare",    "xy2", "Flashfire", "XY", 8),
  card("xy4-100",   "Yveltal EX",   "79", "Rare Holo EX", "xy4", "Phantom Forces", "XY", 12),

  // ============================
  // XY EVOLUTIONS — 2016
  // ============================
  card("xy12-11",   "Charizard EX", "12", "Rare Holo EX", "xy12", "Evolutions", "XY", 60),
  card("xy12-8",    "Blastoise EX", "21", "Rare Holo EX", "xy12", "Evolutions", "XY", 25),
  card("xy12-1",    "Venusaur EX",  "1",  "Rare Holo EX", "xy12", "Evolutions", "XY", 20),
  card("xy12-103",  "Pikachu",      "35", "Common",       "xy12", "Evolutions", "XY", 15),

  // ============================
  // SUN & MOON — 2017
  // ============================
  card("sm1-149",   "Solgaleo GX",  "89", "Rare Holo GX", "sm1", "Sun & Moon", "Sun & Moon", 12),
  card("sm1-150",   "Lunala GX",    "66", "Rare Holo GX", "sm1", "Sun & Moon", "Sun & Moon", 12),

  // ============================
  // SM BURNING SHADOWS — 2017
  // ============================
  card("sm3-147",   "Charizard GX", "150","Rare Secret",  "sm3", "Burning Shadows", "Sun & Moon", 45),
  card("sm3-148",   "Ho-Oh GX",     "131","Rare Secret",  "sm3", "Burning Shadows", "Sun & Moon", 22),

  // ============================
  // SM ULTRA PRISM — 2018
  // ============================
  card("sm5-142",   "Dawn Wings Necrozma GX", "63", "Rare Holo GX", "sm5", "Ultra Prism", "Sun & Moon", 15),

  // ============================
  // SM FORBIDDEN LIGHT — 2018
  // ============================
  card("sm6-125",   "Ultra Necrozma GX", "127","Rare Secret","sm6","Forbidden Light","Sun & Moon", 25),
  card("sm6-126",   "Zygarde GX",   "44", "Rare Holo GX", "sm6", "Forbidden Light", "Sun & Moon", 10),

  // ============================
  // SM CELESTIAL STORM — 2018
  // ============================
  card("sm7-170",   "Rayquaza GX",  "109","Rare Secret",  "sm7", "Celestial Storm", "Sun & Moon", 35),

  // ============================
  // SM LOST THUNDER — 2018
  // ============================
  card("sm8-214",   "Lugia GX",     "159","Rare Secret",  "sm8", "Lost Thunder", "Sun & Moon", 20),
  card("sm8-215",   "Suicune GX",   "210","Rare Secret",  "sm8", "Lost Thunder", "Sun & Moon", 18),

  // ============================
  // SM TEAM UP — 2019
  // ============================
  card("sm9-196",   "Gengar & Mimikyu GX TAG TEAM", "164","Rare Secret","sm9","Team Up","Sun & Moon", 25),

  // ============================
  // SM HIDDEN FATES — 2019
  // ============================
  card("sma-SV49",  "Charizard GX", "SV49","Shiny Rare",  "sma", "Hidden Fates", "Sun & Moon", 120),
  card("sma-SV59",  "Mewtwo GX",    "SV59","Shiny Rare",  "sma", "Hidden Fates", "Sun & Moon", 72),
  card("sma-SV39",  "Gardevoir GX", "SV39","Shiny Rare",  "sma", "Hidden Fates", "Sun & Moon", 40),

  // ============================
  // SM COSMIC ECLIPSE — 2019
  // ============================
  card("sm12-265",  "Arceus & Dialga & Palkia GX", "221","Rare Secret","sm12","Cosmic Eclipse","Sun & Moon", 45),
  card("sm12-264",  "Giratina & Garchomp GX TAG TEAM","246","Rare Secret","sm12","Cosmic Eclipse","Sun & Moon", 20),

  // ============================
  // SWORD & SHIELD BASE — 2020
  // ============================
  card("swsh1-189", "Zacian V",     "138","Ultra Rare",   "swsh1","Sword & Shield","Sword & Shield", 15),
  card("swsh1-196", "Zacian V",     "195","Rare Rainbow", "swsh1","Sword & Shield","Sword & Shield", 25),
  card("swsh1-190", "Zamazenta V",  "139","Ultra Rare",   "swsh1","Sword & Shield","Sword & Shield", 10),

  // ============================
  // SWSH REBEL CLASH — 2020
  // ============================
  card("swsh2-195", "Dragapult VMAX","192","Rare Rainbow","swsh2","Rebel Clash","Sword & Shield", 35),
  card("swsh2-192", "Toxtricity VMAX","192","Rare Rainbow","swsh2","Rebel Clash","Sword & Shield", 12),

  // ============================
  // SWSH DARKNESS ABLAZE — 2020
  // ============================
  card("swsh3-189", "Charizard VMAX","189","Rare Rainbow","swsh3","Darkness Ablaze","Sword & Shield", 320),
  card("swsh3-20",  "Charizard VMAX","20", "Rare Secret", "swsh3","Darkness Ablaze","Sword & Shield", 285),
  card("swsh3-69",  "Eternatus VMAX","117","Ultra Rare",  "swsh3","Darkness Ablaze","Sword & Shield", 12),

  // ============================
  // SWSH CHAMPION'S PATH — 2020
  // ============================
  card("swsh35-74", "Charizard VMAX","74","Rare Secret",  "swsh35","Champion's Path","Sword & Shield", 300),
  card("swsh35-73", "Charizard V",   "73","Rare Secret",  "swsh35","Champion's Path","Sword & Shield", 55),

  // ============================
  // SWSH VIVID VOLTAGE — 2020
  // ============================
  card("swsh4-188", "Pikachu VMAX", "188","Rare Rainbow", "swsh4","Vivid Voltage","Sword & Shield", 195),
  card("swsh4-44",  "Pikachu V",    "43", "Ultra Rare",   "swsh4","Vivid Voltage","Sword & Shield", 20),
  card("swsh4-185", "Togekiss VMAX","184","Rare Rainbow", "swsh4","Vivid Voltage","Sword & Shield", 18),

  // ============================
  // SWSH BATTLE STYLES — 2021
  // ============================
  card("swsh5-163", "Empoleon V",   "145","Ultra Rare",   "swsh5","Battle Styles","Sword & Shield", 8),
  card("swsh5-184", "Shadow Rider Calyrex VMAX","199","Rare Rainbow","swsh5","Battle Styles","Sword & Shield", 35),

  // ============================
  // SWSH CHILLING REIGN — 2021
  // ============================
  card("swsh6-198", "Shadow Rider Calyrex VMAX","198","Rare Rainbow","swsh6","Chilling Reign","Sword & Shield", 45),
  card("swsh6-197", "Ice Rider Calyrex VMAX","197","Rare Rainbow","swsh6","Chilling Reign","Sword & Shield", 40),
  card("swsh6-68",  "Shadow Rider Calyrex VMAX","69","Ultra Rare","swsh6","Chilling Reign","Sword & Shield", 12),

  // ============================
  // SWSH EVOLVING SKIES — 2021
  // ============================
  card("swsh7-214", "Umbreon VMAX", "214","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 410),
  card("swsh7-217", "Rayquaza VMAX","217","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 320),
  card("swsh7-218", "Rayquaza VMAX","218","Rare Rainbow", "swsh7","Evolving Skies","Sword & Shield", 185),
  card("swsh7-203", "Leafeon VMAX", "203","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 80),
  card("swsh7-196", "Noivern V",    "196","Ultra Rare",   "swsh7","Evolving Skies","Sword & Shield", 6),
  card("swsh7-91",  "Dracozolt VMAX","105","Ultra Rare",  "swsh7","Evolving Skies","Sword & Shield", 8),
  card("swsh7-210", "Suicune V",    "210","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 55),
  card("swsh7-208", "Glaceon VMAX", "209","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 55),
  card("swsh7-213", "Espeon VMAX",  "208","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 45),
  card("swsh7-215", "Umbreon V",    "188","Alt Art",      "swsh7","Evolving Skies","Sword & Shield", 55),

  // ============================
  // SWSH FUSION STRIKE — 2021
  // ============================
  card("swsh8-268", "Mew VMAX",     "268","Alt Art",      "swsh8","Fusion Strike","Sword & Shield", 145),
  card("swsh8-271", "Gengar VMAX",  "271","Alt Art",      "swsh8","Fusion Strike","Sword & Shield", 28),
  card("swsh8-270", "Espeon VMAX",  "270","Rare Rainbow", "swsh8","Fusion Strike","Sword & Shield", 165),
  card("swsh8-269", "Mew VMAX",     "269","Rare Rainbow", "swsh8","Fusion Strike","Sword & Shield", 55),
  card("swsh8-114", "Mew V",        "113","Alt Art",      "swsh8","Fusion Strike","Sword & Shield", 25),

  // ============================
  // SWSH BRILLIANT STARS — 2022
  // ============================
  card("swsh9-184", "Arceus VSTAR", "184","Rare Rainbow", "swsh9","Brilliant Stars","Sword & Shield", 18),
  card("swsh9-176", "Arceus VSTAR", "176","Alt Art",      "swsh9","Brilliant Stars","Sword & Shield", 95),
  card("swsh9-123", "Charizard V",  "154","Alt Art",      "swsh9","Brilliant Stars","Sword & Shield", 30),

  // ============================
  // SWSH ASTRAL RADIANCE — 2022
  // ============================
  card("swsh10-208","Palkia VSTAR", "208","Alt Art",      "swsh10","Astral Radiance","Sword & Shield", 95),
  card("swsh10-198","Dialga VSTAR", "198","Alt Art",      "swsh10","Astral Radiance","Sword & Shield", 22),
  card("swsh10-186","Origin Forme Dialga VSTAR","186","Ultra Rare","swsh10","Astral Radiance","Sword & Shield", 15),
  card("swsh10-174","Hisuian Zoroark VSTAR","174","Ultra Rare","swsh10","Astral Radiance","Sword & Shield", 12),

  // ============================
  // SWSH LOST ORIGIN — 2022
  // ============================
  card("swsh11-201","Giratina VSTAR","201","Alt Art",     "swsh11","Lost Origin","Sword & Shield", 55),
  card("swsh11-182","Giratina V",   "182","Alt Art",      "swsh11","Lost Origin","Sword & Shield", 15),
  card("swsh11-196","Cramorant V",  "196","Alt Art",      "swsh11","Lost Origin","Sword & Shield", 8),

  // ============================
  // SWSH SILVER TEMPEST — 2022
  // ============================
  card("swsh12-211","Lugia VSTAR",  "211","Alt Art",      "swsh12","Silver Tempest","Sword & Shield", 88),
  card("swsh12-217","Regidrago VSTAR","217","Alt Art",    "swsh12","Silver Tempest","Sword & Shield", 25),
  card("swsh12-195","Lugia V",      "138","Alt Art",      "swsh12","Silver Tempest","Sword & Shield", 18),

  // ============================
  // SWSH CROWN ZENITH — 2023
  // ============================
  card("swsh12pt5-160","Regieleki VMAX","160","Rare",     "swsh12pt5","Crown Zenith","Sword & Shield", 12),
  card("swsh12pt5-GG70","Mewtwo VSTAR","GG70","Rare",    "swsh12pt5","Crown Zenith","Sword & Shield", 25),

  // ============================
  // SCARLET & VIOLET BASE — 2023
  // ============================
  card("sv1-253",   "Miraidon ex",  "253","Special Illustration Rare","sv1","Scarlet & Violet","Scarlet & Violet", 55),
  card("sv1-254",   "Koraidon ex",  "254","Special Illustration Rare","sv1","Scarlet & Violet","Scarlet & Violet", 45),
  card("sv1-191",   "Miraidon ex",  "191","Ultra Rare",  "sv1","Scarlet & Violet","Scarlet & Violet", 12),
  card("sv1-248",   "Arcanine ex",  "248","Special Illustration Rare","sv1","Scarlet & Violet","Scarlet & Violet", 18),

  // ============================
  // SV PALDEA EVOLVED — 2023
  // ============================
  card("sv2-207",   "Quaxwell",     "207","Illustration Rare","sv2","Paldea Evolved","Scarlet & Violet", 8),
  card("sv2-232",   "Wo-Chien ex",  "232","Special Illustration Rare","sv2","Paldea Evolved","Scarlet & Violet", 38),
  card("sv2-245",   "Copperajah ex","245","Special Illustration Rare","sv2","Paldea Evolved","Scarlet & Violet", 18),
  card("sv2-261",   "Chien-Pao ex", "261","Special Illustration Rare","sv2","Paldea Evolved","Scarlet & Violet", 25),

  // ============================
  // SV OBSIDIAN FLAMES — 2023
  // ============================
  card("sv3-228",   "Charizard ex", "228","Special Illustration Rare","sv3","Obsidian Flames","Scarlet & Violet", 125),
  card("sv3-209",   "Lechonk",      "209","Illustration Rare","sv3","Obsidian Flames","Scarlet & Violet", 8),
  card("sv3-156",   "Lechonk",      "156","Illustration Rare","sv3","Obsidian Flames","Scarlet & Violet", 8),
  card("sv3-226",   "Tyranitar ex", "226","Special Illustration Rare","sv3","Obsidian Flames","Scarlet & Violet", 22),
  card("sv3-230",   "Eiscue",       "230","Special Illustration Rare","sv3","Obsidian Flames","Scarlet & Violet", 15),

  // ============================
  // SV 151 — 2023
  // ============================
  card("sv3pt5-173","Pikachu",      "173","Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 12),
  card("sv3pt5-199","Charizard ex", "199","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 68),
  card("sv3pt5-205","Mew ex",       "205","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 95),
  card("sv3pt5-201","Alakazam ex",  "201","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 42),
  card("sv3pt5-174","Pikachu",      "174","Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 18),
  card("sv3pt5-197","Venusaur ex",  "197","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 25),
  card("sv3pt5-182","Gyarados ex",  "182","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 22),
  card("sv3pt5-203","Zapdos ex",    "203","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 15),
  card("sv3pt5-195","Mewtwo ex",    "195","Special Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 95),
  card("sv3pt5-129","Magikarp",     "129","Illustration Rare","sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 12),
  card("sv3pt5-006","Charizard",    "6",  "Holo Rare",         "sv3pt5","Scarlet & Violet 151","Scarlet & Violet", 10),

  // ============================
  // SV PARADOX RIFT — 2023
  // ============================
  card("sv4-244",   "Roaring Moon ex","244","Special Illustration Rare","sv4","Paradox Rift","Scarlet & Violet", 35),
  card("sv4-245",   "Iron Valiant ex","245","Special Illustration Rare","sv4","Paradox Rift","Scarlet & Violet", 22),
  card("sv4-184",   "Garchomp ex",  "184","Illustration Rare","sv4","Paradox Rift","Scarlet & Violet", 15),
  card("sv4-258",   "Walking Wake ex","258","Special Illustration Rare","sv4","Paradox Rift","Scarlet & Violet", 28),

  // ============================
  // SV TEMPORAL FORCES — 2024
  // ============================
  card("sv5-196",   "Terapagos ex", "196","Special Illustration Rare","sv5","Temporal Forces","Scarlet & Violet", 55),
  card("sv5-182",   "Raging Bolt ex","182","Illustration Rare","sv5","Temporal Forces","Scarlet & Violet", 25),
  card("sv5-197",   "Flutter Mane ex","197","Special Illustration Rare","sv5","Temporal Forces","Scarlet & Violet", 18),

  // ============================
  // SV TWILIGHT MASQUERADE — 2024
  // ============================
  card("sv6-204",   "Pecharunt ex", "204","Special Illustration Rare","sv6","Twilight Masquerade","Scarlet & Violet", 22),
  card("sv6-168",   "Ogerpon ex",   "168","Illustration Rare","sv6","Twilight Masquerade","Scarlet & Violet", 15),
  card("sv6-206",   "Bloodmoon Ursaluna ex","206","Special Illustration Rare","sv6","Twilight Masquerade","Scarlet & Violet", 45),

  // ============================
  // SV SHROUDED FABLE — 2024
  // ============================
  card("sv6pt5-91", "Pecharunt ex", "91","Special Illustration Rare","sv6pt5","Shrouded Fable","Scarlet & Violet", 15),

  // ============================
  // SV STELLAR CROWN — 2024
  // ============================
  card("sv7-147",   "Terapagos ex", "147","Illustration Rare","sv7","Stellar Crown","Scarlet & Violet", 35),
  card("sv7-173",   "Stellar Crown Terapagos ex","173","Special Illustration Rare","sv7","Stellar Crown","Scarlet & Violet", 60),

  // ============================
  // SV SURGING SPARKS — 2024
  // ============================
  card("sv8-241",   "Pikachu ex",   "241","Special Illustration Rare","sv8","Surging Sparks","Scarlet & Violet", 85),
  card("sv8-242",   "Pikachu ex",   "242","Special Illustration Rare","sv8","Surging Sparks","Scarlet & Violet", 75),
  card("sv8-234",   "Raichu ex",    "234","Special Illustration Rare","sv8","Surging Sparks","Scarlet & Violet", 18),
  card("sv8-220",   "Pikachu ex",   "220","Illustration Rare","sv8","Surging Sparks","Scarlet & Violet", 25),

  // ============================
  // SV PRISMATIC EVOLUTIONS — 2025
  // ============================
  card("sv8pt5-181","Eevee",        "181","Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 22),
  card("sv8pt5-182","Vaporeon ex",  "182","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 55),
  card("sv8pt5-183","Jolteon ex",   "183","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 48),
  card("sv8pt5-184","Flareon ex",   "184","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 45),
  card("sv8pt5-185","Espeon ex",    "185","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 55),
  card("sv8pt5-186","Umbreon ex",   "186","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 85),
  card("sv8pt5-187","Leafeon ex",   "187","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 42),
  card("sv8pt5-188","Glaceon ex",   "188","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 42),
  card("sv8pt5-189","Sylveon ex",   "189","Special Illustration Rare","sv8pt5","Prismatic Evolutions","Scarlet & Violet", 65),

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
