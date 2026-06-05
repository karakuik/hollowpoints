import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Meta from '../components/Meta'

// ── Steam live data ────────────────────────────────────────────────────────────
function SteamRecent() {
  const [games,   setGames]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/.netlify/functions/steam?type=recent')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.games?.length) setGames(d.games.slice(0, 3)) })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !games) return null

  return (
    <div className="mt-3 bg-hp-elevated border border-hp-border/60 rounded-lg p-4">
      <p className="text-[10px] text-hp-muted uppercase tracking-widest mb-3">Recent on Steam</p>
      <ul className="space-y-2">
        {games.map(g => (
          <li key={g.appid} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {g.icon && (
                <img src={g.icon} alt="" className="w-5 h-5 rounded flex-shrink-0" />
              )}
              <span className="text-xs text-hp-text truncate">{g.name}</span>
            </div>
            {g.playtime_2weeks > 0 && (
              <span className="text-[10px] text-hp-muted flex-shrink-0">
                {(g.playtime_2weeks / 60).toFixed(1)}h this week
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── static content ─────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    label: 'Playing',
    icon: '▶',
    content: (
      <>
        <div className="bg-hp-surface border border-hp-border rounded-lg px-5 py-4">
          <p className="text-sm font-semibold text-hp-text">Call of Duty: Warzone</p>
          <p className="text-xs text-hp-muted mt-0.5">Ranked grind, Season 4 — RAM-7 + Renetti</p>
        </div>
        <div className="bg-hp-surface border border-hp-border rounded-lg px-5 py-4">
          <p className="text-sm font-semibold text-hp-text">Pokémon Crystal</p>
          <p className="text-xs text-hp-muted mt-0.5">Another playthrough. It's a sickness.</p>
        </div>
        <SteamRecent />
      </>
    ),
  },
  {
    label: 'Building',
    icon: '⚙',
    items: [
      { primary: 'hollowpoints.gg', secondary: 'This site — tools, writing, maybe a backend someday' },
    ],
  },
  {
    label: 'Listening',
    icon: '♪',
    items: [
      { primary: 'Whatever\'s in the queue', secondary: 'Usually something loud while grinding ranked' },
    ],
  },
  {
    label: 'Watching',
    icon: '◉',
    items: [
      { primary: 'Pro Warzone VODs', secondary: 'Strats I study but will never execute under pressure' },
    ],
  },
]

export default function Now() {
  return (
    <Layout>
      <Meta title="Now" description="What I'm currently playing, building, and paying attention to." />

      <div className="mb-10">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">Status</p>
        <h1 className="text-4xl font-bold text-hp-text">Now</h1>
        <p className="text-hp-muted text-sm mt-3 max-w-lg">
          A snapshot of what I'm up to. Updated whenever something changes.{' '}
          <a href="https://nownownow.com" target="_blank" rel="noreferrer" className="text-hp-accent hover:underline">
            /now pages
          </a>{' '}
          are a thing.
        </p>
      </div>

      <div className="space-y-8">
        {SECTIONS.map(({ label, icon, items, content }) => (
          <section key={label}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono text-hp-accent">{icon}</span>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-hp-muted">{label}</h2>
            </div>
            {content ? (
              <div className="space-y-2">{content}</div>
            ) : (
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="bg-hp-surface border border-hp-border rounded-lg px-5 py-4">
                    <p className="text-sm font-semibold text-hp-text">{item.primary}</p>
                    {item.secondary && <p className="text-xs text-hp-muted mt-0.5">{item.secondary}</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <p className="text-hp-muted/40 text-xs mt-12">Last updated: June 2026</p>
    </Layout>
  )
}
