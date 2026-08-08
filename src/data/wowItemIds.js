// Maps material/recipe keys (from jewelcrafting.js) to real Blizzard item
// IDs, so the "Sync with AH" button knows what to ask the auction house for.
//
// IDs below were resolved directly against Blizzard's live Item Search API
// (namespace=static-us, Aug 2026) and cross-checked against real Stormrage-US
// commodity auction data — not scraped from guide sites, which is what
// caused the earlier live/beta ID confusion.
//
// IMPORTANT — every material below exists as a DUPLICATE PAIR of item IDs
// with the identical name but very different AH prices (2x-13x apart),
// almost certainly a hidden crafting-quality tier (Q1 vs Q3) that Blizzard's
// item API doesn't expose a label for. The ID mapped here is the CHEAPER of
// the pair in each case — the one a leveling crafter buying in bulk would
// actually reach for. The pricier sibling is noted in a comment in case you
// discover in-game that a specific recipe actually consumes the expensive
// tier (right-click the reagent in the crafting window to confirm which
// item ID it wants — an addon like TradeSkillMaster or WoWHead's Dressing
// Room can also show it).
//
// Keys must match the `key` fields in jewelcrafting.js exactly. Any key left
// null is skipped by sync and falls back to manual entry.

export const WOW_ITEM_IDS = {
  // Bracket 1-14
  'cheap-ore': 237359, // mapped to Refulgent Copper Ore specifically; Umbral Tin (237362) and Brilliant Silver (237364) are close substitutes, see below
  'glimmering-gemdust': 242620, // pricier sibling: 242621
  'crystalline-glass': 242787, // pricier sibling: 242786 (note: here the *lower* ID is the expensive one — don't assume ordering)

  // Bracket 14-50
  'refulgent-copper-ore': 237359, // pricier sibling: 237361
  'umbral-tin-ore': 237362, // pricier sibling: 237363
  'brilliant-silver-ore': 237364, // pricier sibling: 237365 — not currently referenced by jewelcrafting.js but mapped for completeness
  'duskshrouded-stone': 242788, // pricier sibling: 242789
  'sanguine-garnet': 242553, // pricier sibling: 242723
  'tenebrous-amethyst': 242606, // pricier sibling: 242721
  'harandar-peridot': 242607, // pricier sibling: 242720
  'amani-lapis': 242554, // pricier sibling: 242722
  'flawless-sanguine-garnet': 242613, // pricier sibling: 242724
  'flawless-tenebrous-amethyst': 242611, // pricier sibling: 242725
  'flawless-harandar-peridot': 242610, // pricier sibling: 242726
  'flawless-amani-lapis': 242612, // pricier sibling: 242727

  // Bracket 65-100 — NOT mapped. "Petrified Root" (used in jewelcrafting.js's
  // Cut Eversong Diamond recipe) does not exist in Blizzard's item database
  // under that name at all — this bracket's material list came from the
  // lowest-confidence guide source and is likely wrong, not just unmapped.
  // Verify the actual reagents for this recipe in-game before trusting it.
  'kaleidoscopic-prism': null, // this one DOES exist (240974/240975, same duplicate-pair pattern) — but per-gem variants also exist (e.g. "Harandar Peridot Prism" 241137/241138), so which one the recipe wants is unconfirmed
  'eversong-diamond': null, // the only "Eversong Diamond" in the DB is EPIC quality — that smells like the CUT/finished gem, not a raw input material, so the recipe's material list may have this backwards
  'cut-eversong-diamond': null,
  'jewelry-crafting-order': null,
}
