# Jewelcrafting Tracker

`/jewelcrafting` — a cost-vs-profit calculator for leveling Midnight
Jewelcrafting 1-100 on Stormrage-US, with an optional live Auction House
price sync. Built Aug 2026.

## What it does

Answers one question: *what should I craft right now to level efficiently
and at least break even (ideally profit) on the AH?* It's not a general AH
scanner — it's scoped to the JC leveling path specifically, bracket by
bracket, showing material cost vs. sale price per recipe.

- Manual price entry per material (`Xg Ys Zc` text inputs), or one-click
  sync from the live Stormrage-US Auction House.
- Editable crafts-per-recipe count, since the underlying leveling data has
  varying confidence (see below) and in-game reality may differ.
- Cost / sale value / profit computed per recipe, per bracket, and as a
  running 1-100 total. Persisted to `localStorage`.

## Architecture

```
src/pages/Jewelcrafting.jsx    UI — brackets, recipe rows, money inputs, totals
src/data/jewelcrafting.js      the leveling path: brackets → recipes → materials
src/data/wowItemIds.js         material/recipe key → Blizzard item ID
src/lib/money.js               copper ⇄ "Xg Ys Zc" formatting/parsing
netlify/functions/wow-auctions.js   OAuth + AH proxy (holds the Blizzard secret)
```

**Why a backend function at all:** Blizzard's Game Data API auction
endpoints require an OAuth2 Client Credentials token (Client ID + Secret
from [develop.battle.net](https://develop.battle.net/)). The secret can
never reach the browser, so `wow-auctions.js` holds it server-side, does the
token exchange, and proxies just the prices the frontend asks for. This is
the same pattern the site already uses for the Steam API key in
`netlify/functions/steam.js` — nothing new was invented here, just followed.

**Sync flow:** the page reads `WOW_ITEM_IDS`, builds a comma-separated list
of every mapped item ID, and calls
`/.netlify/functions/wow-auctions?items=id1,id2,...`. The function exchanges
the client credentials for a token (cached in-memory per warm function
instance), resolves Stormrage's connected-realm ID once, fetches both
Blizzard auction endpoints, and returns the lowest price per item ID:

- `/data/wow/auctions/commodities` — **region-wide**, not per-realm. This is
  where stackable trade goods (ore, dust, gems, glass — most JC materials)
  actually trade, since patch 9.0 pooled commodity markets region-wide. Easy
  bug to make (I made it) by assuming everything is connected-realm scoped.
- `/data/wow/connected-realm/{id}/auctions` — realm-specific, for
  non-commodity items (crafted gear, jewelry with random stats).

The whole chain (token → realm lookup → both auction fetches → price
lookup) has been tested against the live API with real credentials — not
just written and assumed to work.

## Data confidence

Midnight is a new expansion; leveling guides for it disagree with each
other, sometimes badly. Each bracket in `jewelcrafting.js` carries a
`confidence` flag rendered as a badge on the page:

| Bracket | Confidence | Why |
|---|---|---|
| 1-14 | **Verified** | Two independent guides (ConquestCapped, wow-professions.com) agree exactly on recipes and quantities. |
| 14-50 | **Needs a look** | One detailed source only, not cross-verified. Modeled as a cumulative shopping list rather than a strict recipe order, since trainer unlocks are choice-dependent. |
| 50-65 | **Verified** | Same two-source agreement as 1-14. |
| 65-100 | **Choice-driven** | Genuinely not a fixed path — guides disagree on whether to prioritize gem cuts, profession equipment, or crafting-order jewelry. One material name in this bracket's data (*Petrified Root*) was checked against Blizzard's live item database and **does not exist** — this bracket's recipe list should not be trusted without an in-game check. |

The crafts-per-recipe count is intentionally editable in the UI so bad
estimates are a quick correction, not a rebuild.

## Item ID mapping quirk worth knowing

Every Jewelcrafting material currently exists in Blizzard's item database as
a **duplicate pair** of item IDs sharing the exact same name, priced 2-13x
apart (e.g. Crystalline Glass: 6g88s vs 93g94s). This is almost certainly an
unlabeled crafting-quality tier (Q1 vs Q3) — the item API doesn't expose a
field that names it. `wowItemIds.js` maps the **cheaper** ID of each pair,
on the assumption that a leveling crafter buying materials in bulk reaches
for the cheap version, with the pricier sibling noted in a comment. If a
specific recipe turns out to actually require the expensive tier, that'll
show up as Sync pulling a suspiciously low price for that material — swap
the ID in `wowItemIds.js` and it's fixed everywhere at once.

## TODO

- [ ] **Add `BLIZZARD_CLIENT_ID` / `BLIZZARD_CLIENT_SECRET` to Netlify's
      dashboard** (Site settings → Environment variables). Currently only in
      the local `.env` — production Sync won't work until this is done.
- [ ] **Rotate the Blizzard client secret.** It was pasted into a chat
      session during setup; regenerate it on develop.battle.net once
      everything's confirmed working, so the one in that transcript stops
      being valid.
- [ ] **Verify bracket 65-100 in-game.** *Petrified Root* doesn't exist as
      an item — the recipe materials for "Cut Eversong Diamond" need
      correcting from what you actually see in the crafting window, not
      from guide data. Map `kaleidoscopic-prism`, `eversong-diamond`,
      `cut-eversong-diamond`, and `jewelry-crafting-order` once confirmed.
      Note: `Eversong Diamond` in Blizzard's DB is EPIC quality, which
      smells like the *cut/finished* gem rather than a raw input — check
      whether the recipe input is actually a differently-named rough/uncut
      item.
- [ ] **Double-check bracket 14-50** against your actual trainer unlocks as
      you level through it — it's a cumulative shopping list from a single
      source, not cross-verified.
- [ ] **Confirm the "cheap-ore" quality-tier assumption** — first time you
      prospect at skill 1-14, check whether the AH-synced price roughly
      matches what you're actually buying/mining. If it's off by ~3x,
      you're on the wrong tier of the duplicate pair; swap the ID.
- [ ] **Local testing of Sync requires the Netlify CLI**, not just
      `npm run dev` — Vite's dev server doesn't serve
      `/.netlify/functions/*`. Install `netlify-cli` and run `netlify dev`
      if you want to test Sync without deploying. Not set up yet.
- [ ] *(Optional, later)* auto-refresh Sync every 5 minutes instead of
      manual-only, per the original brief. Trivial `setInterval` addition
      once manual Sync is confirmed solid.
- [ ] *(Optional, later)* map item IDs for non-commodity sellables (cut
      gems, jewelry) if you start selling crafted pieces rather than just
      tracking leveling cost — currently only raw materials are mapped.

## Known non-issue

`npm run build` / `npm run dev` fail on this machine's default Node (v23)
with a `require is not defined` error from `tailwind.config.js`. This
predates the Jewelcrafting Tracker entirely (reproduces on a clean
`main` checkout) — it's an ESM/CJS mismatch between the repo's
`"type": "module"` and Tailwind's config loader, unrelated to this feature.
Works fine under Node 22.
