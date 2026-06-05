import { useState, useEffect, lazy, Suspense } from 'react'
import Layout from '../components/Layout'
import Meta from '../components/Meta'
import { supabase } from '../lib/supabase'

const PinMap = lazy(() => import('../components/PinMap'))

function EntryCard({ entry }) {
  return (
    <div className="bg-hp-surface border border-hp-border rounded-lg px-5 py-4">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="text-sm font-semibold text-hp-text">
          {entry.url ? (
            <a href={entry.url} target="_blank" rel="noreferrer" className="hover:text-hp-accent transition-colors">
              {entry.name}
            </a>
          ) : entry.name}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {entry.location && (
            <span className="text-[10px] text-hp-muted/60">📍 {entry.location}</span>
          )}
          <span className="text-[10px] text-hp-muted">
            {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
      <p className="text-sm text-hp-text/70 leading-relaxed">{entry.message}</p>
    </div>
  )
}

export default function Guestbook() {
  const [submitted,  setSubmitted]  = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [entries,    setEntries]    = useState([])
  const [pins,       setPins]       = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([
      supabase
        .from('guestbook')
        .select('id,name,message,url,location,created_at')
        .eq('approved', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('visitor_pins')
        .select('id,lat,lng,label,created_at')
        .order('created_at', { ascending: false }),
    ]).then(([{ data: g }, { data: p }]) => {
      if (g) setEntries(g)
      if (p) setPins(p)
      setLoading(false)
    })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const fd = new FormData(e.target)
    const body = {
      name:     fd.get('name'),
      message:  fd.get('message'),
      url:      fd.get('url'),
      location: fd.get('location'),
    }

    try {
      const res = await fetch('/.netlify/functions/guestbook-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setSubmitted(true)
        // Refresh pins in case a new one was geocoded
        supabase
          .from('visitor_pins')
          .select('id,lat,lng,label,created_at')
          .order('created_at', { ascending: false })
          .then(({ data }) => { if (data) setPins(data) })
      } else {
        alert('Something went wrong — try again.')
      }
    } catch {
      alert('Something went wrong — try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <Meta title="Guestbook" description="Leave a note. Say hi." />

      <div className="mb-8">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">Community</p>
        <h1 className="text-4xl font-bold text-hp-text">Guestbook</h1>
        <p className="text-hp-muted text-sm mt-2">
          Leave a note. Drop a pin. {pins.length > 0 && `${pins.length} visitors from around the world.`}
        </p>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-hp-border mb-8">
        {loading ? (
          <div className="bg-hp-surface flex items-center justify-center" style={{ height: '42vh' }}>
            <span className="text-hp-muted text-sm">Loading map…</span>
          </div>
        ) : (
          <Suspense fallback={
            <div className="bg-hp-surface flex items-center justify-center" style={{ height: '42vh' }}>
              <span className="text-hp-muted text-sm">Loading map…</span>
            </div>
          }>
            <PinMap pins={pins} height="42vh" />
          </Suspense>
        )}
      </div>

      {/* Form + Entries */}
      <div className="grid sm:grid-cols-2 gap-8 items-start">
        <div>
          {submitted ? (
            <div className="bg-hp-surface border border-green-500/20 rounded-xl p-8 text-center">
              <p className="text-green-400 font-semibold mb-2">Note received.</p>
              <p className="text-hp-muted text-sm">It'll appear here once approved.</p>
              <button onClick={() => setSubmitted(false)} className="mt-5 text-xs text-hp-accent hover:underline">
                Leave another →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-hp-surface border border-hp-border rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-hp-muted uppercase tracking-wider mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="name" required maxLength={80}
                  placeholder="Your name or handle"
                  className="w-full bg-hp-bg border border-hp-border rounded-lg px-4 py-2.5 text-sm text-hp-text placeholder:text-hp-muted focus:outline-none focus:border-hp-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-hp-muted uppercase tracking-wider mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message" required rows={4} maxLength={500}
                  placeholder="Say something..."
                  className="w-full bg-hp-bg border border-hp-border rounded-lg px-4 py-2.5 text-sm text-hp-text placeholder:text-hp-muted focus:outline-none focus:border-hp-accent transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-hp-muted uppercase tracking-wider mb-1.5">
                    Location <span className="font-normal normal-case text-hp-muted">(optional)</span>
                  </label>
                  <input
                    type="text" name="location" maxLength={100}
                    placeholder="City, country…"
                    className="w-full bg-hp-bg border border-hp-border rounded-lg px-4 py-2.5 text-sm text-hp-text placeholder:text-hp-muted focus:outline-none focus:border-hp-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-hp-muted uppercase tracking-wider mb-1.5">
                    Website <span className="font-normal normal-case text-hp-muted">(optional)</span>
                  </label>
                  <input
                    type="url" name="url" placeholder="https://…"
                    className="w-full bg-hp-bg border border-hp-border rounded-lg px-4 py-2.5 text-sm text-hp-text placeholder:text-hp-muted focus:outline-none focus:border-hp-accent transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-hp-accent hover:bg-hp-accent/90 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                {submitting ? 'Sending…' : 'Sign guestbook →'}
              </button>
              <p className="text-hp-muted/40 text-xs text-center">
                Reviewed before appearing publicly. Location pins the map automatically.
              </p>
            </form>
          )}
        </div>

        <div>
          {loading ? (
            <p className="text-hp-muted text-sm">Loading entries…</p>
          ) : entries.length === 0 ? (
            <div className="border border-dashed border-hp-border rounded-xl p-8 text-center">
              <p className="text-hp-muted text-sm">No entries yet — be the first.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map(entry => <EntryCard key={entry.id} entry={entry} />)}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
