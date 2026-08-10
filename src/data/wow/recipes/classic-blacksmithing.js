// Classic Blacksmithing (retail skill tier) — a 1→300 leveling ROUTE, not a
// full recipe catalog. This is one recipe per bracket, the cheapest known
// way through that skill range, not every recipe the tier offers (305 raw
// recipes exist in the full tier — out of scope, see docs/wow-tracker-playbook.md
// convention: this file intentionally deviates from the full-catalog pattern
// used by the Midnight trackers).
//
// Confirmed via Blizzard's Game Data API that this tier — "Classic
// Blacksmithing" (profession id 164, skill-tier id 2477) — is craftable on
// a live retail character on Stormrage-US, distinct from Classic Era
// ruleset servers (which have their own separate realm list entirely;
// Stormrage isn't one of them).
//
// Route order and level brackets cross-referenced against a public 1-300
// Classic Blacksmithing leveling guide (level brackets + recipe choice per
// bracket) as a starting point, but recipe data itself (materials, skill
// thresholds, learn method) was independently verified against
// warcraft.wiki.gg per-recipe pages and Blizzard's own skill-tier recipe
// list — not scraped wholesale. Two recipes from that reference route
// (Silver Rod, Truesilver Rod) were removed after cross-checking Blizzard's
// live skill-tier recipe list: both were "removed in patch 5.0.4" per
// warcraft.wiki.gg and do not exist in this retail tier at all, even though
// they're still craftable on Classic Era servers. Dropping them leaves no
// real gap — Silver Skeleton Key (skill 100+) and Truesilver Skeleton Key
// (skill 200+) already cover the tiny skill windows those two recipes were
// filling.
//
// craftsEstimate is an approximate "crafts to skill through this bracket"
// figure carried over from that reference route for context — it's a
// probabilistic estimate (skill-up rolls are RNG), not a guarantee, and
// wasn't independently re-derived. Treat it as a ballpark, not a budget.
//
// Four skill windows (117-125, 146-150, 167-175, 267-280) have no known
// single efficient recipe — flagged as notes on the preceding recipe rather
// than invented. Expect to grind, quest, or eat a few less-efficient trainer
// crafts to bridge those.
//
// Materials priced via the same Stormrage-US retail AH sync as the Midnight
// trackers (netlify/functions/wow-auctions.cjs — zero backend changes
// needed, this is the same dynamic-us namespace, same realm). Every output
// is marked sellable: true (none of these are bind-on-pickup) so the sale
// price is a manual-only field per recipe — no output item IDs were
// researched (a couple of these got renamed/converted post-squish, e.g.
// Copper Chain Belt → Copper Plate Belt, and it wasn't worth resolving for
// items nobody realistically lists on a 2026 retail AH), so "Sync with AH"
// only ever fills in material costs, not sale prices, for this tracker.

export const LEARN_METHODS = {
  trainer: { label: 'Trainer', description: 'Taught by a Blacksmithing trainer for gold' },
  recipe_item: { label: 'Recipe/Plans', description: 'Requires acquiring a separate Plans item — vendor purchase, drop, or unconfirmed source' },
}

export const RECIPES = [
  {
    id: 1631,
    name: 'Rough Sharpening Stone',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 1,
    skillProgression: [1, 15, 35, 55],
    materials: [{ key: 'rough-stone', name: 'Rough Stone', qty: 1 }],
    learnMethod: { type: 'trainer', detail: 'Taught by Blacksmithing trainers from skill 1' },
    sellable: true,
    saleKey: 'rough-sharpening-stone',
    notes: 'Bracket 1–48 (~133 crafts, estimated).',
  },
  {
    id: 1634,
    name: 'Copper Bracers',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 1,
    skillProgression: [1, 20, 40, 60],
    materials: [{ key: 'copper-bar', name: 'Copper Bar', qty: 2 }],
    learnMethod: { type: 'trainer', detail: 'Taught by Blacksmithing trainers from skill 1' },
    sellable: true,
    saleKey: 'copper-bracers',
    notes: 'Bracket 48–53 (~42 crafts, estimated).',
  },
  {
    id: 1633,
    name: 'Copper Chain Pants',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 1,
    skillProgression: [1, 50, 70, 90],
    materials: [{ key: 'copper-bar', name: 'Copper Bar', qty: 4 }],
    learnMethod: { type: 'trainer', detail: 'Taught by Blacksmithing trainers from skill 1' },
    sellable: true,
    saleKey: 'copper-chain-pants',
    notes: 'Bracket 53–83 (~116 crafts, estimated).',
  },
  {
    id: 1632,
    name: 'Copper Chain Belt',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 35,
    skillProgression: [35, 75, 95, 115],
    materials: [{ key: 'copper-bar', name: 'Copper Bar', qty: 6 }],
    learnMethod: { type: 'trainer', detail: 'Pattern purchased from Blacksmithing trainers for 1 silver at skill 35' },
    sellable: true,
    saleKey: 'copper-chain-belt',
    notes: 'Bracket 83–108 (~109 crafts, estimated).',
  },
  {
    id: 11183,
    name: 'Silver Skeleton Key',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 100,
    skillProgression: [100, 100, 110, 120],
    materials: [
      { key: 'silver-bar', name: 'Silver Bar', qty: 1 },
      { key: 'rough-grinding-stone', name: 'Rough Grinding Stone', qty: 1 },
    ],
    learnMethod: { type: 'trainer', detail: 'Taught by Blacksmithing trainers at skill 100' },
    sellable: true,
    saleKey: 'silver-skeleton-key',
    notes: 'Bracket 108–120 (~45 crafts, estimated). Covers the skill-100 window on its own — Silver Rod filled part of this range on Classic Era servers but was removed from the game in patch 5.0.4 and doesn’t exist in this retail tier. Small gap around 120–125 before Heavy Sharpening Stone unlocks — no known efficient recipe covers it, expect to grind or eat a less-efficient craft.',
  },
  {
    id: 1644,
    name: 'Heavy Sharpening Stone',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 125,
    skillProgression: [125, 125, 132, 140],
    materials: [{ key: 'heavy-stone', name: 'Heavy Stone', qty: 1 }],
    learnMethod: { type: 'trainer', detail: 'Taught by Blacksmithing trainers at skill 125' },
    sellable: true,
    saleKey: 'heavy-sharpening-stone',
    notes: 'Bracket 125–138 (~49 crafts, estimated).',
  },
  {
    id: 1868,
    name: 'Heavy Grinding Stone',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 125,
    skillProgression: [125, 125, 137, 150],
    materials: [{ key: 'heavy-stone', name: 'Heavy Stone', qty: 3 }],
    learnMethod: { type: 'trainer', detail: 'Taught by Blacksmithing trainers at skill 125' },
    sellable: true,
    saleKey: 'heavy-grinding-stone',
    notes: 'Bracket 138–146 (~51 crafts, estimated). Gap around 146–150 before Golden Skeleton Key unlocks — no known efficient recipe covers it.',
  },
  {
    id: 11184,
    name: 'Golden Skeleton Key',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 150,
    skillProgression: [150, 150, 160, 170],
    materials: [
      { key: 'gold-bar', name: 'Gold Bar', qty: 1 },
      { key: 'heavy-grinding-stone', name: 'Heavy Grinding Stone', qty: 1 },
    ],
    learnMethod: { type: 'trainer', detail: 'Taught by Blacksmithing trainers at skill 150' },
    sellable: true,
    saleKey: 'golden-skeleton-key',
    notes: 'Bracket 150–167 (~64 crafts, estimated). Gap around 167–175 before Golden Scale Shoulders becomes viable — no known efficient recipe covers it.',
  },
  {
    id: 1997,
    name: 'Golden Scale Shoulders',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 175,
    skillProgression: [175, 200, 212, 225],
    materials: [
      { key: 'steel-bar', name: 'Steel Bar', qty: 6 },
      { key: 'gold-bar', name: 'Gold Bar', qty: 2 },
      { key: 'heavy-grinding-stone', name: 'Heavy Grinding Stone', qty: 1 },
    ],
    learnMethod: { type: 'recipe_item', detail: 'Learned from Plans: Golden Scale Shoulders, a world drop — not sold by any known vendor' },
    sellable: true,
    saleKey: 'golden-scale-shoulders',
    notes: 'Bracket 175–200 (~25 crafts, estimated). The Plans are a random world drop, not guaranteed available — have a backup (trainer recipe, even if less efficient) in mind if you can’t find one.',
  },
  {
    id: 5312,
    name: 'Solid Sharpening Stone',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 200,
    skillProgression: [200, 200, 205, 210],
    materials: [{ key: 'solid-stone', name: 'Solid Stone', qty: 1 }],
    learnMethod: { type: 'trainer', detail: 'Taught by Blacksmithing trainers at skill 200' },
    sellable: true,
    saleKey: 'solid-sharpening-stone',
    notes: 'Bracket 200–209 (~36 crafts, estimated).',
  },
  {
    id: 11185,
    name: 'Truesilver Skeleton Key',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 200,
    skillProgression: [200, 200, 210, 220],
    materials: [
      { key: 'truesilver-bar', name: 'Truesilver Bar', qty: 1 },
      { key: 'solid-grinding-stone', name: 'Solid Grinding Stone', qty: 1 },
    ],
    learnMethod: { type: 'trainer', detail: 'Taught by Blacksmithing trainers at skill 200' },
    sellable: true,
    saleKey: 'truesilver-skeleton-key',
    notes: 'Bracket 209–220 (~45 crafts, estimated). Truesilver Rod filled a tiny sliver of this range on Classic Era servers but, like Silver Rod, was removed in patch 5.0.4 and doesn’t exist here — this key alone covers the skill-200+ window.',
  },
  {
    id: 7417,
    name: 'Inlaid Mithril Cylinder',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 200,
    skillProgression: [200, 225, 237, 250],
    materials: [
      { key: 'mithril-bar', name: 'Mithril Bar', qty: 5 },
      { key: 'gold-bar', name: 'Gold Bar', qty: 1 },
      { key: 'truesilver-bar', name: 'Truesilver Bar', qty: 1 },
    ],
    learnMethod: { type: 'recipe_item', detail: 'Learned from Plans: Inlaid Mithril Cylinder — exact source (vendor vs. drop) unconfirmed in available sources' },
    sellable: true,
    saleKey: 'inlaid-mithril-cylinder',
    notes: 'Bracket 217–246 (~85 crafts, estimated).',
  },
  {
    id: 5329,
    name: 'Mithril Coif',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 230,
    skillProgression: [230, 250, 260, 270],
    materials: [
      { key: 'mithril-bar', name: 'Mithril Bar', qty: 10 },
      { key: 'mageweave-cloth', name: 'Mageweave Cloth', qty: 6 },
    ],
    learnMethod: { type: 'trainer', detail: 'Taught by Blacksmithing trainers at skill 230' },
    sellable: true,
    saleKey: 'mithril-coif',
    notes: 'Covers brackets 246–250 and 260–267 (~49 crafts total, estimated) — the reference route alternates it with Dense Sharpening Stone rather than crafting it all at once, but the full 230–270 range works either way. Gap around 267–280 before Thorium Helm unlocks — no known efficient recipe covers it.',
  },
  {
    id: 9156,
    name: 'Dense Sharpening Stone',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 250,
    skillProgression: [250, 255, 257, 260],
    materials: [{ key: 'dense-stone', name: 'Dense Stone', qty: 1 }],
    learnMethod: { type: 'trainer', detail: 'Taught by Blacksmithing trainers at skill 250' },
    sellable: true,
    saleKey: 'dense-sharpening-stone',
    notes: 'Bracket 250–260 (~27 crafts, estimated).',
  },
  {
    id: 9170,
    name: 'Thorium Helm',
    category: 'Leveling Route (1 → 300)',
    skillLevelRequired: 280,
    skillProgression: [280, 300, 310, 320],
    materials: [
      { key: 'thorium-bar', name: 'Thorium Bar', qty: 12 },
      { key: 'star-ruby', name: 'Star Ruby', qty: 1 },
    ],
    learnMethod: { type: 'trainer', detail: 'Taught by Blacksmithing trainers at skill 280 (as of patch 3.1.0; earlier required Plans: Thorium Helm)' },
    sellable: true,
    saleKey: 'thorium-helm',
    notes: 'Bracket 280–300 (~20 crafts, estimated). Skill cap for this tier.',
  },
]

// Every unique material key across all recipes, in first-appearance order.
export function getAllMaterialKeys() {
  const seen = new Map()
  for (const recipe of RECIPES) {
    for (const mat of recipe.materials) {
      if (!seen.has(mat.key)) seen.set(mat.key, mat.name)
    }
  }
  return [...seen.entries()].map(([key, name]) => ({ key, name }))
}

// Every recipe whose output can be sold on the AH (sellable === true).
// No item IDs are mapped for these in itemIds/classic-blacksmithing.js, so
// sync silently skips them — sale price stays a manual-entry-only field.
export function getAllSellables() {
  return RECIPES
    .filter(r => r.sellable === true && r.saleKey)
    .map(r => ({ key: r.saleKey, name: r.name }))
}

export function getCategories() {
  const seen = new Map()
  for (const r of RECIPES) {
    if (!seen.has(r.category)) seen.set(r.category, true)
  }
  return [...seen.keys()]
}
