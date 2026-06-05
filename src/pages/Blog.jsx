import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Meta from '../components/Meta'
import { posts } from '../lib/posts'

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'alpha', label: 'A–Z' },
]

function sortPosts(list, sort) {
  const copy = [...list]
  if (sort === 'newest') return copy.sort((a, b) => new Date(b.date) - new Date(a.date))
  if (sort === 'oldest') return copy.sort((a, b) => new Date(a.date) - new Date(b.date))
  if (sort === 'alpha') return copy.sort((a, b) => a.title.localeCompare(b.title))
  return copy
}

export default function Blog() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')

  const visiblePosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? posts.filter(
          p =>
            p.title?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        )
      : posts
    return sortPosts(filtered, sort)
  }, [query, sort])

  return (
    <Layout>
      <Meta title="Blog" description="Writing on things I care about." />

      <div className="mb-10">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">
          Writing
        </p>
        <h1 className="text-4xl font-bold text-hp-text">Blog</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="search"
          placeholder="Search posts..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 bg-hp-surface border border-hp-border rounded px-4 py-2.5 text-sm text-hp-text placeholder:text-hp-muted focus:outline-none focus:border-hp-accent transition-colors"
        />
        <div className="flex gap-1.5">
          {SORT_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded border transition-colors ${
                sort === key
                  ? 'bg-hp-accent text-white border-hp-accent'
                  : 'bg-hp-surface border-hp-border text-hp-muted hover:text-hp-text hover:border-hp-border/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {visiblePosts.length === 0 ? (
        <p className="text-hp-muted text-sm">No posts match your search.</p>
      ) : (
        <ul className="space-y-3">
          {visiblePosts.map(post => (
            <li key={post.slug}>
              <Link
                to={`/blog/${post.slug}`}
                className="flex items-start justify-between gap-6 bg-hp-surface border border-hp-border rounded-lg px-5 py-4 hover:border-hp-accent/50 hover:bg-hp-elevated transition-colors group"
              >
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-hp-text group-hover:text-hp-accent transition-colors truncate">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-xs text-hp-muted mt-1 line-clamp-1">
                      {post.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-hp-muted whitespace-nowrap pt-0.5 shrink-0">
                  {post.date}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  )
}
