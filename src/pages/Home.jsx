import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Meta from '../components/Meta'

export default function Home() {
  return (
    <Layout>
      <Meta description="Personal site and blog." />
      <section className="py-16 sm:py-24">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-6">
          hollowpoints.gg
        </p>
        <h1 className="text-5xl sm:text-7xl font-bold text-hp-text leading-none tracking-tight mb-6">
          Hi, I'm<br />
          <span className="text-hp-accent">[Your Name]</span>
        </h1>
        <p className="text-hp-muted text-lg max-w-lg leading-relaxed mb-10">
          I write about things I care about and build projects that interest me.
          Welcome to my corner of the internet.
        </p>
        <div className="flex gap-3">
          <Link
            to="/blog"
            className="px-5 py-2.5 bg-hp-accent text-white text-sm font-semibold rounded hover:opacity-90 transition-opacity"
          >
            Read the Blog
          </Link>
          <Link
            to="/projects"
            className="px-5 py-2.5 bg-hp-surface border border-hp-border text-hp-text text-sm font-semibold rounded hover:border-hp-accent/50 transition-colors"
          >
            View Projects
          </Link>
        </div>
      </section>
    </Layout>
  )
}
