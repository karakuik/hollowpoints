import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Meta from '../components/Meta'
import Reactions from '../components/Reactions'
import ViewCount from '../components/ViewCount'
import { getPost } from '../lib/posts'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)

  if (!post) {
    return (
      <Layout>
        <div className="py-16 text-center">
          <p className="text-hp-muted text-sm mb-4">404 — post not found</p>
          <Link to="/blog" className="text-hp-accent hover:opacity-80 text-sm font-semibold transition-opacity">
            ← Back to blog
          </Link>
        </div>
      </Layout>
    )
  }

  const PostContent = post.component

  return (
    <Layout>
      <Meta title={post.title} description={post.description} />
      <article className="max-w-2xl">
        <header className="mb-10 pb-8 border-b border-hp-border">
          <Link
            to="/blog"
            className="text-hp-muted hover:text-hp-accent text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            ← Blog
          </Link>
          <h1 className="text-4xl font-bold mt-5 mb-3 text-hp-text leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-hp-muted text-sm">{post.date}</p>
            <span className="text-hp-border">·</span>
            <ViewCount slug={slug} />
          </div>
        </header>

        <div className="prose prose-invert [--tw-prose-invert-links:rgb(var(--hp-accent))] max-w-none">
          <PostContent />
        </div>

        <Reactions slug={slug} />
      </article>
    </Layout>
  )
}
