import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Meta from '../components/Meta'

const projects = [
  {
    name: 'Crystal Pokédex',
    description: 'GSC viability reference for Pokémon Crystal — all 251 Pokémon with stats, competitive tiers, and full evolution chains.',
    to: '/pokedex',
    tags: ['React', 'Data', 'Pokémon'],
  },
]

export default function Projects() {
  return (
    <Layout>
      <Meta title="Projects" description="Things I've built." />

      <div className="mb-10">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">
          Work
        </p>
        <h1 className="text-4xl font-bold text-hp-text">Projects</h1>
      </div>

      <ul className="grid sm:grid-cols-2 gap-4">
        {projects.map(project => {
          const inner = (
            <>
              <p className="text-sm font-semibold text-hp-text group-hover:text-hp-accent transition-colors">
                {project.name} →
              </p>
              <p className="text-xs text-hp-muted mt-2 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs border border-hp-border text-hp-muted px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )

          const cardCls = 'block bg-hp-surface border border-hp-border rounded-lg p-5 hover:border-hp-accent/50 hover:bg-hp-elevated transition-colors group'

          return (
            <li key={project.name}>
              {project.to
                ? <Link to={project.to} className={cardCls}>{inner}</Link>
                : <a href={project.href} target="_blank" rel="noreferrer" className={cardCls}>{inner}</a>
              }
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}
