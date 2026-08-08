import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Projects from './pages/Projects'
import About from './pages/About'
import Pokedex from './pages/Pokedex'
import TeamBuilder from './pages/TeamBuilder'
import Now from './pages/Now'
import Guestbook from './pages/Guestbook'
import Recipes from './pages/Recipes'
import NotFound from './pages/NotFound'

// Leaflet is large — only load when someone visits /map
const VisitorMap = lazy(() => import('./pages/VisitorMap'))
// WoW tracker data modules are per-profession and dynamic-imported by
// ProfessionTracker itself — keep the page component lazy too so an
// unrelated visitor never pulls any of it into the main bundle.
const WowHub = lazy(() => import('./pages/wow/WowHub'))
const ProfessionTracker = lazy(() => import('./pages/wow/ProfessionTracker'))

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<Home />} />
      <Route path="/blog"        element={<Blog />} />
      <Route path="/blog/:slug"  element={<BlogPost />} />
      <Route path="/projects"    element={<Projects />} />
      <Route path="/pokedex"     element={<Pokedex />} />
      <Route path="/team-builder" element={<TeamBuilder />} />
      <Route path="/now"         element={<Now />} />
      <Route path="/guestbook"   element={<Guestbook />} />
      <Route path="/recipes"     element={<Recipes />} />
      <Route path="/wow"         element={<Suspense fallback={null}><WowHub /></Suspense>} />
      <Route path="/wow/:expansion/:profession" element={<Suspense fallback={null}><ProfessionTracker /></Suspense>} />
      <Route path="/map"         element={<Suspense fallback={null}><VisitorMap /></Suspense>} />
      <Route path="/about"       element={<About />} />
      <Route path="*"            element={<NotFound />} />
    </Routes>
  )
}
