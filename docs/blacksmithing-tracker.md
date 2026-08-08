# Blacksmithing Tracker

`/wow/midnight/blacksmithing` — the full Midnight Blacksmithing recipe
database for Stormrage-US, with skill requirements, how each recipe is
learned, exact materials, and live cost-vs-profit math against the real
Auction House. Built Aug 2026 alongside Leatherworking, as the first test of
the `/wow/{expansion}/{profession}` structure scaling past one profession —
see [`wow-tracker-playbook.md`](./wow-tracker-playbook.md) for the general
process this followed.

## What it does

Same feature set as [the Jewelcrafting tracker](./jewelcrafting-tracker.md):
for every real Blacksmithing recipe in Midnight (96 of them — see "What's
excluded" below), what skill level it needs, how you learn it, its exact
materials, and cost-vs-AH-sale-value math once prices are entered or synced.

## Architecture

Identical to Jewelcrafting's — `ProfessionTracker.jsx` needed zero changes.
Adding this profession was one `registry.js` entry plus:

```
src/data/wow/recipes/midnight-blacksmithing.js  RECIPES + LEARN_METHODS
src/data/wow/itemIds/midnight-blacksmithing.js  WOW_ITEM_IDS
```

## Where the recipe data came from

Blizzard's Game Data API gave the authoritative recipe list via
`/data/wow/profession/164/skill-tier/2907` (164 = Blacksmithing, 2907 = the
Midnight skill tier — resolved directly this time instead of guessed, since
the credentials in `.env` were already there from the Jewelcrafting work).
Reagents/skill-level/learn-method came from `warcraft.wiki.gg` (primary —
no Wowhead fallback was needed for any of the 96 recipes; every one had a
live wiki page by research time).

Item IDs were resolved against Blizzard's live Item Search API. Several
materials (motes, Petrified Root, Duskshrouded Stone, Tormented Tantalum,
Silvermoon Weapon Wrap, the three raw ore types, Thalassian Lumber) were
already resolved during the Jewelcrafting pass and reused here rather than
re-searched — Blacksmithing and Jewelcrafting share a chunk of the
Midnight crafting-material economy (ore/smelting chain especially).

## What's excluded

Same categories as Jewelcrafting: **"Appendix I - Terms" / "Appendix II -
Stats"** (9 of Blizzard's 106 listed recipes — in-game glossary tooltips)
and **"Recraft Equipment"** (the cross-profession item-upgrade system, not
a materials-in/item-out craft). That leaves 96 real recipes across 8
categories: Profession Equipment, Weapons, Armor, Competitor's Plate (PvP),
Stonework, Smelting, Other, House Decor.

## Data confidence — known gaps, not guesses

- **`sparks`** (the material key, distinct from Jewelcrafting's lowercase
  `spark`) doesn't resolve to any real item in a full-range Blizzard item
  search — same placeholder pattern as Jewelcrafting's unmapped `Spark`.
  Used as a reagent across ~15 endgame (skill 50/100) Weapons and Armor
  recipes; left unmapped in `WOW_ITEM_IDS`.
- **`Dawnforged Long Blade`**'s skill-up progression (`[25,35,50,45]`) is
  out of monotonic order on its warcraft.wiki.gg source — verified twice,
  including raw wikitext, and it's a genuine upstream data error, not a
  scraping mistake. Recorded as-fetched rather than "corrected" to a guess.
- **`Thalassian Master Repair Hammer`**'s source page states a learn
  requirement of skill 25 but a skill-up progression starting at 50 — the
  two numbers on the same page don't agree. Recorded as-fetched; worth an
  in-game check if it matters for leveling-cost math.
- **13 of the 16 "Competitor's Plate (PvP)" recipes** have their vendor
  detail (Mirvedon, Silvermoon City, 7,500 Honor) inferred from 3 directly
  confirmed samples (a weapon and two armor-slot types) rather than
  individually re-verified — no divergence was found in the 3 that were
  checked, but flagging the inference basis.
- Where a field is genuinely unknown, it's `null` in the data — Blacksmithing
  had noticeably fewer unresolved fields than Leatherworking's PvP set,
  since warcraft.wiki.gg coverage was more complete for this profession by
  research time.

## Item ID mapping quirks worth knowing

Same duplicate-pair pattern as Jewelcrafting (two item IDs, identical name,
different price — an unlabeled crafting-quality tier). All new
Blacksmithing materials map to the cheaper of their pair. See
`itemIds/midnight-blacksmithing.js` for the full list and pricier-sibling
IDs in comments next to each mapping.

`thalassian-lumber`, `fused-vitality`, `competitors-heraldry`, and `sparks`
are left unmapped for the same reasons documented in the Jewelcrafting
tracker doc (no active AH listings, or no stable item behind the name).

## TODO

- [ ] **Map item IDs for sellable crafted outputs** — same gap as
      Jewelcrafting; only raw/intermediate materials are synced today.
- [ ] **Find the real name behind `sparks`** in-game if a recipe needing it
      becomes relevant.
- [ ] **Verify `Thalassian Master Repair Hammer`'s skill requirement**
      in-game (source page internally disagrees, see above).
