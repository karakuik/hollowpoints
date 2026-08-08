# WoW Tracker — expansion playbook

How the Jewelcrafting Tracker (`/jewelcrafting`, see
[`jewelcrafting-tracker.md`](./jewelcrafting-tracker.md) for its specific
architecture and data) was actually built, written up as a repeatable
process — for when there's appetite to add more professions and/or more
expansions.

## What exists today, in one line

One profession (Jewelcrafting), one expansion (Midnight), one realm
(Stormrage-US), 79 recipes, backed by a Netlify function that's already
generic enough to not need touching for the next profession.

## The reusable pattern

### 1. Backend — already done, already generic

`netlify/functions/wow-auctions.cjs` holds the Blizzard OAuth Client
Credentials secret, resolves a connected-realm ID, and returns lowest AH
price per requested item ID. It knows nothing about Jewelcrafting
specifically — it just takes `?items=id1,id2,...` and returns prices. Adding
a profession or expansion needs **zero changes here**, only new item IDs
fed into it from the frontend.

One thing to remember if this ever gets copied for a different site/repo:
Netlify's Lambda runtime enforces the repo's `package.json`
`"type": "module"` the same way Node does locally — a CommonJS function
must be named `.cjs`, not `.js`, or it 502s in production while looking
completely fine in local dev. Cost real time to catch because local
`npm run dev` doesn't hit this — only the actual deployed function does.

### 2. Finding the recipe list — Blizzard's API, straightforward

```
GET /data/wow/profession/index                                → find profession id
GET /data/wow/profession/{id}                                 → find skill_tiers (one per expansion)
GET /data/wow/profession/{id}/skill-tier/{tierId}              → categories → recipes (id + name only)
```

For Jewelcrafting in Midnight: profession id `755`, skill tier id `2914`,
89 listed recipes across 16 categories.

**Blizzard's API stops there.** `GET /data/wow/recipe/{id}` returns only
`name` + `description` — no reagents, no skill-level requirement, no crafted
item, no unlock method. This isn't a research gap, it's a real limitation of
the public Game Data API. Don't waste time trying other Blizzard endpoints
for this; it's not there.

Also worth excluding on sight: profession skill tiers commonly include
"Appendix" / glossary categories (Quality, Sparks, Concentration, Skill,
Multicraft...) that are in-game tooltips, not real recipes — Jewelcrafting
had 9 of these. And a "Recraft Equipment" recipe that's a cross-profession
item-upgrade system, not a normal materials-in/item-out craft — every
profession has one of these, always exclude it the same way.

### 3. Recipe detail research — the actual expensive part

Since Blizzard's API won't give reagents/skill-level/unlock-method, that has
to come from research, recipe by recipe:

- **Primary source: `https://warcraft.wiki.gg/wiki/<Recipe_Name_With_Underscores>`.**
  Structured crafting infoboxes, plain server-rendered HTML — reliably
  fetchable, unlike Wowhead (see below). Gives skill level, materials,
  learn method (trainer + gold cost, or specialization unlock, or where a
  Design item comes from), and skill-up progression thresholds in one shot.
- **Fallback: Wowhead spell tooltips** (`wowhead.com/spell=<id>`) when the
  wiki has no page yet (happened for ~18 recipes this round — very new
  patch content, wiki coverage lags). Wowhead's *item/guide* pages are
  JS-rendered and **do not fetch cleanly** — don't bother with those, only
  spell tooltip pages returned usable structured data.
- **Never guess a gap.** If a field genuinely isn't published anywhere,
  leave it `null` and say so in a note. A wrong number is worse than a
  missing one in a tool that spends real gold — this was the standing rule
  for every research agent and it caught real problems (see below).

### 4. Item ID resolution — Blizzard's Item Search API, with two real gotchas

```
GET /data/wow/search/item?namespace=static-{region}&locale=en_US&name.en_US=<name>&id=[low,high]
```

- **Most materials exist as a duplicate PAIR of item IDs** sharing the exact
  same name, priced 2-13x apart — almost certainly an unlabeled
  crafting-quality tier the API doesn't expose a field for. Cross-check
  candidate IDs against live AH commodity data
  (`/data/wow/auctions/commodities`) and pick the cheaper one, since that's
  what a leveling crafter actually buys in bulk. This pattern is general to
  crafting materials, not a Jewelcrafting quirk — expect it again.
- **Don't cap the ID search range too narrowly.** First pass on this
  project searched `[236000,250000]` and concluded "Petrified Root doesn't
  exist" — it does, at 251285, just outside that window. A negative result
  from a range-limited search is not proof of non-existence. Search without
  a range first; only add one to cut noise from unrelated old items once
  you've confirmed there's a real signal to filter.
- **Commodities (ore, dust, gems, cloth, etc.) trade region-wide**, not
  per-realm, since patch 9.0 — `/data/wow/auctions/commodities` takes no
  connected-realm segment. Non-commodity items (BoE gear, jewelry) are
  still realm-scoped under `/data/wow/connected-realm/{id}/auctions`. Easy
  bug to make assuming everything is connected-realm scoped (made it once
  already on this project).
- **Some material names don't resolve to a stable item at all** — "Spark"
  and "Competitor's Heraldry" in this pass turned out to be placeholders for
  season/patch-specific real names (e.g. this season it's literally
  "Galactic Combatant's Heraldry"). Leave these unmapped rather than
  hardcoding an ID that'll silently go stale.

### 5. Managing scale — parallel background research agents

79 recipes was too much to research serially in one conversation without
blowing the context budget. What worked: split the recipe list into 4
batches of ~15-25 recipes each (grouped by category, since same-family
recipes like gem-cut variants tend to share structure and go faster
together), and dispatch each as a **background Agent** with a fully
self-contained prompt:

- The exact recipe names + Blizzard recipe IDs for that batch
- The confirmed-working source pattern (warcraft.wiki.gg URL format) with a
  real worked example
- The fallback approach (WebSearch → find the right page → fetch it) for
  when the direct URL 404s
- The exact output schema wanted, as a JSON example
- An explicit, repeated instruction: **null over guesses, always**

Each agent returned a JSON array in its final report — no file writes, no
code changes, pure research — which got compiled by hand afterward
(programmatically transformed into the data file via a small Node script,
not retyped, to avoid transcription errors at this scale).

Rough cost from this pass, for budgeting next time: 4 agents, 34-69 tool
calls each, 3-9 minutes each, ~45k-86k tokens each. A same-size profession
(~80 recipes) should cost about the same. A bigger profession (Alchemy,
Enchanting — more recipes) or doing multiple expansions at once will scale
roughly linearly with recipe count — budget one profession-expansion combo
per session rather than batching several, both for cost and because each
batch benefits from a human (or at least a fresh conversation) sanity-check
before shipping.

## What the code would actually need to change

Current state: `src/data/jewelcrafting.js` is a flat `JC_RECIPES` array,
implicitly scoped to one profession + one expansion by virtue of being the
only one that exists. To add a second one cleanly:

- **Data files**: split by profession+expansion, e.g.
  `src/data/recipes/jewelcrafting-midnight.js`,
  `src/data/recipes/alchemy-midnight.js`, each exporting the same shape
  (`RECIPES`, `LEARN_METHODS` can probably be shared/hoisted since the enum
  is profession-agnostic). An index file aggregates them for whatever the
  UI needs.
- **Item IDs**: `wowItemIds.js`'s keys are already just material-name slugs
  — fine to keep as one shared file across professions as long as slugs
  don't collide (unlikely; different material universes). Add a
  profession-prefixed key only if a real collision ever shows up.
- **UI**: `Jewelcrafting.jsx` would become a generic
  `ProfessionTracker.jsx` taking a recipes-data module as input, with
  either one page per profession+expansion or a single page with a
  picker — same pattern `Nav.jsx` already uses for theme switching
  (`THEMES` object + dropdown), so there's a working local precedent to
  copy instead of inventing a new pattern.
- **Nav / Projects**: one more entry per profession+expansion, or a single
  "WoW Tracker" hub page that lists what's available — worth deciding once
  there are actually 2-3 of these instead of guessing the right shape now.
- **Backend**: no changes, per above.

## Recommended URL / file structure

Route as **`/wow/{expansion}/{profession}`** — e.g. `/wow/midnight/jewelcrafting`
— with `/wow` itself as a hub page listing available expansion+profession
combos (cards, not a dropdown — this is meant to grow).

Why expansion first, not `/jewelcrafting/midnight`: in Blizzard's own API,
expansion is the structural top-level partition — each expansion is a wholly
separate skill tier with its own recipe universe (Classic Jewelcrafting and
Midnight Jewelcrafting share nothing but a profession name). Routing that
way matches the data instead of fighting it. It also sidesteps a real name
collision: this site already has `/recipes` for cooking recipes, so a WoW
crafting-recipes section needs to live under something like `/wow/*`.

```
src/pages/wow/
  WowHub.jsx                  /wow — pick an expansion+profession card
  ProfessionTracker.jsx       /wow/:expansion/:profession — generic tracker,
                               replaces the current Jewelcrafting.jsx

src/data/wow/
  registry.js                 list of available combos + display metadata
                               (label, accent color, icon) for WowHub cards
  recipes/
    midnight-jewelcrafting.js RECIPES + LEARN_METHODS (moved from
                               src/data/jewelcrafting.js)
  itemIds/
    midnight-jewelcrafting.js WOW_ITEM_IDS (moved from wowItemIds.js) —
                               keep per-profession files even though slugs
                               rarely collide, since it keeps each
                               profession's material research self-contained

netlify/functions/
  wow-auctions.cjs            unchanged — already takes item IDs in, prices
                               out, with zero profession-specific logic
```

`ProfessionTracker.jsx` reads its recipe/item-id modules based on the
`:expansion`/`:profession` route params (dynamic `import()`, same idea as
the existing lazy-loaded `VisitorMap` route in `App.jsx`) rather than
importing every profession's data into one bundle.

Migration note: moving `/jewelcrafting` → `/wow/midnight/jewelcrafting`
breaks the current URL — add a redirect (`netlify.toml` already has a
`[[redirects]]` block, one more entry) so the link already shared/bookmarked
still resolves.

## Design ideas for when this grows into a real section

The current page borrows the site's existing dark theme system (`hp-*`
tokens, same as every other page) rather than a bespoke look — fine for one
profession, probably worth more personality once there's a `/wow` hub tying
several together:

- **Real item icons.** Blizzard's Media API
  (`/data/wow/media/item/{id}?namespace=static-{region}`) returns each
  item's actual in-game icon URL. Swapping the current text-only material
  rows for icon + name would be the single highest-impact visual upgrade —
  turns it from "a spreadsheet" into "a companion tool." Cache/hotlink
  Blizzard's CDN URLs directly, no need to mirror the images.
- **A skill-range bar instead of a badge.** A horizontal 1-100 track per
  recipe with its orange/yellow/green/gray thresholds marked as bands,
  instead of the current `Skill 40–60` text badge — makes the leveling
  curve visually scannable across a whole category at a glance, and doubles
  as a nice motif for the `/wow` hub (mini bars showing "how much of this
  profession's data is actually filled in" per combo).
- **Profession-tinted accent, inside whatever global theme is active.**
  Recipes.jsx already does this per-category (`catColor` prop driving
  border/glow/text color) — same pattern per profession: Jewelcrafting
  gold/gem tones, Alchemy potion green/purple, Enchanting arcane blue,
  Mining iron/rust. Stays consistent with the dusk/matrix/miami-vice/raiders
  theme switcher instead of competing with it.
- **`/wow` hub as an expansion timeline**, not a grid — expansion crests
  laid left-to-right in release order, each expanding to show its
  professions when selected. Leans into the nostalgia angle without needing
  new visual assets beyond what Blizzard's media API already provides.
- **A live-price ticker strip.** After a Sync, scroll the last N synced
  prices past like a stock ticker under the header — reinforces "this is
  live market data," and it's a small, cheap component to build once prices
  are already in state.

Pick one or two rather than all five — the icon swap and the skill-range
bar are probably the best ratio of visual impact to build effort.

## Checklist for next time

1. `GET /data/wow/profession/index` → get the profession id.
2. `GET /data/wow/profession/{id}` → get the skill_tiers list, pick the
   expansion's tier id.
3. `GET /data/wow/profession/{id}/skill-tier/{tierId}` → dump every
   category + recipe id/name. Exclude Appendix/glossary categories and the
   Recraft-equivalent recipe.
4. Split into batches of ~15-25 recipes, dispatch background research
   agents using the prompt pattern above (warcraft.wiki.gg primary,
   Wowhead spell tooltips fallback, null-not-guess rule, JSON-only output).
5. Compile agent reports into a data file via a small transform script
   (don't hand-retype at this scale — that's how transcription errors
   happen).
6. Resolve item IDs for the unique material list via the Item Search API —
   full ID range first, cross-check duplicate pairs against live AH data,
   leave genuinely unmappable names (season/patch placeholders) unmapped.
7. Wire into the UI, verify the build (`esbuild` syntax check + a real dev
   server smoke test — this repo's default Node can't run `npm run build`
   directly, see the "known non-issue" note in `jewelcrafting-tracker.md`),
   test the sync pipeline against real credentials before shipping, commit,
   push, and poll production to confirm the deployed function actually
   works — dashboard/CLI success doesn't guarantee the deployed code path
   does what you think until you hit it directly.
