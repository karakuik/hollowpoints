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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/pokedex" element={<Pokedex />} />
      <Route path="/team-builder" element={<TeamBuilder />} />
      <Route path="/now" element={<Now />} />
      <Route path="/guestbook" element={<Guestbook />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}
