import { useState, useEffect, useMemo, useCallback } from 'react'
import Layout from '../components/Layout'
import Meta from '../components/Meta'
import { JC_BRACKETS, getAllMaterialKeys, getAllSellables } from '../data/jewelcrafting'
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

const CONFIDENCE = {
  high:   { label: 'Verified',        color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  medium: { label: 'Needs a look',    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  low:    { label: 'Choice-driven',   color: 'text-red-400 bg-red-400/10 border-red-400/20' },
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

// ── One recipe row ─────────────────────────────────────────────────────────────
function RecipeRow({ recipe, prices, setPrice, salePrices, setSalePrice, crafts, setCrafts }) {
  const saleKey = recipe.saleKey || recipe.name
  const costPerCraft = recipe.materials.reduce((sum, m) => sum + m.qty * (prices[m.key] || 0), 0)
  const totalCost = costPerCraft * crafts
  const saleValuePerCraft = recipe.sellable ? (salePrices[saleKey] || 0) : 0
  const totalSaleValue = saleValuePerCraft * crafts
  const profit = totalSaleValue - totalCost

  return (
    <div className="bg-hp-surface border border-hp-border rounded-lg p-4">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold text-hp-text">{recipe.name}</p>
          {recipe.note && <p className="text-xs text-hp-muted mt-0.5 max-w-md">{recipe.note}</p>}
        </div>
        <label className="flex items-center gap-1.5 text-[10px] text-hp-muted uppercase tracking-widest flex-shrink-0">
          Crafts
          <input
            type="number"
            min={0}
            value={crafts}
            onChange={e => setCrafts(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="w-16 bg-hp-bg border border-hp-border rounded px-2 py-1 text-xs font-mono text-hp-text
                       focus:outline-none focus:border-hp-accent/60 text-right"
          />
        </label>
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

      {recipe.sellable && (
        <div className="flex items-center justify-between gap-3 text-xs mb-3 pt-2 border-t border-hp-border/60">
          <span className="text-hp-accent">AH sale price (per craft)</span>
          <MoneyInput value={salePrices[saleKey]} onChange={v => setSalePrice(saleKey, v)} />
        </div>
      )}

      <div className="flex items-center justify-between text-xs pt-2 border-t border-hp-border/60 font-mono">
        <span className="text-hp-muted">
          Cost: {formatMoney(totalCost)}
          {recipe.sellable && <> · Sale: {formatMoney(totalSaleValue)}</>}
        </span>
        <span className={recipe.sellable ? (profit >= 0 ? 'text-emerald-400' : 'text-red-400') : 'text-hp-muted'}>
          {recipe.sellable ? (profit >= 0 ? '+' : '') + formatMoney(Math.abs(profit)) : `−${formatMoney(totalCost)}`}
          {recipe.sellable && profit < 0 ? ' (loss)' : ''}
        </span>
      </div>
    </div>
  )
}

// ── One bracket ──────────────────────────────────────────────────────────────
function BracketSection({ bracket, prices, setPrice, salePrices, setSalePrice, craftsState, setCraftsFor }) {
  const conf = CONFIDENCE[bracket.confidence]

  let bracketCost = 0
  let bracketSale = 0
  for (const r of bracket.recipes) {
    const key = `${bracket.id}:${r.name}`
    const crafts = craftsState[key] ?? r.crafts
    const costPerCraft = r.materials.reduce((sum, m) => sum + m.qty * (prices[m.key] || 0), 0)
    bracketCost += costPerCraft * crafts
    if (r.sellable) bracketSale += (salePrices[r.saleKey || r.name] || 0) * crafts
  }
  const bracketProfit = bracketSale - bracketCost

  return (
    <section>
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-lg font-bold text-hp-text">Skill {bracket.range}</h2>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${conf.color}`}>
          {conf.label}
        </span>
      </div>
      <p className="text-xs text-hp-muted mb-4 max-w-2xl">{bracket.summary}</p>

      <div className="space-y-3">
        {bracket.recipes.map(r => {
          const key = `${bracket.id}:${r.name}`
          return (
            <RecipeRow
              key={key}
              recipe={r}
              prices={prices}
              setPrice={setPrice}
              salePrices={salePrices}
              setSalePrice={setSalePrice}
              crafts={craftsState[key] ?? r.crafts}
              setCrafts={v => setCraftsFor(key, v)}
            />
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-3 px-1 text-xs font-mono">
        <span className="text-hp-muted uppercase tracking-widest text-[10px]">Bracket total</span>
        <span className={bracketProfit >= 0 && bracketSale > 0 ? 'text-emerald-400' : 'text-hp-text'}>
          {bracketSale > 0
            ? `${bracketProfit >= 0 ? '+' : '−'}${formatMoney(Math.abs(bracketProfit))} net`
            : `−${formatMoney(bracketCost)} to level`}
        </span>
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
    return allKeys.filter(k => WOW_ITEM_IDS[k] != null)
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
      setPrices(prev => {
        const next = { ...prev }
        for (const [id, copper] of Object.entries(prices || {})) {
          const key = idToKey[id]
          if (key && !saleKeySet.has(key)) next[key] = copper
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
  const [craftsState, setCraftsState] = useState(initial.crafts || {})

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ prices, salePrices, crafts: craftsState }))
  }, [prices, salePrices, craftsState])

  const setPrice = useCallback((key, v) => setPrices(p => ({ ...p, [key]: v })), [])
  const setSalePrice = useCallback((key, v) => setSalePrices(p => ({ ...p, [key]: v })), [])
  const setCraftsFor = useCallback((key, v) => setCraftsState(c => ({ ...c, [key]: v })), [])

  const { sync, status, lastSynced, mappedCount } = useAhSync(setPrices, setSalePrices)

  let grandCost = 0
  let grandSale = 0
  for (const bracket of JC_BRACKETS) {
    for (const r of bracket.recipes) {
      const key = `${bracket.id}:${r.name}`
      const crafts = craftsState[key] ?? r.crafts
      const costPerCraft = r.materials.reduce((sum, m) => sum + m.qty * (prices[m.key] || 0), 0)
      grandCost += costPerCraft * crafts
      if (r.sellable) grandSale += (salePrices[r.saleKey || r.name] || 0) * crafts
    }
  }
  const grandNet = grandSale - grandCost

  return (
    <Layout>
      <Meta
        title="Jewelcrafting Tracker"
        description="Midnight Jewelcrafting 1-100 leveling path with live cost-vs-profit math for Stormrage-US."
      />

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">Stormrage-US</p>
          <h1 className="text-4xl font-bold text-hp-text mb-3">Jewelcrafting Tracker</h1>
          <p className="text-hp-muted text-sm max-w-lg">
            What to craft to level Jewelcrafting 1-100 without bleeding gold — cost-to-craft vs.
            Auction House sale price, bracket by bracket. Prices persist locally; edit crafts counts
            if your actual skill-ups don't match the estimate.
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
              : `${mappedCount} item${mappedCount === 1 ? '' : 's'} mapped`}
          </span>
        </div>
      </div>

      <div className="space-y-10">
        {JC_BRACKETS.map(bracket => (
          <BracketSection
            key={bracket.id}
            bracket={bracket}
            prices={prices}
            setPrice={setPrice}
            salePrices={salePrices}
            setSalePrice={setSalePrice}
            craftsState={craftsState}
            setCraftsFor={setCraftsFor}
          />
        ))}
      </div>

      <div className="mt-10 bg-hp-elevated border border-hp-border rounded-lg px-5 py-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-hp-muted">1 – 100 total</span>
        <span className={`font-mono text-sm ${grandNet >= 0 && grandSale > 0 ? 'text-emerald-400' : 'text-hp-text'}`}>
          {grandSale > 0
            ? `${grandNet >= 0 ? '+' : '−'}${formatMoney(Math.abs(grandNet))} net`
            : `−${formatMoney(grandCost)} to level`}
        </span>
      </div>
    </Layout>
  )
}
