# Leatherworking Tracker

`/wow/midnight/leatherworking` — the full Midnight Leatherworking recipe
database for Stormrage-US, with skill requirements, how each recipe is
learned, exact materials, and live cost-vs-profit math against the real
Auction House. Built Aug 2026 alongside Blacksmithing — see
[`wow-tracker-playbook.md`](./wow-tracker-playbook.md) for the general
process this followed.

## What it does

Same feature set as [the Jewelcrafting tracker](./jewelcrafting-tracker.md):
for every real Leatherworking recipe in Midnight (101 of them — see "What's
excluded" below), what skill level it needs, how you learn it, its exact
materials, and cost-vs-AH-sale-value math once prices are entered or synced.

## Architecture

Identical to Jewelcrafting's — `ProfessionTracker.jsx` needed zero changes.
Adding this profession was one `registry.js` entry plus:

```
src/data/wow/recipes/midnight-leatherworking.js  RECIPES + LEARN_METHODS
src/data/wow/itemIds/midnight-leatherworking.js  WOW_ITEM_IDS
```

## Where the recipe data came from

Blizzard's Game Data API gave the authoritative recipe list via
`/data/wow/profession/165/skill-tier/2915` (165 = Leatherworking, 2915 =
the Midnight skill tier). Reagents/skill-level/learn-method came from
`warcraft.wiki.gg` where pages existed, with Wowhead spell tooltips as
fallback — Leatherworking needed the fallback far more than Blacksmithing
did; a large chunk of the Mail Armor and Competitor's sets had no live wiki
page at research time (very new patch content, wiki coverage lags).

Item IDs were resolved against Blizzard's live Item Search API. A chunk of
materials (motes, Petrified Root, Duskshrouded Stone, Tormented Tantalum,
Void-Tempered Hide, Infused Scalewoven Hide, Majestic Hide, Silverleaf
Thread, Glimmering Gemdust, Thalassian Lumber) were already resolved during
the Jewelcrafting pass and reused here; Sterling Alloy, Gloaming Alloy,
Majestic Claw, Majestic Fin, and Sin'dorei Armor Banding were resolved
during the Blacksmithing pass in the same session and are shared between
both files.

## What's excluded

Same categories as Jewelcrafting: **"Appendix I - Terms" / "Appendix II -
Stats"** (9 of Blizzard's 111 listed recipes) and **"Recraft Equipment"**.
That leaves 101 real recipes across 10 categories: Leather Armor,
Competitor's Leather Armor, Mail Armor, Competitor's Mail Armor, Armor
Kits, Consumables, Profession Equipment, Reagents, House Decor, Mounts.

## Data confidence — known gaps, not guesses

This file has meaningfully more `null` fields than Jewelcrafting or
Blacksmithing — Leatherworking's wiki coverage was the thinnest of the
three at research time. Specifics worth knowing before trusting a number:

- **`skillProgression` is null far more often here.** Midnight appears to
  have moved away from the classic orange/yellow/green/gray skill-up-color
  mechanic for most Leatherworking recipes specifically — only a handful of
  recipes (mostly House Decor and a few Reagents) had a published curve at
  all. Don't read the high null-rate as a research gap; it may just be how
  this profession's data is published this patch.
- **The 16-piece Competitor's Leather/Mail Armor PvP set** is gated behind
  a vendor (Mirvedon, Silvermoon City, ~7,500 Honor per pattern), but
  skill level/progression/BoE-BoP status could only be confirmed for 2 of
  the 16 (both Mail pieces, skill 50) — the other 14 had red-link wiki
  pages (not yet written) at research time. Their materials are known
  (pulled from Wowhead tooltips), just not the unlock/binding metadata.
- **The 8 "Farstrider's" Mail Armor recipes** are gated behind the
  Safeguarding Scales specialization node rather than a flat skill level —
  no specific skill-level number is published anywhere, so all 8 have
  `skillLevelRequired: null` with `learnMethod.type: "specialization"`.
- **`Fused Vitality` quantities are ambiguous** across ~8 Profession
  Equipment recipes — sources showed two different item IDs both labeled
  "Fused Vitality," one needing qty 20 and one qty 40 (likely a hidden
  reagent-quality tier, the same pattern as the duplicate-ID materials
  below but for a *quantity* rather than a price). qty 20 was recorded as
  the primary value; treat as approximate.
- **`spark` and `spark-of-the-void`** appear as two distinctly-named
  reagents on different recipe families (Leather Armor vs. Mail Armor).
  Unclear whether these are the same underlying item under different
  display names or genuinely different reagents — neither resolves to a
  stable item ID, and both are left unmapped rather than guessing they're
  the same thing.
- **`Broken Lynx Leash`** (required for the one Mounts recipe, Rope Lynx
  Harness) resolves to a real item (272392) but has zero commodity AH
  listings — it's awarded directly from Tier 5 Ritual Site completions,
  not something bought/sold on the open market. Left unmapped, same
  treatment as Jewelcrafting's `Fused Vitality`/`Thalassian Lumber`.
- Two recipes (**Plush Haranir Leather Pillow**, **Haranir Canopy Bed**)
  had a warcraft.wiki.gg extraction that produced wrong reagent
  quantities on first fetch — caught via cross-checking against Wowhead
  and housing.wowdb.com, and corrected to the two-source-agreement values
  before this file was compiled.

## Item ID mapping quirks worth knowing

Same duplicate-pair pattern as Jewelcrafting — two item IDs, identical
name, different price. Unlike Jewelcrafting and Blacksmithing, **the
cheaper ID is not consistently the lower or higher number** — each pair in
`itemIds/midnight-leatherworking.js` was checked individually against live
commodity data rather than assumed to follow the same ordering throughout
(e.g. Void-Tempered Scales: the *higher* ID is cheaper; Composite Flora:
the *lower* ID is the expensive one).

## TODO

- [ ] **Map item IDs for sellable crafted outputs** — same gap as
      Jewelcrafting/Blacksmithing.
- [ ] **Re-check the 14 unconfirmed Competitor's PvP pieces** once
      warcraft.wiki.gg has pages for them (skill level, progression, BoE
      status all currently null).
- [ ] **Determine whether `spark` and `spark-of-the-void` are the same
      item** — would let one of the two null mappings resolve the other.
- [ ] **Confirm `Fused Vitality`'s real per-recipe quantity** (20 vs. 40 —
      likely a reagent-quality-tier choice, not a fixed number).
