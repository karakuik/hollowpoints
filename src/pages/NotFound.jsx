import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Meta from '../components/Meta'

export default function NotFound() {
  return (
    <Layout>
      <Meta title="404" description="Page not found." />

      <div className="mb-10">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">
          404
        </p>
        <h1 className="text-4xl font-bold text-hp-text">Page not found.</h1>
      </div>

      <p className="text-hp-muted mb-6">
        That URL doesn't exist.{' '}
        <Link to="/" className="text-hp-accent hover:underline">Go home →</Link>
      </p>
    </Layout>
  )
}
