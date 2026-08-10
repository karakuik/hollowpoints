// Maps material keys (from classic-blacksmithing.js) to real Blizzard item
// IDs, so the "Sync with AH" button knows what to ask the auction house for.
//
// This is retail's "Classic Blacksmithing" skill tier (profession id 164,
// skill-tier id 2477) — the legacy 1-300 vanilla recipe line still craftable
// on a live retail character on Stormrage-US, NOT a separate Classic Era
// ruleset server. Confirmed via GET /data/wow/profession/164 (static-us),
// which lists "Classic Blacksmithing" as a skill tier alongside "Midnight
// Blacksmithing" on the exact same character/realm.
//
// IDs resolved directly against Blizzard's live Item Search API
// (namespace=static-us). Unlike Midnight's materials, none of these classic
// mats had a duplicate-ID pair — old items, one stable ID each.

export const WOW_ITEM_IDS = {
  'rough-stone': 2835,
  'copper-bar': 2840,
  'silver-bar': 2842,
  'rough-grinding-stone': 3470,
  'heavy-stone': 2838,
  'gold-bar': 3577,
  'heavy-grinding-stone': 3486,
  'steel-bar': 3859,
  'solid-stone': 7912,
  'truesilver-bar': 6037,
  'solid-grinding-stone': 7966,
  'mithril-bar': 3860,
  'mageweave-cloth': 4338,
  'dense-stone': 12365,
  'thorium-bar': 12359,
  'star-ruby': 7910,
}
