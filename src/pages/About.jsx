import Layout from '../components/Layout'
import Meta from '../components/Meta'

export default function About() {
  return (
    <Layout>
      <Meta title="About" description="A bit about me." />

      <div className="mb-10">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">
          Who
        </p>
        <h1 className="text-4xl font-bold text-hp-text">About</h1>
      </div>

      <div className="prose prose-invert [--tw-prose-invert-links:#ff4500] max-w-xl">
        <p>I'm Ryan, a 29 year old Software Engineer and I like to make cool shit whether its for me or for others to use.</p>
      </div>
    </Layout>
  )
}
