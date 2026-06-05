import { useState, useMemo, useRef, useEffect } from 'react'
import Nav from '../components/Nav'
import Meta from '../components/Meta'
import {
  ALL_POKEMON, TYPES, TYPE_COLORS,
  getOffensiveCoverage, getTeamWeaknesses, analyzeTeam, generateInsights,
} from '../data/gsc'

// ── type badge ─────────────────────────────────────────────────────────────────
function TypePill({ type, small }) {
  const col = TYPE_COLORS[type] || '#888'
  return (
    <span
      style={{ background: `${col}22`, color: col, border: `1px solid ${col}44` }}
      className={`inline-block rounded font-mono font-semibold uppercase tracking-wider leading-none ${small ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'}`}
    >
      {type}
    </span>
  )
}

// ── tier badge ─────────────────────────────────────────────────────────────────
const TIER_STYLES = {
  Uber:  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  OU:    'bg-green-500/20 text-green-300 border-green-500/30',
  UUBL:  'bg-lime-500/20 text-lime-300 border-lime-500/30',
  UU:    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  NUBL:  'bg-orange-500/20 text-orange-300 border-orange-500/30',
  NU:    'bg-orange-600/20 text-orange-400 border-orange-600/30',
  PU:    'bg-red-500/20 text-red-400 border-red-500/30',
  ZU:    'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
}
function TierBadge({ tier }) {
  const cls = TIER_STYLES[tier] || 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${cls}`}>{tier}</span>
  )
}

// ── pokémon slot ───────────────────────────────────────────────────────────────
function PokemonSlot({ index, pokemon, onSelect, onClear }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return (q ? ALL_POKEMON.filter(p => p.name.toLowerCase().includes(q)) : ALL_POKEMON).slice(0, 40)
  }, [search])

  function handleSelect(p) {
    onSelect(p)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Slot card */}
      <div
        onClick={() => setOpen(o => !o)}
        className={`relative cursor-pointer rounded-xl border transition-all duration-200 select-none
          ${pokemon
            ? 'bg-hp-surface border-hp-border hover:border-hp-accent/50 p-4'
            : 'bg-hp-surface/50 border-dashed border-hp-border hover:border-hp-accent/40 p-4 flex items-center justify-center min-h-[96px]'
          } ${open ? 'border-hp-accent/60 shadow-[0_0_20px_rgba(255,69,0,0.08)]' : ''}`}
      >
        {pokemon ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-sm text-hp-text leading-tight">{pokemon.name}</span>
              <button
                onClick={e => { e.stopPropagation(); onClear() }}
                className="text-hp-muted hover:text-red-400 transition-colors text-xs leading-none mt-0.5 flex-shrink-0"
                title="Remove"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {pokemon.type.split('/').map(t => <TypePill key={t} type={t} small />)}
              <TierBadge tier={pokemon.tier} />
            </div>
            <div className="text-[10px] text-hp-muted mt-0.5">BST {pokemon.bst}</div>
          </div>
        ) : (
          <div className="text-hp-muted/60 text-xs text-center">
            <div className="text-lg mb-1 opacity-40">+</div>
            <div>Slot {index + 1}</div>
          </div>
        )}
      </div>

      {/* Dropdown picker */}
      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-hp-elevated border border-hp-border rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
          <div className="p-2 border-b border-hp-border">
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && setOpen(false)}
              placeholder="Search Pokémon..."
              className="w-full bg-hp-surface border border-hp-border rounded-lg px-3 py-2 text-xs text-hp-text placeholder:text-hp-muted focus:outline-none focus:border-hp-accent transition-colors"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto">
            {filtered.map(p => (
              <li
                key={p.name}
                onClick={() => handleSelect(p)}
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-hp-surface transition-colors gap-2"
              >
                <span className="text-xs text-hp-text font-medium">{p.name}</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {p.type.split('/').map(t => <TypePill key={t} type={t} small />)}
                  <TierBadge tier={p.tier} />
                </div>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-xs text-hp-muted text-center">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── offensive coverage panel ───────────────────────────────────────────────────
function OffensiveCoverage({ coverage }) {
  return (
    <div className="bg-hp-surface border border-hp-border rounded-xl p-5">
      <p className="text-hp-accent text-[10px] font-semibold uppercase tracking-widest mb-1">Offensive</p>
      <h2 className="text-sm font-bold text-hp-text mb-4">STAB Coverage</h2>
      <div className="flex flex-wrap gap-2">
        {TYPES.map(type => {
          const covered = coverage[type]
          const col = TYPE_COLORS[type] || '#888'
          return (
            <div key={type} className="flex flex-col items-center gap-1">
              <span
                style={covered
                  ? { background: `${col}30`, color: col, border: `1px solid ${col}60` }
                  : { background: 'rgba(255,255,255,0.02)', color: '#3a3d4a', border: '1px solid rgba(255,255,255,0.05)' }
                }
                className="text-[10px] font-mono font-semibold uppercase tracking-wide px-2 py-1 rounded transition-all"
              >
                {type}
              </span>
              <span className={`text-[8px] font-bold ${covered ? 'text-green-400' : 'text-hp-muted/30'}`}>
                {covered ? '2×' : '—'}
              </span>
            </div>
          )
        })}
      </div>
      <p className="text-[10px] text-hp-muted mt-3">
        Vivid = your team has a STAB move that hits 2× — dimmed = no STAB coverage
      </p>
    </div>
  )
}

// ── defensive weakness heatmap ─────────────────────────────────────────────────
function DefensiveHeatmap({ weaknesses, memberCount }) {
  function badge(count) {
    if (count === 0) return { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/25' }
    if (count === 1) return { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/25' }
    if (count === 2) return { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/25' }
    return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' }
  }

  return (
    <div className="bg-hp-surface border border-hp-border rounded-xl p-5">
      <p className="text-hp-accent text-[10px] font-semibold uppercase tracking-widest mb-1">Defensive</p>
      <h2 className="text-sm font-bold text-hp-text mb-4">Weakness Heatmap</h2>
      <div className="flex flex-wrap gap-2">
        {TYPES.map(type => {
          const count = weaknesses[type]
          const { bg, text, border } = badge(count)
          const col = TYPE_COLORS[type] || '#888'
          return (
            <div key={type} className="flex flex-col items-center gap-1">
              <span
                style={{ color: col }}
                className="text-[10px] font-mono font-semibold uppercase tracking-wide"
              >
                {type}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${bg} ${text} ${border} min-w-[28px] text-center`}>
                {count}/{memberCount}
              </span>
            </div>
          )
        })}
      </div>
      <div className="flex gap-4 mt-3 text-[10px] text-hp-muted">
        <span><span className="text-green-400">0</span> = none weak</span>
        <span><span className="text-yellow-400">1</span> = one weak</span>
        <span><span className="text-orange-400">2</span> = two weak</span>
        <span><span className="text-red-400">3+</span> = critical</span>
      </div>
    </div>
  )
}

// ── team insights ──────────────────────────────────────────────────────────────
const SEVERITY_STYLES = {
  danger:  { dot: 'bg-red-500',    label: 'text-red-400',    border: 'border-red-500/20',    bg: 'bg-red-500/5'    },
  warning: { dot: 'bg-yellow-500', label: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5' },
  good:    { dot: 'bg-green-500',  label: 'text-green-400',  border: 'border-green-500/20',  bg: 'bg-green-500/5'  },
  info:    { dot: 'bg-blue-500',   label: 'text-blue-400',   border: 'border-blue-500/20',   bg: 'bg-blue-500/5'   },
}

function TeamInsights({ insights, analysis }) {
  if (insights.length === 0) return null
  const { avgStats } = analysis

  return (
    <div className="bg-hp-surface border border-hp-border rounded-xl p-5">
      <p className="text-hp-accent text-[10px] font-semibold uppercase tracking-widest mb-1">Analysis</p>
      <h2 className="text-sm font-bold text-hp-text mb-4">Team Insights</h2>

      <div className="space-y-2 mb-6">
        {insights.map((ins, i) => {
          const s = SEVERITY_STYLES[ins.severity] || SEVERITY_STYLES.info
          return (
            <div key={i} className={`flex gap-3 items-start p-3 rounded-lg border ${s.bg} ${s.border}`}>
              <div className={`w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${s.dot}`} />
              <p className={`text-xs leading-relaxed ${s.label}`}>{ins.text}</p>
            </div>
          )
        })}
      </div>

      {/* Avg stats bar chart */}
      <p className="text-[10px] text-hp-muted uppercase tracking-widest mb-3">Average Stats</p>
      <div className="space-y-1.5">
        {[
          { key: 'hp',  label: 'HP',  max: 255 },
          { key: 'atk', label: 'Atk', max: 134 },
          { key: 'def', label: 'Def', max: 230 },
          { key: 'spa', label: 'SpA', max: 154 },
          { key: 'spd', label: 'SpD', max: 230 },
          { key: 'spe', label: 'Spe', max: 140 },
        ].map(({ key, label, max }) => {
          const val = avgStats[key]
          const pct = Math.round(val / max * 100)
          const color = pct > 65 ? '#39d353' : pct > 35 ? '#f0b429' : '#e05252'
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="text-[10px] text-hp-muted w-7 text-right font-mono">{label}</span>
              <div className="flex-1 h-1.5 bg-hp-border rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
              </div>
              <span className="text-[10px] text-hp-muted w-7 font-mono">{val}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── page ───────────────────────────────────────────────────────────────────────
export default function TeamBuilder() {
  const [team, setTeam] = useState(Array(6).fill(null))

  function setSlot(i, pokemon) {
    setTeam(t => { const n = [...t]; n[i] = pokemon; return n })
  }
  function clearSlot(i) {
    setTeam(t => { const n = [...t]; n[i] = null; return n })
  }
  function clearAll() {
    setTeam(Array(6).fill(null))
  }

  const members = team.filter(Boolean)
  const coverage   = members.length > 0 ? getOffensiveCoverage(team) : null
  const weaknesses = members.length > 0 ? getTeamWeaknesses(team) : null
  const analysis   = members.length > 0 ? analyzeTeam(team) : null
  const insights   = analysis ? generateInsights(team, analysis, coverage, weaknesses) : []

  return (
    <div
      className="min-h-screen bg-hp-bg text-hp-text"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      <Nav />
      <Meta title="GSC Team Builder" description="Build and analyze your Gen 2 / Crystal team — coverage, weaknesses, and composition." />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">Tool</p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-hp-text">GSC Team Builder</h1>
              <p className="text-hp-muted text-sm mt-1.5">
                Pick up to 6 Pokémon and see your team's coverage, weaknesses, and stat profile.
              </p>
            </div>
            {members.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-hp-muted hover:text-red-400 border border-hp-border hover:border-red-500/30 px-3 py-1.5 rounded transition-colors flex-shrink-0"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* 6-slot grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          {team.map((pokemon, i) => (
            <PokemonSlot
              key={i}
              index={i}
              pokemon={pokemon}
              onSelect={p => setSlot(i, p)}
              onClear={() => clearSlot(i)}
            />
          ))}
        </div>

        {members.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <OffensiveCoverage coverage={coverage} />
            <DefensiveHeatmap weaknesses={weaknesses} memberCount={members.length} />
            <div className="sm:col-span-2">
              <TeamInsights insights={insights} analysis={analysis} />
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-hp-border rounded-xl">
            <p className="text-hp-muted text-sm">Add Pokémon to see your team analysis.</p>
            <p className="text-hp-muted/50 text-xs mt-1">Click any slot above to search and pick a Pokémon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
