// Maps material/recipe keys (from midnight-leatherworking.js) to real
// Blizzard item IDs, so the "Sync with AH" button knows what to ask the
// auction house for.
//
// IDs resolved directly against Blizzard's live Item Search API
// (namespace=static-us) and cross-checked against real Stormrage-US
// commodity auction data — not scraped from guide sites. Several keys
// (motes, Petrified Root, Duskshrouded Stone, Tormented Tantalum, Void-
// Tempered Hide, Infused Scalewoven Hide, Majestic Hide, Silverleaf
// Thread, Glimmering Gemdust, Thalassian Lumber, Spark, Competitor's
// Heraldry) were already resolved during the Jewelcrafting pass and are
// shared/reused here rather than re-searched. Sterling Alloy, Gloaming
// Alloy, Majestic Claw, Majestic Fin, and Sin'dorei Armor Banding were
// resolved during the Blacksmithing pass in this same session and are
// shared with that file too — see ../recipes/midnight-jewelcrafting.js's
// and midnight-blacksmithing.js's item-ID files for original research
// notes.
//
// IMPORTANT — most materials below exist as a DUPLICATE PAIR of item IDs
// with the identical name but very different AH prices, almost certainly a
// hidden crafting-quality tier that Blizzard's item API doesn't expose a
// label for. The ID mapped here is the CHEAPER of the pair in each case —
// the one a leveling crafter buying in bulk would actually reach for.
// Ordering is NOT consistent (sometimes the lower numeric ID is cheaper,
// sometimes the higher one is) — each pair was checked individually against
// live commodity data, not assumed.
//
// Keys must match the `key` fields in ../recipes/midnight-leatherworking.js
// exactly. Any key left null is skipped by sync and falls back to manual
// entry — the tracker works fine with a partially-filled map.

export const WOW_ITEM_IDS = {
  // Core tanning/hide-working chain — new to Leatherworking
  'void-tempered-leather': 238511, // pricier sibling: 238512
  'void-tempered-scales': 238514, // pricier sibling: 238513 — here the *higher* ID is the cheaper one, ordering isn't consistent
  'void-tempered-plating': 238520, // pricier sibling: 238521
  'void-tempered-hide': 238518, // already resolved during Jewelcrafting research
  'scalewoven-hide': 244631, // pricier sibling: 244632
  'infused-scalewoven-hide': 244633, // already resolved during Jewelcrafting research
  'majestic-hide': 238529, // shared mapping with Blacksmithing/Jewelcrafting

  // Trim/finishing reagents
  'silverleaf-thread': 251665, // already resolved during Jewelcrafting research
  'peerless-plumage': 238522, // single ID, no duplicate pair found
  'fantastic-fur': 238525, // single ID, no duplicate pair found
  'carving-canine': 238523, // single ID, no duplicate pair found
  'smugglers-enchanted-edge': 243737, // pricier sibling: 243738
  'sindorei-armor-banding': 244635, // pricier sibling: 244636 — shared mapping with Blacksmithing

  // Alchemy/herbalism-adjacent crafted reagents (Profession Equipment set)
  'composite-flora': 241281, // pricier sibling: 241280 — here the *lower* ID is the expensive one
  'aetherlume': 243578, // pricier sibling: 243579
  'tranquility-bloom': 236761, // pricier sibling: 236767
  'nocturnal-lotus': 236780, // single ID, no duplicate pair found
  'glimmering-gemdust': 242620, // already resolved during Jewelcrafting research

  // Metal alloys, shared with Blacksmithing's smelting chain
  'sterling-alloy': 238204, // pricier sibling: 238205 — same mapping as Blacksmithing
  'gloaming-alloy': 238202, // pricier sibling: 238203 — same mapping as Blacksmithing
  'majestic-claw': 238528, // same mapping as Blacksmithing
  'majestic-fin': 238530, // same mapping as Blacksmithing

  // Motes / general crafting reagents, shared with Jewelcrafting
  'mote-of-light': 236949,
  'mote-of-primal-energy': 236950,
  'mote-of-pure-void': 236952,
  'mote-of-wild-magic': 236951,
  'petrified-root': 251285,
  'duskshrouded-stone': 242788,
  'tormented-tantalum': 251283,
  'thalassian-lumber': null, // exists (256963) but no active AH listings — likely a Housing-gathering material, same as noted in Jewelcrafting/Blacksmithing

  // NOT mapped — no stable item behind the name, or genuinely untradeable
  'spark': null, // same issue as Jewelcrafting/Blacksmithing — no plain "Spark" item exists; placeholder for a specific catalyst item.
  'spark-of-the-void': null, // distinctly-named from plain "Spark" on its source page, but also does not resolve to any real item in a full-range name search — likely the same kind of season/patch placeholder, or possibly the same underlying item as 'spark' under a different display context. Left unmapped rather than guessing either way.
  'competitors-heraldry': null, // same issue as Jewelcrafting/Blacksmithing — no "Competitor's Heraldry" item exists, only season-specific names.
  'fused-vitality': null, // exists (245345 / 274267) but no active Auction House listings — likely BoP or otherwise untradeable.
  'broken-lynx-leash': null, // exists (272392, confirmed via item search) but does not appear in live commodity AH data — matches the research notes that it's awarded directly from Tier 5 Ritual Site completions, not something bought/sold on the open market.
}
