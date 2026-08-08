// Maps material/recipe keys (from jewelcrafting.js) to real Blizzard item
// IDs, so the "Sync with AH" button knows what to ask the auction house for.
//
// IDs resolved directly against Blizzard's live Item Search API
// (namespace=static-us) and cross-checked against real Stormrage-US
// commodity auction data — not scraped from guide sites.
//
// IMPORTANT — most materials below exist as a DUPLICATE PAIR of item IDs
// with the identical name but very different AH prices (2x-13x apart),
// almost certainly a hidden crafting-quality tier (Q1 vs Q3) that Blizzard's
// item API doesn't expose a label for. The ID mapped here is the CHEAPER of
// the pair in each case — the one a leveling crafter buying in bulk would
// actually reach for. If a specific recipe turns out to need the expensive
// tier, Sync will show a suspiciously low price for that material — swap
// the ID here and it's fixed everywhere at once.
//
// Keys must match the `key` fields in ../recipes/midnight-jewelcrafting.js
// exactly. Any key left null is skipped by sync and falls back to manual
// entry — the tracker works fine with a partially-filled map.
//
// Moved from src/data/wowItemIds.js as part of the /wow/{expansion}/
// {profession} restructure — see docs/wow-tracker-playbook.md.

export const WOW_ITEM_IDS = {
  // Prospecting/crushing byproducts + core gem-cutting reagents
  'cheap-ore': 237359, // mapped to Refulgent Copper Ore specifically — Umbral Tin and Brilliant Silver below are close substitutes if that's what you're actually prospecting
  'refulgent-copper-ore': 237359, // pricier sibling: 237361
  'umbral-tin-ore': 237362, // pricier sibling: 237363
  'brilliant-silver-ore': 237364, // pricier sibling: 237365
  'glimmering-gemdust': 242620, // pricier sibling: 242621
  'crystalline-glass': 242787, // pricier sibling: 242786 (here the *lower* ID is the expensive one — don't assume ordering)
  'duskshrouded-stone': 242788, // pricier sibling: 242789

  // Base gems
  'sanguine-garnet': 242553, // pricier sibling: 242723
  'tenebrous-amethyst': 242606, // pricier sibling: 242721
  'harandar-peridot': 242607, // pricier sibling: 242720
  'amani-lapis': 242554, // pricier sibling: 242722

  // Flawless gems
  'flawless-sanguine-garnet': 242613, // pricier sibling: 242724
  'flawless-tenebrous-amethyst': 242611, // pricier sibling: 242725
  'flawless-harandar-peridot': 242610, // pricier sibling: 242726
  'flawless-amani-lapis': 242612, // pricier sibling: 242727

  // Reagents-category crafted materials (used as inputs to other recipes)
  'kaleidoscopic-prism': 240974, // pricier sibling: 240975. Recipe itself needs 4 different Flawless gems + 10 Glimmering Gemdust — expensive to make, budget accordingly
  'sindorei-lens': null, // Sin'dorei Lens is BoE/sellable (has its own saleKey below) but also consumed as a material in ~10 other recipes — no commodity/regular-auction ID resolved yet, it's a crafted item so may need the per-realm (non-commodity) auction endpoint rather than commodities
  'eversong-diamond': 242608, // pricier sibling: 242712. Confirmed as a genuine raw-cut input material (feeds the 4 "[Adjective] Eversong Diamond" recipes), not the finished item as originally suspected
  'petrified-root': 251285, // correction: this DOES exist, my first search was scoped to too narrow an ID range (capped at 250000) and missed it. Used as a finishing-style reagent across many Flawless-tier recipes. Not cheap — ~570g/unit at time of research
  'mote-of-light': 236949,
  'mote-of-primal-energy': 236950,
  'mote-of-pure-void': 236952,
  'mote-of-wild-magic': 236951,

  // Ring/amulet/tool-tier materials
  'tormented-tantalum': 251283, // ~840g/unit — endgame ring/amulet material, not a leveling-budget item
  'dawn-crystal': 243605, // pricier sibling: 243606
  'silvermoon-weapon-wrap': 244637, // pricier sibling: 244638
  'void-tempered-hide': 238518, // pricier sibling: 238519
  'infused-scalewoven-hide': 244633, // pricier sibling: 244634
  'majestic-hide': 238529,
  'infused-heliotrope': 253307,
  'silverleaf-thread': 251665,

  // NOT mapped — no stable item behind the name
  'spark': null, // "Spark" is almost certainly a placeholder for a specific "Spark of [X]" catalyst item that changes by content patch/season — no plain "Spark" item exists in Blizzard's database. Find the current real name in-game (check what the recipe's reagent slot actually shows) and add it here.
  'competitors-heraldry': null, // same issue — Blizzard's DB has no "Competitor's Heraldry", only season-specific names (currently "Galactic [Rank]'s Heraldry"). This is PvP season content that renames itself; not worth hardcoding an ID that'll go stale.
  'fused-vitality': null, // exists (245345 / 274267) but neither has any active Auction House listings — likely BoP or otherwise untradeable, not just illiquid. Don't treat a 0 price as real if you wire this up later.
  'thalassian-lumber': null, // exists (256963) but no active AH listings either — likely a Housing-gathering material that doesn't trade normally.
}
