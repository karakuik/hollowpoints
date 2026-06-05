import { useState } from 'react'
import Layout from '../components/Layout'
import Meta from '../components/Meta'

export default function Guestbook() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    const data = new FormData(e.target)
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString(),
    })
      .then(() => setSubmitted(true))
      .catch(() => alert('Something went wrong — try again.'))
      .finally(() => setSubmitting(false))
  }

  return (
    <Layout>
      <Meta title="Guestbook" description="Leave a note. Say hi." />

      <div className="mb-10">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">Community</p>
        <h1 className="text-4xl font-bold text-hp-text">Guestbook</h1>
        <p className="text-hp-muted text-sm mt-3">
          Leave a note. Say hi. Tell me what you're running this season.
        </p>
      </div>

      <div className="max-w-lg">
        {submitted ? (
          <div className="bg-hp-surface border border-green-500/20 rounded-xl p-8 text-center">
            <p className="text-green-400 font-semibold mb-2">Note received.</p>
            <p className="text-hp-muted text-sm">Thanks for signing the guestbook.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-5 text-xs text-hp-accent hover:underline"
            >
              Leave another →
            </button>
          </div>
        ) : (
          <form
            name="guestbook"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="bg-hp-surface border border-hp-border rounded-xl p-6 space-y-4"
          >
            {/* Required hidden fields for Netlify Forms */}
            <input type="hidden" name="form-name" value="guestbook" />
            <div className="hidden" aria-hidden="true">
              <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-hp-muted uppercase tracking-wider mb-1.5">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                maxLength={80}
                placeholder="Your name or handle"
                className="w-full bg-hp-bg border border-hp-border rounded-lg px-4 py-2.5 text-sm text-hp-text placeholder:text-hp-muted focus:outline-none focus:border-hp-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-hp-muted uppercase tracking-wider mb-1.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                required
                rows={4}
                maxLength={500}
                placeholder="Say something..."
                className="w-full bg-hp-bg border border-hp-border rounded-lg px-4 py-2.5 text-sm text-hp-text placeholder:text-hp-muted focus:outline-none focus:border-hp-accent transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-hp-muted uppercase tracking-wider mb-1.5">
                Website <span className="font-normal normal-case text-hp-muted">(optional)</span>
              </label>
              <input
                type="url"
                name="url"
                placeholder="https://..."
                className="w-full bg-hp-bg border border-hp-border rounded-lg px-4 py-2.5 text-sm text-hp-text placeholder:text-hp-muted focus:outline-none focus:border-hp-accent transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-hp-accent hover:bg-hp-accent/90 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              {submitting ? 'Sending...' : 'Sign guestbook →'}
            </button>
          </form>
        )}

        <p className="text-hp-muted/40 text-xs mt-6">
          Submissions are reviewed before appearing publicly.
        </p>
      </div>
    </Layout>
  )
}
