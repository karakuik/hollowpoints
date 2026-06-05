import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Meta from '../components/Meta'
import { posts } from '../lib/posts'

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
  { key: 'alpha',  label: 'A–Z' },
]

function sortPosts(list, sort) {
  const copy = [...list]
  if (sort === 'newest') return copy.sort((a, b) => new Date(b.date) - new Date(a.date))
  if (sort === 'oldest') return copy.sort((a, b) => new Date(a.date) - new Date(b.date))
  if (sort === 'alpha')  return copy.sort((a, b) => a.title.localeCompare(b.title))
  return copy
}

function FeaturedCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="relative block bg-hp-surface border border-hp-border rounded-xl p-7 mb-6 overflow-hidden group
                 hover:border-hp-accent/50 transition-all duration-300
                 hover:shadow-[0_0_40px_rgba(255,69,0,0.08)]"
    >
      {/* subtle accent gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-hp-accent/[0.04] via-transparent to-transparent pointer-events-none" />

      <p className="relative text-hp-accent text-xs font-semibold uppercase tracking-widest mb-4">
        Latest Post
      </p>
      <h2 className="relative text-2xl sm:text-3xl font-bold text-hp-text group-hover:text-hp-accent transition-colors duration-200 leading-snug mb-3">
        {post.title}
      </h2>
      <p className="relative text-xs text-hp-muted mb-3">{post.date}</p>
      {post.description && (
        <p className="relative text-sm text-hp-text/60 leading-relaxed max-w-xl">
          {post.description}
        </p>
      )}
      <p className="relative mt-5 text-xs font-semibold text-hp-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200 uppercase tracking-wider">
        Read post →
      </p>
    </Link>
  )
}

function GlowCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="flex flex-col bg-hp-surface border border-hp-border rounded-lg p-5 group
                 hover:border-hp-accent/50 hover:bg-hp-elevated transition-all duration-200
                 hover:shadow-[0_0_24px_rgba(255,69,0,0.07)]"
    >
      <h2 className="text-sm font-semibold text-hp-text group-hover:text-hp-accent transition-colors duration-150 leading-snug mb-2">
        {post.title}
      </h2>
      {post.description && (
        <p className="text-xs text-hp-muted leading-relaxed line-clamp-2 flex-1">
          {post.description}
        </p>
      )}
      <p className="text-xs text-hp-muted mt-3 pt-3 border-t border-hp-border">{post.date}</p>
    </Link>
  )
}

export default function Blog() {
  const [query, setQuery] = useState('')
  const [sort, setSort]   = useState('newest')

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

  // Only show the hero featured card on the default unfiltered view
  const showFeatured = query.trim() === '' && sort === 'newest' && visiblePosts.length > 0
  const featuredPost = showFeatured ? visiblePosts[0] : null
  const gridPosts    = showFeatured ? visiblePosts.slice(1) : visiblePosts

  return (
    <Layout>
      <Meta title="Blog" description="Writing on things I care about." />

      <div className="mb-10">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">Writing</p>
        <h1 className="text-4xl font-bold text-hp-text">Blog</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="search"
          placeholder="Search posts..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 bg-hp-surface border border-hp-border rounded px-4 py-2.5 text-sm text-hp-text
                     placeholder:text-hp-muted focus:outline-none focus:border-hp-accent transition-colors"
        />
        <div className="flex gap-1.5">
          {SORT_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded border transition-colors ${
                sort === key
                  ? 'bg-hp-accent text-white border-hp-accent'
                  : 'bg-hp-surface border-hp-border text-hp-muted hover:text-hp-text'
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
        <>
          {featuredPost && <FeaturedCard post={featuredPost} />}

          {gridPosts.length > 0 && (
            <ul className="grid sm:grid-cols-2 gap-3">
              {gridPosts.map(post => (
                <li key={post.slug}>
                  <GlowCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Layout>
  )
}
