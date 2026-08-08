import { useState, useEffect, useMemo, useCallback } from 'react'
import Layout from '../components/Layout'
import Meta from '../components/Meta'
import { JC_RECIPES, LEARN_METHODS, getAllMaterialKeys, getAllSellables, getCategories } from '../data/jewelcrafting'
import { WOW_ITEM_IDS } from '../data/wowItemIds'
import { formatMoney, parseMoney } from '../lib/money'

const STORAGE_KEY = 'hp-jc-tracker'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// ── Money input — free-text "12g 34s 56c", commits to copper on blur ──────────
function MoneyInput({ value, onChange, placeholder }) {
  const [text, setText] = useState(value ? formatMoney(value) : '')

  useEffect(() => {
    setText(value ? formatMoney(value) : '')
  }, [value])

  return (
    <input
      type="text"
      value={text}
      placeholder={placeholder || '0c'}
      onChange={e => setText(e.target.value)}
      onBlur={() => onChange(parseMoney(text))}
      onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
      className="w-24 bg-hp-bg border border-hp-border rounded px-2 py-1 text-xs font-mono text-hp-text
                 focus:outline-none focus:border-hp-accent/60 text-right"
    />
  )
}

// ── Small badges ────────────────────────────────────────────────────────────
function LearnBadge({ learnMethod }) {
  if (!learnMethod) {
    return (
      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border text-hp-muted bg-hp-muted/10 border-hp-muted/20">
        Unknown
      </span>
    )
  }
  const meta = LEARN_METHODS[learnMethod.type]
  const colors = {
    automatic: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    trainer: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    specialization: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    recipe_item: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    drop: 'text-red-400 bg-red-400/10 border-red-400/20',
  }
  return (
    <span
      title={learnMethod.detail}
      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border cursor-help ${colors[learnMethod.type] || ''}`}
    >
      {meta?.label || learnMethod.type}
    </span>
  )
}

function skillRangeText(recipe) {
  if (recipe.skillProgression?.length) {
    const first = recipe.skillProgression[0]
    const last = recipe.skillProgression[recipe.skillProgression.length - 1]
    return first === last ? `Skill ${first}` : `Skill ${first}–${last}`
  }
  if (recipe.skillLevelRequired != null) return `Skill ${recipe.skillLevelRequired}+`
  return 'Skill unknown'
}

// ── One recipe card ─────────────────────────────────────────────────────────
function RecipeCard({ recipe, prices, setPrice, salePrices, setSalePrice }) {
  const costPerCraft = recipe.materials.reduce((sum, m) => sum + m.qty * (prices[m.key] || 0), 0)
  const saleValuePerCraft = recipe.sellable === true ? (salePrices[recipe.saleKey] || 0) : 0
  const profit = saleValuePerCraft - costPerCraft
  const showProfit = recipe.sellable === true && saleValuePerCraft > 0

  return (
    <div className="bg-hp-surface border border-hp-border rounded-lg p-4">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold text-hp-text">{recipe.name}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className="text-[10px] font-mono text-hp-muted">{skillRangeText(recipe)}</span>
            <LearnBadge learnMethod={recipe.learnMethod} />
            {recipe.sellable === false && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border text-hp-muted bg-hp-muted/10 border-hp-muted/20">
                Soulbound
              </span>
            )}
            {recipe.sellable === null && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border text-hp-muted bg-hp-muted/10 border-hp-muted/20">
                Sellable unconfirmed
              </span>
            )}
          </div>
          {recipe.learnMethod?.detail && (
            <p className="text-[11px] text-hp-muted mt-1.5 max-w-md">{recipe.learnMethod.detail}</p>
          )}
          {recipe.notes && (
            <p className="text-[11px] text-amber-400/80 mt-1 max-w-md">{recipe.notes}</p>
          )}
        </div>
      </div>

      {recipe.materials.length > 0 && (
        <div className="space-y-1.5 mb-3">
          {recipe.materials.map(mat => (
            <div key={mat.key} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-hp-muted">
                {mat.qty}× {mat.name}
              </span>
              <MoneyInput value={prices[mat.key]} onChange={v => setPrice(mat.key, v)} />
            </div>
          ))}
        </div>
      )}

      {recipe.sellable === true && (
        <div className="flex items-center justify-between gap-3 text-xs mb-3 pt-2 border-t border-hp-border/60">
          <span className="text-hp-accent">AH sale price (per craft)</span>
          <MoneyInput value={salePrices[recipe.saleKey]} onChange={v => setSalePrice(recipe.saleKey, v)} />
        </div>
      )}

      <div className="flex items-center justify-between text-xs pt-2 border-t border-hp-border/60 font-mono">
        <span className="text-hp-muted">
          Cost: {formatMoney(costPerCraft)}
          {recipe.sellable === true && <> · Sale: {formatMoney(saleValuePerCraft)}</>}
        </span>
        {showProfit ? (
          <span className={profit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
            {profit >= 0 ? '+' : ''}{formatMoney(Math.abs(profit))}{profit < 0 ? ' (loss)' : ''}
          </span>
        ) : (
          <span className="text-hp-muted">−{formatMoney(costPerCraft)}</span>
        )}
      </div>
    </div>
  )
}

// ── Recommended-for-leveling summary ──────────────────────────────────────────
function RecommendedSection({ recipes, prices, salePrices }) {
  const recommended = useMemo(() => {
    return recipes
      .filter(r => r.sellable === true && r.skillProgression?.length && (salePrices[r.saleKey] || 0) > 0)
      .map(r => {
        const cost = r.materials.reduce((sum, m) => sum + m.qty * (prices[m.key] || 0), 0)
        const sale = salePrices[r.saleKey] || 0
        return { recipe: r, cost, sale, profit: sale - cost }
      })
      .filter(x => x.profit >= 0)
      .sort((a, b) => a.recipe.skillProgression[0] - b.recipe.skillProgression[0] || b.profit - a.profit)
  }, [recipes, prices, salePrices])

  if (recommended.length === 0) return null

  return (
    <section className="mb-10 bg-hp-elevated border border-hp-accent/30 rounded-lg p-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-hp-accent mb-1">Recommended right now</h2>
      <p className="text-[11px] text-hp-muted mb-4">
        Sellable recipes with a known skill range where sale price currently covers material cost, sorted by skill level.
        Fill in more sale prices (or hit Sync) to surface more of these.
      </p>
      <div className="space-y-2">
        {recommended.map(({ recipe, profit }) => (
          <div key={recipe.id} className="flex items-center justify-between gap-3 text-xs bg-hp-surface border border-hp-border rounded px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-hp-accent">{skillRangeText(recipe)}</span>
              <span className="text-hp-text">{recipe.name}</span>
            </div>
            <span className="font-mono text-emerald-400">+{formatMoney(profit)}/craft</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Category section ──────────────────────────────────────────────────────────
function CategorySection({ category, recipes, prices, setPrice, salePrices, setSalePrice }) {
  const sorted = useMemo(
    () => [...recipes].sort((a, b) => (a.skillLevelRequired ?? 999) - (b.skillLevelRequired ?? 999)),
    [recipes]
  )
  return (
    <section>
      <h2 className="text-lg font-bold text-hp-text mb-4">{category}</h2>
      <div className="space-y-3">
        {sorted.map(r => (
          <RecipeCard
            key={r.id}
            recipe={r}
            prices={prices}
            setPrice={setPrice}
            salePrices={salePrices}
            setSalePrice={setSalePrice}
          />
        ))}
      </div>
    </section>
  )
}

// ── Sync with AH ────────────────────────────────────────────────────────────
function useAhSync(setPrices, setSalePrices) {
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [lastSynced, setLastSynced] = useState(null)

  const mappedKeys = useMemo(() => {
    const allKeys = [
      ...getAllMaterialKeys().map(m => m.key),
      ...getAllSellables().map(s => s.key),
    ]
    return [...new Set(allKeys)].filter(k => WOW_ITEM_IDS[k] != null)
  }, [])

  const sync = useCallback(async () => {
    if (mappedKeys.length === 0) return
    setStatus('loading')
    try {
      const idToKey = {}
      for (const k of mappedKeys) idToKey[String(WOW_ITEM_IDS[k])] = k
      const ids = Object.keys(idToKey).join(',')

      const res = await fetch(`/.netlify/functions/wow-auctions?items=${ids}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { prices } = await res.json()

      const saleKeySet = new Set(getAllSellables().map(s => s.key))
      const materialKeySet = new Set(getAllMaterialKeys().map(m => m.key))

      setPrices(prev => {
        const next = { ...prev }
        for (const [id, copper] of Object.entries(prices || {})) {
          const key = idToKey[id]
          if (key && materialKeySet.has(key)) next[key] = copper
        }
        return next
      })
      setSalePrices(prev => {
        const next = { ...prev }
        for (const [id, copper] of Object.entries(prices || {})) {
          const key = idToKey[id]
          if (key && saleKeySet.has(key)) next[key] = copper
        }
        return next
      })

      setStatus('done')
      setLastSynced(new Date())
    } catch {
      setStatus('error')
    }
  }, [mappedKeys, setPrices, setSalePrices])

  return { sync, status, lastSynced, mappedCount: mappedKeys.length }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Jewelcrafting() {
  const initial = useMemo(loadState, [])
  const [prices, setPrices] = useState(initial.prices || {})
  const [salePrices, setSalePrices] = useState(initial.salePrices || {})

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ prices, salePrices }))
  }, [prices, salePrices])

  const setPrice = useCallback((key, v) => setPrices(p => ({ ...p, [key]: v })), [])
  const setSalePrice = useCallback((key, v) => setSalePrices(p => ({ ...p, [key]: v })), [])

  const { sync, status, lastSynced, mappedCount } = useAhSync(setPrices, setSalePrices)

  const categories = useMemo(getCategories, [])

  return (
    <Layout>
      <Meta
        title="Jewelcrafting Tracker"
        description="Full Midnight Jewelcrafting recipe database with live cost-vs-profit math for Stormrage-US."
      />

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">Stormrage-US</p>
          <h1 className="text-4xl font-bold text-hp-text mb-3">Jewelcrafting Tracker</h1>
          <p className="text-hp-muted text-sm max-w-lg">
            Every Midnight Jewelcrafting recipe — skill requirement, how it's learned, exact materials,
            and cost vs. Auction House sale price per craft. Prices persist locally.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <button
            onClick={sync}
            disabled={mappedCount === 0 || status === 'loading'}
            title={mappedCount === 0 ? 'No item IDs mapped yet — see src/data/wowItemIds.js' : undefined}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-lg border
                       border-hp-accent/40 text-hp-accent hover:bg-hp-accent/10 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            {status === 'loading' ? 'Syncing…' : 'Sync with AH'}
          </button>
          <span className="text-[10px] text-hp-muted">
            {mappedCount === 0
              ? 'No items mapped yet'
              : status === 'done' && lastSynced
              ? `Synced ${lastSynced.toLocaleTimeString()}`
              : status === 'error'
              ? 'Sync failed — check function logs'
              : `${mappedCount} item${mappedCount === 1 ? '' : 's'} mapped (materials only — crafted-item prices are manual for now)`}
          </span>
        </div>
      </div>

      <RecommendedSection recipes={JC_RECIPES} prices={prices} salePrices={salePrices} />

      <div className="space-y-10">
        {categories.map(category => (
          <CategorySection
            key={category}
            category={category}
            recipes={JC_RECIPES.filter(r => r.category === category)}
            prices={prices}
            setPrice={setPrice}
            salePrices={salePrices}
            setSalePrice={setSalePrice}
          />
        ))}
      </div>
    </Layout>
  )
}
