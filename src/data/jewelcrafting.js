// Midnight Jewelcrafting 1-100 leveling path — Stormrage-US.
//
// Sourced from Wowhead/wow-professions.com/ConquestCapped Midnight leveling
// guides (Aug 2026). Midnight is a new expansion and guides are still being
// revised, so `confidence` marks how much to trust each bracket:
//   'high'   — two+ independent guides agree exactly
//   'medium' — one detailed source, not cross-verified
//   'low'    — genuinely choice/market-driven, not a fixed recipe list
//
// `crafts` is a starting estimate, not gospel — the tracker UI lets you edit
// it per recipe so bad data is a quick correction, not a blocker.
//
// Material `key`s are stable slugs used for price persistence and for
// mapping to Blizzard item IDs in wowItemIds.js — don't rename them without
// updating both.

export const JC_BRACKETS = [
  {
    id: 'b1-14',
    range: '1 – 14',
    confidence: 'high',
    summary: 'Prospect cheap ore for gems/dust, then burn through Sin\'dorei Lens for the last few points.',
    recipes: [
      {
        name: 'Midnight Prospecting',
        crafts: 12,
        materials: [
          { key: 'cheap-ore', name: 'Cheap Ore (Refulgent Copper / Umbral Tin / Brilliant Silver)', qty: 5 },
        ],
        sellable: false,
        note: 'Byproduct engine — feeds Glimmering Gemdust, Crystalline Glass, and Duskshrouded Stone used later.',
      },
      {
        name: "Sin'dorei Lens",
        crafts: 4,
        materials: [
          { key: 'glimmering-gemdust', name: 'Glimmering Gemdust', qty: 1 },
          { key: 'crystalline-glass', name: 'Crystalline Glass', qty: 3 },
        ],
        sellable: false,
        note: 'Vendor/disenchant fodder.',
      },
    ],
  },
  {
    id: 'b14-50',
    range: '14 – 50',
    confidence: 'medium',
    summary: 'Trainer unlocks a new recipe roughly every 5 skill points — craft each once for the first-craft bonus. Totals below are cumulative for the whole bracket, not a single recipe.',
    recipes: [
      {
        name: 'Trainer recipe chain (one craft each, first-craft bonus)',
        crafts: 1,
        materials: [
          { key: 'refulgent-copper-ore', name: 'Refulgent Copper Ore', qty: 5 },
          { key: 'umbral-tin-ore', name: 'Umbral Tin Ore', qty: 5 },
          { key: 'glimmering-gemdust', name: 'Glimmering Gemdust', qty: 31 },
          { key: 'crystalline-glass', name: 'Crystalline Glass', qty: 100 },
          { key: 'duskshrouded-stone', name: 'Duskshrouded Stone', qty: 7 },
          { key: 'sanguine-garnet', name: 'Sanguine Garnet', qty: 5 },
          { key: 'tenebrous-amethyst', name: 'Tenebrous Amethyst', qty: 4 },
          { key: 'harandar-peridot', name: 'Harandar Peridot', qty: 4 },
          { key: 'amani-lapis', name: 'Amani Lapis', qty: 4 },
          { key: 'flawless-sanguine-garnet', name: 'Flawless Sanguine Garnet', qty: 1 },
          { key: 'flawless-tenebrous-amethyst', name: 'Flawless Tenebrous Amethyst', qty: 1 },
          { key: 'flawless-harandar-peridot', name: 'Flawless Harandar Peridot', qty: 1 },
          { key: 'flawless-amani-lapis', name: 'Flawless Amani Lapis', qty: 1 },
        ],
        sellable: false,
        note: 'Mixed bag — mostly vendor fodder, occasional sellable piece. Exact recipe-by-recipe breakdown varies by which specializations you picked; treat this as a shopping list, not a strict order.',
      },
    ],
  },
  {
    id: 'b50-65',
    range: '50 – 65',
    confidence: 'high',
    summary: 'The cleanest, cheapest bridge to 65 — one recipe, one material.',
    recipes: [
      {
        name: "Monologuer's Chalice",
        crafts: 40,
        materials: [
          { key: 'crystalline-glass', name: 'Crystalline Glass', qty: 2 },
        ],
        sellable: false,
        note: 'Vendor trash, but dirt cheap per skill point.',
      },
    ],
  },
  {
    id: 'b65-100',
    range: '65 – 100',
    confidence: 'low',
    summary: 'No single fixed path here — it\'s a choice between gem cuts, profession equipment, and jewelry crafting orders, and the right pick depends on live AH prices. This is where the Sync with AH button matters most: compare profit-per-craft across options instead of following a fixed list.',
    recipes: [
      {
        name: 'Cut Eversong Diamond',
        crafts: 1,
        materials: [
          { key: 'petrified-root', name: 'Petrified Root', qty: 2 },
          { key: 'kaleidoscopic-prism', name: 'Kaleidoscopic Prism', qty: 1 },
          { key: 'eversong-diamond', name: 'Eversong Diamond', qty: 1 },
        ],
        sellable: true,
        saleKey: 'cut-eversong-diamond',
        note: '~2 skill points per craft. Gem cuts are usually AH-sellable — good candidate for profit, not just break-even.',
      },
      {
        name: 'Profession Equipment (rare/epic)',
        crafts: 1,
        materials: [],
        sellable: false,
        note: 'Materials not sourced yet — gold-heavy route, check trainer/recipe cost in-game before relying on this one. Add materials here once you\'ve scouted it.',
      },
      {
        name: 'Jewelry via Crafting Orders',
        crafts: 1,
        materials: [],
        sellable: true,
        saleKey: 'jewelry-crafting-order',
        note: 'Rings/necklaces use Spark-tier materials — usually too expensive to self-supply. More realistic as a commissioned crafting order than a personal-mats craft.',
      },
    ],
  },
]

// Every unique material key across all brackets, in first-appearance order —
// used to render one price input per material regardless of how many
// recipes reference it.
export function getAllMaterialKeys() {
  const seen = new Map()
  for (const bracket of JC_BRACKETS) {
    for (const recipe of bracket.recipes) {
      for (const mat of recipe.materials) {
        if (!seen.has(mat.key)) seen.set(mat.key, mat.name)
      }
    }
  }
  return [...seen.entries()].map(([key, name]) => ({ key, name }))
}

// Every recipe that can be sold on the AH, for rendering sale-price inputs.
export function getAllSellables() {
  const out = []
  for (const bracket of JC_BRACKETS) {
    for (const recipe of bracket.recipes) {
      if (recipe.sellable) {
        out.push({ key: recipe.saleKey || recipe.name, name: recipe.name })
      }
    }
  }
  return out
}
