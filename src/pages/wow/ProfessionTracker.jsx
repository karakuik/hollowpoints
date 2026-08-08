import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import Meta from '../../components/Meta'
import NotFound from '../NotFound'
import { findCombo } from '../../data/wow/registry'
import { formatMoney, parseMoney, splitMoney } from '../../lib/money'

function loadState(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey)
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

function MoneyDisplay({ value, sign = '', className = '' }) {
  const { gold, silver, copper } = splitMoney(value)
  const denominations = [
    { key: 'gold', value: gold, label: 'Gold' },
    { key: 'silver', value: silver, label: 'Silver' },
    { key: 'copper', value: copper, label: 'Copper' },
  ]

  return (
    <span className={`wow-money ${className}`} aria-label={`${sign}${formatMoney(value)}`}>
      {sign && <span aria-hidden="true">{sign}</span>}
      {denominations.map(({ key, value: amount, label }) => (
        <span className="wow-money-denomination" key={key} title={`${amount} ${label}`}>
          <span>{amount}</span>
          <span className={`wow-coin wow-coin-${key}`} aria-hidden="true" />
        </span>
      ))}
    </span>
  )
}

function ItemIcon({ itemKey, itemName, icons, size = 'sm', showFallback = true }) {
  const src = icons[itemKey]
  if (!src && !showFallback) return null
  return (
    <span className={`wow-item-icon wow-item-icon-${size}`} title={itemName}>
      {src ? <img src={src} alt="" loading="lazy" decoding="async" /> : <span className="wow-item-icon-fallback">?</span>}
    </span>
  )
}

// ── Small badges ────────────────────────────────────────────────────────────
function LearnBadge({ learnMethod, learnMethods }) {
  if (!learnMethod) {
    return (
      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border text-hp-muted bg-hp-muted/10 border-hp-muted/20">
        Unknown
      </span>
    )
  }
  const meta = learnMethods[learnMethod.type]
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
function RecipeCard({ recipe, learnMethods, prices, setPrice, salePrices, setSalePrice, icons }) {
  const costPerCraft = recipe.materials.reduce((sum, m) => sum + m.qty * (prices[m.key] || 0), 0)
  const saleValuePerCraft = recipe.sellable === true ? (salePrices[recipe.saleKey] || 0) : 0
  const profit = saleValuePerCraft - costPerCraft
  const showProfit = recipe.sellable === true && saleValuePerCraft > 0

  return (
    <div className="bg-hp-surface border border-hp-border rounded-lg p-4">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <ItemIcon itemKey={recipe.saleKey} itemName={recipe.name} icons={icons} size="md" showFallback={false} />
            <p className="text-sm font-semibold text-hp-text">{recipe.name}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className="text-[10px] font-mono text-hp-muted">{skillRangeText(recipe)}</span>
            <LearnBadge learnMethod={recipe.learnMethod} learnMethods={learnMethods} />
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
              <span className="flex items-center gap-2 text-hp-muted min-w-0">
                <ItemIcon itemKey={mat.key} itemName={mat.name} icons={icons} />
                <span>{mat.qty}× {mat.name}</span>
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
        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-hp-muted">
          <span>Cost:</span> <MoneyDisplay value={costPerCraft} />
          {recipe.sellable === true && <><span>· Sale:</span> <MoneyDisplay value={saleValuePerCraft} /></>}
        </span>
        {showProfit ? (
          <span className={profit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
            <MoneyDisplay value={Math.abs(profit)} sign={profit >= 0 ? '+' : '−'} />{profit < 0 ? ' (loss)' : ''}
          </span>
        ) : (
          <MoneyDisplay value={costPerCraft} sign="−" className="text-hp-muted" />
        )}
      </div>
    </div>
  )
}

// ── Recommended-for-leveling summary ──────────────────────────────────────────
function RecommendedSection({ recipes, prices, salePrices, icons }) {
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
              <ItemIcon itemKey={recipe.saleKey} itemName={recipe.name} icons={icons} showFallback={false} />
              <span className="text-hp-text">{recipe.name}</span>
            </div>
            <span className="font-mono text-emerald-400"><MoneyDisplay value={profit} sign="+" />/craft</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Category section ──────────────────────────────────────────────────────────
function CategorySection({ category, recipes, learnMethods, prices, setPrice, salePrices, setSalePrice, icons }) {
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
            learnMethods={learnMethods}
            prices={prices}
            setPrice={setPrice}
            salePrices={salePrices}
            setSalePrice={setSalePrice}
            icons={icons}
          />
        ))}
      </div>
    </section>
  )
}

// ── Sync with AH ────────────────────────────────────────────────────────────
function useAhSync(recipesData, itemIds, setPrices, setSalePrices) {
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const [lastSynced, setLastSynced] = useState(null)

  const mappedKeys = useMemo(() => {
    if (!recipesData || !itemIds) return []
    const allKeys = [
      ...recipesData.getAllMaterialKeys().map(m => m.key),
      ...recipesData.getAllSellables().map(s => s.key),
    ]
    return [...new Set(allKeys)].filter(k => itemIds[k] != null)
  }, [recipesData, itemIds])

  const sync = useCallback(async () => {
    if (mappedKeys.length === 0) return
    setStatus('loading')
    try {
      const idToKey = {}
      for (const k of mappedKeys) idToKey[String(itemIds[k])] = k
      const ids = Object.keys(idToKey).join(',')

      const res = await fetch(`/.netlify/functions/wow-auctions?items=${ids}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { prices } = await res.json()

      const saleKeySet = new Set(recipesData.getAllSellables().map(s => s.key))
      const materialKeySet = new Set(recipesData.getAllMaterialKeys().map(m => m.key))

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
  }, [mappedKeys, itemIds, recipesData, setPrices, setSalePrices])

  return { sync, status, lastSynced, mappedCount: mappedKeys.length }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProfessionTracker() {
  const { expansion, profession } = useParams()
  const combo = findCombo(expansion, profession)

  const [recipesData, setRecipesData] = useState(null)
  const [itemIds, setItemIds] = useState(null)

  useEffect(() => {
    if (!combo) return
    let cancelled = false
    setRecipesData(null)
    setItemIds(null)
    Promise.all([combo.loadRecipes(), combo.loadItemIds()]).then(([recipesMod, itemIdsMod]) => {
      if (cancelled) return
      setRecipesData(recipesMod)
      setItemIds(itemIdsMod.WOW_ITEM_IDS)
    })
    return () => { cancelled = true }
  }, [combo])

  const storageKey = combo ? `hp-wow-${combo.expansion}-${combo.profession}` : null
  const initial = useMemo(() => (storageKey ? loadState(storageKey) : {}), [storageKey])
  const [prices, setPrices] = useState(initial.prices || {})
  const [salePrices, setSalePrices] = useState(initial.salePrices || {})
  const [icons, setIcons] = useState({})

  useEffect(() => {
    if (!storageKey) return
    localStorage.setItem(storageKey, JSON.stringify({ prices, salePrices }))
  }, [storageKey, prices, salePrices])

  const setPrice = useCallback((key, v) => setPrices(p => ({ ...p, [key]: v })), [])
  const setSalePrice = useCallback((key, v) => setSalePrices(p => ({ ...p, [key]: v })), [])

  const { sync, status, lastSynced, mappedCount } = useAhSync(recipesData, itemIds, setPrices, setSalePrices)

  const categories = useMemo(() => (recipesData ? recipesData.getCategories() : []), [recipesData])

  useEffect(() => {
    setIcons({})
    if (!itemIds) return
    const controller = new AbortController()
    const idToKeys = {}
    for (const [key, id] of Object.entries(itemIds)) {
      if (id == null) continue
      if (!idToKeys[id]) idToKeys[id] = []
      idToKeys[id].push(key)
    }

    fetch(`/.netlify/functions/wow-auctions?items=${Object.keys(idToKeys).join(',')}&media=1`, { signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`)))
      .then(({ media }) => {
        const byKey = {}
        for (const [id, url] of Object.entries(media || {})) {
          for (const key of idToKeys[id] || []) byKey[key] = url
        }
        setIcons(byKey)
      })
      .catch(err => { if (err.name !== 'AbortError') console.warn('WoW item icons unavailable:', err) })

    return () => controller.abort()
  }, [itemIds])

  if (!combo) return <NotFound />

  return (
    <Layout>
      <Meta
        title={`${combo.professionLabel} Tracker`}
        description={combo.description}
      />

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">
            {combo.expansionLabel} · {combo.realm}
          </p>
          <h1 className="text-4xl font-bold text-hp-text mb-3">{combo.professionLabel} Tracker</h1>
          <p className="text-hp-muted text-sm max-w-lg">
            {combo.description} Prices persist locally.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <button
            onClick={sync}
            disabled={!recipesData || mappedCount === 0 || status === 'loading'}
            title={mappedCount === 0 ? 'No item IDs mapped yet' : undefined}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded-lg border
                       border-hp-accent/40 text-hp-accent hover:bg-hp-accent/10 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            {status === 'loading' ? 'Syncing…' : 'Sync with AH'}
          </button>
          <span className="text-[10px] text-hp-muted">
            {!recipesData
              ? 'Loading…'
              : mappedCount === 0
              ? 'No items mapped yet'
              : status === 'done' && lastSynced
              ? `Synced ${lastSynced.toLocaleTimeString()}`
              : status === 'error'
              ? 'Sync failed — check function logs'
              : `${mappedCount} item${mappedCount === 1 ? '' : 's'} mapped (materials only — crafted-item prices are manual for now)`}
          </span>
        </div>
      </div>

      {recipesData && (
        <>
          <RecommendedSection recipes={recipesData.RECIPES} prices={prices} salePrices={salePrices} icons={icons} />

          <div className="space-y-10">
            {categories.map(category => (
              <CategorySection
                key={category}
                category={category}
                recipes={recipesData.RECIPES.filter(r => r.category === category)}
                learnMethods={recipesData.LEARN_METHODS}
                prices={prices}
                setPrice={setPrice}
                salePrices={salePrices}
                setSalePrice={setSalePrice}
                icons={icons}
              />
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}
