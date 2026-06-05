import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const EMOJIS = ['🔥', '💯', '🤯', '👏', '❤️']

function getFingerprint() {
  let fp = localStorage.getItem('hp-fp')
  if (!fp) { fp = crypto.randomUUID(); localStorage.setItem('hp-fp', fp) }
  return fp
}

export default function Reactions({ slug }) {
  const [counts,  setCounts]  = useState({})
  const [mine,    setMine]    = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fp = getFingerprint()

    async function load() {
      const [{ data: all }, { data: myReacts }] = await Promise.all([
        supabase.from('reactions').select('emoji').eq('slug', slug),
        supabase.from('reactions').select('emoji').eq('slug', slug).eq('fingerprint', fp),
      ])

      const c = {}
      for (const { emoji } of all || []) c[emoji] = (c[emoji] || 0) + 1
      setCounts(c)
      setMine(new Set((myReacts || []).map(r => r.emoji)))
      setLoading(false)
    }

    load()
  }, [slug])

  async function react(emoji) {
    const fp = getFingerprint()
    if (mine.has(emoji)) return  // already reacted, no toggle

    // Optimistic update
    setCounts(c => ({ ...c, [emoji]: (c[emoji] || 0) + 1 }))
    setMine(m => new Set([...m, emoji]))

    const { error } = await supabase.from('reactions').insert({ slug, emoji, fingerprint: fp })
    if (error) {
      // Revert on failure (e.g. duplicate)
      setCounts(c => ({ ...c, [emoji]: Math.max(0, (c[emoji] || 1) - 1) }))
      setMine(m => { const n = new Set(m); n.delete(emoji); return n })
    }
  }

  if (loading) return null

  return (
    <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-hp-border">
      {EMOJIS.map(emoji => {
        const count   = counts[emoji] || 0
        const reacted = mine.has(emoji)
        return (
          <button
            key={emoji}
            onClick={() => react(emoji)}
            title={reacted ? 'Already reacted' : 'React'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all ${
              reacted
                ? 'bg-hp-accent/15 border-hp-accent/40 scale-105'
                : 'bg-hp-surface border-hp-border hover:border-hp-accent/30 hover:bg-hp-elevated'
            } ${reacted ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <span>{emoji}</span>
            {count > 0 && (
              <span className={`text-xs font-semibold ${reacted ? 'text-hp-accent' : 'text-hp-muted'}`}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
