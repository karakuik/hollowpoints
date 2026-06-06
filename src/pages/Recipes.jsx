import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import Meta from '../components/Meta'
import { CATEGORIES, RECIPES } from '../data/recipes'

// ── Difficulty badge ──────────────────────────────────────────────────────────
function DifficultyBadge({ level }) {
  const map = {
    Easy:   'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    Medium: 'text-amber-400  bg-amber-400/10  border-amber-400/20',
    Hard:   'text-red-400    bg-red-400/10    border-red-400/20',
  }
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${map[level] ?? ''}`}>
      {level}
    </span>
  )
}

// ── Individual recipe card ────────────────────────────────────────────────────
function RecipeCard({ recipe, catColor, index, onClick }) {
  return (
    <button
      onClick={() => onClick(recipe)}
      className="w-full text-left bg-hp-surface border border-hp-border rounded-xl p-5 group
                 hover:border-[--cat-color]/50 hover:bg-hp-elevated transition-all duration-200
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--cat-color]/50"
      style={{
        '--cat-color': catColor,
        animation: 'recipe-card-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: `${index * 0.07}s`,
      }}
    >
      <div
        className="w-full h-0.5 rounded-full mb-4 opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: catColor }}
      />
      <h3 className="font-bold text-hp-text text-base leading-snug mb-1 group-hover:text-[--cat-color] transition-colors duration-150">
        {recipe.title}
      </h3>
      <p className="text-hp-muted text-xs leading-relaxed mb-4 line-clamp-2">
        {recipe.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DifficultyBadge level={recipe.difficulty} />
          <span className="text-hp-muted text-[10px] uppercase tracking-wider">{recipe.time}</span>
        </div>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{ color: catColor }}
        >
          View →
        </span>
      </div>
    </button>
  )
}

// ── Recipe detail modal ───────────────────────────────────────────────────────
function RecipeModal({ recipe, catColor, onClose }) {
  const [visible, setVisible] = useState(false)
  const overlayRef = useRef(null)

  useEffect(() => {
    // Slight delay so the initial render is in the hidden state, enabling the transition
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 350)
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) handleClose()
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{
        background: `rgba(0,0,0,${visible ? 0.7 : 0})`,
        backdropFilter: `blur(${visible ? 8 : 0}px)`,
        transition: 'background 0.35s ease, backdrop-filter 0.35s ease',
      }}
    >
      <div
        className="relative w-full sm:max-w-2xl max-h-[92vh] bg-hp-surface border border-hp-border
                   rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(60px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease',
        }}
      >
        {/* Colored accent bar */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: catColor }} />

        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-6 pb-4 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-hp-text leading-tight">{recipe.title}</h2>
            <p className="text-hp-muted text-sm mt-1">{recipe.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <DifficultyBadge level={recipe.difficulty} />
              <span className="text-hp-muted text-xs">{recipe.time}</span>
              <span className="text-hp-muted text-xs">Serves {recipe.servings}</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 mt-0.5 flex-shrink-0 text-hp-muted hover:text-hp-text transition-colors p-1 -mr-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-t border-hp-border mx-7 flex-shrink-0" />

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-7 py-6 space-y-8">

          {/* Ingredients */}
          <section>
            <h3
              className="text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ color: catColor }}
            >
              Ingredients
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-hp-text">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: catColor }}
                  />
                  {ing}
                </li>
              ))}
            </ul>
          </section>

          {/* Steps */}
          <section>
            <h3
              className="text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ color: catColor }}
            >
              Steps
            </h3>
            <ol className="space-y-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                    style={{ background: `${catColor}22`, color: catColor, border: `1px solid ${catColor}44` }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm text-hp-text leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Notes */}
          {recipe.notes && (
            <section>
              <h3
                className="text-[10px] font-bold uppercase tracking-widest mb-3"
                style={{ color: catColor }}
              >
                Notes
              </h3>
              <p className="text-sm text-hp-muted leading-relaxed italic border-l-2 pl-4"
                 style={{ borderColor: `${catColor}44` }}>
                {recipe.notes}
              </p>
            </section>
          )}

          <div className="h-2" />
        </div>
      </div>
    </div>
  )
}

// ── Category tab card ─────────────────────────────────────────────────────────
function CategoryTab({ category, isActive, onClick, recipeCount, index }) {
  const { color, label, description } = category

  return (
    <button
      onClick={onClick}
      className="group relative flex-1 min-w-0 text-left rounded-xl border transition-all duration-300 focus:outline-none"
      style={{
        background: isActive ? `${color}0d` : 'rgb(var(--hp-surface))',
        borderColor: isActive ? `${color}66` : 'rgb(var(--hp-border))',
        transform: isActive ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isActive ? `0 8px 32px ${color}22, 0 2px 8px rgba(0,0,0,0.4)` : 'none',
        animation: 'cat-tab-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* Colored top bar */}
      <div
        className="h-1 w-full rounded-t-xl transition-all duration-300"
        style={{
          background: color,
          opacity: isActive ? 1 : 0.35,
        }}
      />

      <div className="px-4 py-4 sm:px-5">
        {/* Category name */}
        <p
          className="font-bold text-sm sm:text-base tracking-tight transition-colors duration-200"
          style={{ color: isActive ? color : 'rgb(var(--hp-text))' }}
        >
          {label}
        </p>

        {/* Description — hidden on mobile */}
        <p className="hidden sm:block text-hp-muted text-xs mt-1 leading-snug line-clamp-1">
          {description}
        </p>

        {/* Recipe count */}
        <div className="flex items-center justify-between mt-3">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: isActive ? color : 'rgb(var(--hp-muted))' }}
          >
            {recipeCount} recipe{recipeCount !== 1 ? 's' : ''}
          </span>
          <svg
            className="w-3.5 h-3.5 transition-transform duration-300"
            style={{
              color: isActive ? color : 'rgb(var(--hp-muted))',
              transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Recipes() {
  const [activeCat, setActiveCat]     = useState(CATEGORIES[0].id)
  const [selectedRecipe, setSelected] = useState(null)
  const [cardKey, setCardKey]         = useState(0)

  function selectCategory(id) {
    if (id === activeCat) return
    setActiveCat(id)
    setCardKey(k => k + 1)
  }

  const category      = CATEGORIES.find(c => c.id === activeCat)
  const visibleRecipes = RECIPES.filter(r => r.category === activeCat)

  const countByCategory = Object.fromEntries(
    CATEGORIES.map(c => [c.id, RECIPES.filter(r => r.category === c.id).length])
  )

  return (
    <Layout>
      <Meta title="Recipes" description="A personal cookbook — pastas, meats, cocktails." />

      {/* Header */}
      <div className="mb-10">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">Kitchen Notebook</p>
        <h1 className="text-4xl font-bold text-hp-text mb-3">Recipes</h1>
        <p className="text-hp-muted text-sm max-w-md">
          The ones worth keeping. Click a category, pick a recipe.
        </p>
      </div>

      {/* Category rolodex tabs */}
      <div className="flex gap-3 mb-10">
        {CATEGORIES.map((cat, i) => (
          <CategoryTab
            key={cat.id}
            category={cat}
            isActive={activeCat === cat.id}
            onClick={() => selectCategory(cat.id)}
            recipeCount={countByCategory[cat.id]}
            index={i}
          />
        ))}
      </div>

      {/* Active category label */}
      <div
        className="flex items-center gap-3 mb-6"
        key={`label-${activeCat}`}
        style={{ animation: 'recipe-card-in 0.3s ease both' }}
      >
        <div className="h-px flex-1 bg-hp-border" />
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-3"
          style={{ color: category.color }}
        >
          {category.label}
        </span>
        <div className="h-px flex-1 bg-hp-border" />
      </div>

      {/* Recipe grid */}
      <div
        key={cardKey}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {visibleRecipes.map((recipe, i) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            catColor={category.color}
            index={i}
            onClick={setSelected}
          />
        ))}
      </div>

      {/* Recipe modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          catColor={category.color}
          onClose={() => setSelected(null)}
        />
      )}
    </Layout>
  )
}
