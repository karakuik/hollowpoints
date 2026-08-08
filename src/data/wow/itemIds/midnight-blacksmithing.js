// Maps material/recipe keys (from midnight-blacksmithing.js) to real
// Blizzard item IDs, so the "Sync with AH" button knows what to ask the
// auction house for.
//
// IDs resolved directly against Blizzard's live Item Search API
// (namespace=static-us) and cross-checked against real Stormrage-US
// commodity auction data — not scraped from guide sites. Several keys
// (motes, Petrified Root, Duskshrouded Stone, Tormented Tantalum,
// Silvermoon Weapon Wrap, ore types, Thalassian Lumber, Spark,
// Competitor's Heraldry) were already resolved during the Jewelcrafting
// pass and are shared/reused here rather than re-searched — see
// ../recipes/midnight-jewelcrafting.js's item-ID file for their original
// research notes.
//
// IMPORTANT — most materials below exist as a DUPLICATE PAIR of item IDs
// with the identical name but very different AH prices (roughly 2x apart),
// almost certainly a hidden crafting-quality tier that Blizzard's item API
// doesn't expose a label for. The ID mapped here is the CHEAPER of the pair
// in each case — the one a leveling crafter buying in bulk would actually
// reach for. If Sync ever shows a suspiciously low price for a material,
// that recipe may actually need the pricier sibling.
//
// Keys must match the `key` fields in ../recipes/midnight-blacksmithing.js
// exactly. Any key left null is skipped by sync and falls back to manual
// entry — the tracker works fine with a partially-filled map.

export const WOW_ITEM_IDS = {
  // Ores (shared with Jewelcrafting's smelting/prospecting chain)
  'refulgent-copper-ore': 237359, // pricier sibling: 237361 (same mapping as Jewelcrafting)
  'umbral-tin-ore': 237362, // pricier sibling: 237363
  'brilliant-silver-ore': 237364, // pricier sibling: 237365

  // Smelted bars/alloys — new to Blacksmithing
  'refulgent-copper-ingot': 238197, // pricier sibling: 238198
  'gloaming-alloy': 238202, // pricier sibling: 238203
  'sterling-alloy': 238204, // pricier sibling: 238205
  'luminant-flux': 243060, // single ID, no duplicate pair found

  // Crafted intermediate reagents
  'dazzling-thorium': 237366, // single ID, no duplicate pair found
  'majestic-claw': 238528, // single ID — Trade Tools subspecialization reagent
  'majestic-fin': 238530, // single ID — Trade Tools subspecialization reagent
  'majestic-hide': 238529, // shared with Jewelcrafting/Leatherworking mapping
  'sindorei-armor-banding': 244635, // pricier sibling: 244636 — shared reagent, also used by Leatherworking armor recipes
  'silvermoon-weapon-wrap': 244637, // already resolved during Jewelcrafting research
  'duskshrouded-stone': 242788, // already resolved during Jewelcrafting research
  'petrified-root': 251285, // already resolved during Jewelcrafting research — see that file's note on the ID-range gotcha
  'tormented-tantalum': 251283, // already resolved during Jewelcrafting research — ~840g/unit, endgame-tier material
  'thalassian-lumber': null, // exists (256963, confirmed during Jewelcrafting research) but no active AH listings — likely a Housing-gathering material that doesn't trade normally

  // NOT mapped — no stable item behind the name
  'sparks': null, // "Sparks" (also seen singular "Spark" in Jewelcrafting/Leatherworking) does not resolve to any real item in Blizzard's database in a direct-name search across the full Midnight item ID range — almost certainly a placeholder for a specific catalyst item whose real name isn't "Spark(s)" verbatim. Find the current real name in-game and map it if/when needed.
  'competitors-heraldry': null, // same issue as Jewelcrafting — Blizzard's DB has no "Competitor's Heraldry", only season-specific names (e.g. "Galactic [Rank]'s Heraldry"). PvP season content that renames itself; not worth hardcoding an ID that'll go stale.
  'fused-vitality': null, // exists (245345 / 274267, confirmed during Jewelcrafting research) but neither has any active Auction House listings — likely BoP or otherwise untradeable, not just illiquid.
}
