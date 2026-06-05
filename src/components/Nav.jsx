import { useRef, useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTheme, THEMES } from '../lib/theme'

// Add new projects here — they'll appear in the nav dropdown automatically
const PROJECT_LINKS = [
  { to: '/pokedex',       label: 'Crystal Pokédex' },
  { to: '/team-builder',  label: 'GSC Team Builder' },
]

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative ml-1">
      <button
        onClick={() => setOpen(o => !o)}
        title="Switch theme"
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest rounded transition-colors ${
          open ? 'text-hp-accent' : 'text-hp-muted hover:text-hp-text'
        }`}
      >
        {/* Small accent-colored dot showing current theme */}
        <span
          className="w-2 h-2 rounded-full flex-shrink-0 transition-colors"
          style={{ background: THEMES[theme].dot }}
        />
        <span className="hidden sm:inline">{THEMES[theme].label}</span>
        <svg className="w-2 h-2 opacity-60" fill="currentColor" viewBox="0 0 8 8">
          <path d="M4 6 L0 2 L8 2 Z" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 pt-1 z-50">
          <div className="bg-hp-surface border border-hp-border rounded-lg py-1.5 min-w-36 shadow-lg shadow-black/60">
            {Object.entries(THEMES).map(([key, { label, dot }]) => (
              <button
                key={key}
                onClick={() => { setTheme(key); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs transition-colors ${
                  theme === key
                    ? 'text-hp-text bg-hp-elevated'
                    : 'text-hp-muted hover:text-hp-text hover:bg-hp-elevated'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dot }} />
                {label}
                {theme === key && <span className="ml-auto text-hp-accent">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Nav() {
  return (
    <header className="bg-hp-surface border-b border-hp-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold text-base tracking-tight text-hp-text hover:text-white transition-colors"
        >
          HOLLOWPOINTS<span className="text-hp-accent">.GG</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `px-3 py-1.5 text-xs font-semibold uppercase tracking-widest rounded transition-colors ${
                isActive ? 'text-hp-accent' : 'text-hp-muted hover:text-hp-text'
              }`
            }
          >
            Blog
          </NavLink>

          {/* Projects — clickable link + hover dropdown */}
          <div className="relative group">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs font-semibold uppercase tracking-widest rounded transition-colors inline-flex items-center gap-1 ${
                  isActive ? 'text-hp-accent' : 'text-hp-muted hover:text-hp-text'
                }`
              }
            >
              Projects
              <svg className="w-2 h-2 opacity-60" fill="currentColor" viewBox="0 0 8 8">
                <path d="M4 6 L0 2 L8 2 Z" />
              </svg>
            </NavLink>

            {/* Dropdown */}
            <div className="absolute top-full left-0 pt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150">
              <div className="bg-hp-surface border border-hp-border rounded-lg py-1.5 min-w-44 shadow-lg shadow-black/60">
                {PROJECT_LINKS.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center px-4 py-2 text-xs text-hp-muted hover:text-hp-text hover:bg-hp-elevated transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <NavLink
            to="/now"
            className={({ isActive }) =>
              `px-3 py-1.5 text-xs font-semibold uppercase tracking-widest rounded transition-colors ${
                isActive ? 'text-hp-accent' : 'text-hp-muted hover:text-hp-text'
              }`
            }
          >
            Now
          </NavLink>

          <NavLink
            to="/guestbook"
            className={({ isActive }) =>
              `px-3 py-1.5 text-xs font-semibold uppercase tracking-widest rounded transition-colors ${
                isActive ? 'text-hp-accent' : 'text-hp-muted hover:text-hp-text'
              }`
            }
          >
            Guestbook
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-3 py-1.5 text-xs font-semibold uppercase tracking-widest rounded transition-colors ${
                isActive ? 'text-hp-accent' : 'text-hp-muted hover:text-hp-text'
              }`
            }
          >
            About
          </NavLink>

          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  )
}
