# Jewelcrafting Tracker

`/wow/midnight/jewelcrafting` — the full Midnight Jewelcrafting recipe
database for Stormrage-US, with skill requirements, how each recipe is
learned, exact materials, and live cost-vs-profit math against the real
Auction House. Built Aug 2026; expanded from a curated 1-100 leveling path
to the complete 79-recipe database the same week, then migrated from
`/jewelcrafting` to the `/wow/{expansion}/{profession}` structure (old URL
redirects) so more professions/expansions can slot in as siblings.

For the general process behind this (finding a profession's recipe list,
researching reagents/unlock methods, resolving item IDs, managing research
at scale) written up as a repeatable playbook — useful if this ever expands
to other professions or expansions — see
[`wow-tracker-playbook.md`](./wow-tracker-playbook.md).

## What it does

For every real Jewelcrafting recipe in Midnight (79 of them — see
"What's excluded" below): what skill level it needs, how you actually learn
it (trainer, specialization points, a Design item, or a rare drop), its
exact materials, and — once you enter or sync prices — cost to craft vs. AH
sale value per craft. A "Recommended right now" section at the top
auto-surfaces whichever sellable recipes are currently profitable, sorted by
skill level, instead of following one fixed guide path.

- Manual price entry per material (`Xg Ys Zc` text inputs), or one-click
  sync from the live Stormrage-US Auction House for the ~30 materials with a
  resolved item ID.
- Cost / sale value / profit computed per craft. No fixed "how many crafts
  to clear this bracket" assumption anymore — that only ever applied to a
  hand-picked leveling path, not the full recipe list.
- Persisted to `localStorage`.

## Architecture

```
src/pages/wow/WowHub.jsx                       /wow — pick an expansion+profession card
src/pages/wow/ProfessionTracker.jsx            /wow/:expansion/:profession — generic tracker UI
src/data/wow/registry.js                       list of available expansion+profession combos
src/data/wow/recipes/midnight-jewelcrafting.js RECIPES + LEARN_METHODS: the full recipe database
src/data/wow/itemIds/midnight-jewelcrafting.js WOW_ITEM_IDS: material/recipe key → Blizzard item ID
src/lib/money.js                               copper ⇄ "Xg Ys Zc" formatting/parsing
netlify/functions/wow-auctions.cjs             OAuth + AH proxy (holds the Blizzard secret) — generic, not profession-specific
```

`ProfessionTracker.jsx` reads `:expansion`/`:profession` from the route,
looks the combo up in `registry.js`, and dynamic-`import()`s its recipe and
item-ID modules — see
[`wow-tracker-playbook.md`](./wow-tracker-playbook.md#url--file-structure)
for the reasoning behind this structure. Adding a second profession or
expansion means adding one data-file pair plus one `registry.js` entry, no
UI or backend changes.

Recipe/material rows show the real in-game item icon (Blizzard's Media API,
proxied through `wow-auctions.cjs?items=...&media=1` and cached in-memory
per warm function instance) and prices render as `MoneyDisplay` — actual
gold/silver/copper coin swatches — instead of plain `Xg Ys Zc` text.

**Why a backend function at all:** Blizzard's Game Data API auction
endpoints require an OAuth2 Client Credentials token (Client ID + Secret
from [develop.battle.net](https://develop.battle.net/)). The secret can
never reach the browser, so `wow-auctions.js` holds it server-side, does the
token exchange, and proxies just the prices the frontend asks for. Same
pattern the site already used for the Steam API key in
`netlify/functions/steam.js`.

Netlify's function runtime enforces the repo's root `"type": "module"` the
same way Node does locally — a plain `.js` file using `exports.handler =`
throws `ReferenceError: module is not defined` in production. Both
`wow-auctions.js` and the pre-existing `steam.js` hit this; `wow-auctions`
was fixed by renaming to `.cjs` (always CommonJS regardless of
`package.json`, and Netlify strips the extension for the function's URL
either way). `steam.js` still has the bug as of this writing — the Now
page's Steam widget is 502ing in production, unrelated to this feature.

**Sync flow:** the page reads `WOW_ITEM_IDS`, builds a comma-separated list
of every mapped item ID, and calls
`/.netlify/functions/wow-auctions?items=id1,id2,...`. The function exchanges
the client credentials for a token (cached in-memory per warm function
instance), resolves Stormrage's connected-realm ID once, fetches both
Blizzard auction endpoints, and returns the lowest price per item ID:

- `/data/wow/auctions/commodities` — **region-wide**, not per-realm. Where
  stackable trade goods (ore, dust, gems, glass — most raw JC materials)
  actually trade, since patch 9.0 pooled commodity markets region-wide.
- `/data/wow/connected-realm/{id}/auctions` — realm-specific, for
  non-commodity items (crafted gear, jewelry with random stats).

The whole chain has been tested against the live API with real credentials,
including a full round-trip through the deployed production function.

## Where the recipe data came from

Blizzard's Game Data API gives the authoritative recipe list — id, name,
category — via `/data/wow/profession/755/skill-tier/2914` (755 =
Jewelcrafting, 2914 = the Midnight skill tier). **It does not expose
reagents, skill-level requirements, or how a recipe is learned at all** —
that's not a gap in this research, it's a real limitation of the public API.
That data was gathered recipe-by-recipe from `warcraft.wiki.gg` (primary —
structured crafting infoboxes, not JS-rendered) and Wowhead spell tooltips
(fallback), cross-checked against live Stormrage-US AH data where possible.

## What's excluded

- **"Appendix I - Terms" / "Appendix II - Stats"** (9 of Blizzard's 89
  listed recipes) — these are in-game glossary tooltips (*Quality*,
  *Sparks*, *Concentration*, *Skill*, *Multicraft*...), not real crafts.
- **"Recraft Equipment"** — not a materials-in/item-out recipe. It's WoW's
  cross-profession item-upgrade system (modify an already-crafted item's
  optional reagents/embellishments in place), unlocked automatically by
  knowing the item's base recipe. Doesn't fit this data model at all.

That leaves 79 real recipes, all present in the tracker.

## Data confidence — known gaps, not guesses

- **All 18 Lustrous Lapis / Austere Amethysts recipes** have no
  `warcraft.wiki.gg` page yet (very new patch content, Feb 2026) — their
  `skillLevelRequired`, `skillProgression`, and `learnMethod` are `null`.
  Materials are known (pulled from live Wowhead tooltips), just not the
  unlock info. Re-check in a few weeks once wiki coverage catches up.
- **Midnight Crushing**'s material is genuinely ambiguous *on the source
  itself* — the ability tooltip says "crush 3 gems," the structured recipe
  data on the same page says "1x Duskshrouded Stone." Not a scraping error;
  the wiki page contradicts itself. Verify in-game.
- **Gleaming Copper Band** has no dedicated wiki page at all — skill level
  came from a secondary guide, sellability is unconfirmed.
- A handful of PvP/ring recipes (`Loa Worshiper's Band`,
  `Signet of Azerothian Blessings`, a few Competitor's Crafts) only had
  "how to acquire the Design" pages indexed, not the crafted-item page, so
  their skill-up progression is `null`.
- Where a field is genuinely unknown, it's `null` in the data and rendered
  as "Skill unknown" / an "Unknown" learn-method badge in the UI — never a
  guessed number.

## Item ID mapping quirks worth knowing

- **Duplicate-pair IDs.** Most materials exist in Blizzard's item database
  as two entries with the identical name, priced 2-13x apart — almost
  certainly an unlabeled crafting-quality tier (Q1 vs Q3) the item API
  doesn't expose a field for. `itemIds/midnight-jewelcrafting.js` maps the **cheaper** ID of
  each pair. If Sync ever shows a suspiciously low price for a material,
  that recipe may actually need the pricier sibling — both IDs are noted in
  a comment next to each mapping.
- **`Petrified Root` really does exist** (item 251285) — an earlier research
  pass concluded it didn't, because that search was capped at item ID
  250000. Worth remembering: a negative result from a range-limited search
  isn't proof of non-existence.
- **`Spark` and `Competitor's Heraldry` aren't mappable as named.** Both are
  almost certainly placeholders for a specific "Spark of [X]" /
  season-specific heraldry item that changes by patch or PvP season (the
  live DB currently has "Galactic [Rank]'s Heraldry," not "Competitor's
  Heraldry"). Hardcoding an ID for either would go stale on its own. Find
  the actual current name in-game and map it if/when you craft something
  that needs it.
- **`Fused Vitality` and `Thalassian Lumber`** resolve to real item IDs but
  have zero active Auction House listings — likely BoP or otherwise
  untradeable rather than just illiquid. Left unmapped rather than treating
  "no listings" as a 0 price.
- **Crafted-item (sellable output) prices are not synced yet** — only the
  ~30 raw/intermediate materials have resolved item IDs. Sale prices are
  manual-entry only for now. See TODO.

## TODO

- [ ] **Add `BLIZZARD_CLIENT_ID` / `BLIZZARD_CLIENT_SECRET` to Netlify's
      dashboard** if not already done (Site settings → Environment
      variables) — confirmed working in production as of this write-up.
- [ ] **Rotate the Blizzard client secret** if it was ever pasted into a
      chat session — regenerate on develop.battle.net so the old one stops
      being valid.
- [ ] **Fix `steam.js`** — same `.js` → `.cjs` fix that resolved
      `wow-auctions.js`'s production crash. Separate from this feature but
      currently broken (502) on the live site.
- [ ] **Map item IDs for sellable crafted outputs** (62 recipes currently
      have `sellable: true` but no resolved item ID for their own output) —
      needed for the "Recommended right now" section to populate itself
      without manual sale-price entry. Likely needs the non-commodity
      per-realm auctions endpoint for BoE gear/jewelry, not just commodities.
- [ ] **Re-check the 18 Lapis/Amethyst recipes' skill levels** once
      `warcraft.wiki.gg` has pages for them.
- [ ] **Verify Midnight Crushing's real reagent in-game** (gems vs.
      Duskshrouded Stone — the source contradicts itself).
- [ ] **Find current names for `Spark` and `Competitor's Heraldry`** in-game
      and map them once known, if you craft anything that needs them.
- [ ] **Local testing of Sync requires the Netlify CLI**, not just
      `npm run dev` — Vite's dev server doesn't serve
      `/.netlify/functions/*`. Not set up yet.
- [ ] *(Optional, later)* auto-refresh Sync every 5 minutes instead of
      manual-only.

## Known non-issue

`npm run build` / `npm run dev` fail on this machine's default Node (v23)
with a `require is not defined` error from `tailwind.config.js`. Predates
this feature entirely (reproduces on a clean `main` checkout) — an ESM/CJS
mismatch between the repo's `"type": "module"` and Tailwind's config loader.
Works fine under Node 22.
