import Nav from './Nav'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-hp-bg text-hp-text">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-12">{children}</main>
    </div>
  )
}
