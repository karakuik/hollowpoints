import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import Meta from '../../components/Meta'
import { WOW_REGISTRY } from '../../data/wow/registry'

export default function WowHub() {
  return (
    <Layout>
      <Meta
        title="WoW Trackers"
        description="Profession leveling and profit trackers with live Auction House data."
      />

      <div className="mb-10">
        <p className="text-hp-accent text-xs font-semibold uppercase tracking-widest mb-2">
          World of Warcraft
        </p>
        <h1 className="text-4xl font-bold text-hp-text mb-3">Profession Trackers</h1>
        <p className="text-hp-muted text-sm max-w-lg">
          Skill requirements, unlock methods, exact materials, and live Auction House
          cost-vs-profit math — one page per expansion and profession.
        </p>
      </div>

      <ul className="grid sm:grid-cols-2 gap-4">
        {WOW_REGISTRY.map(combo => (
          <li key={`${combo.expansion}-${combo.profession}`}>
            <Link
              to={`/wow/${combo.expansion}/${combo.profession}`}
              className="block bg-hp-surface border border-hp-border rounded-lg p-5 hover:border-hp-accent/50 hover:bg-hp-elevated transition-colors group"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-hp-accent mb-1">
                {combo.expansionLabel} · {combo.realm}
              </p>
              <p className="text-sm font-semibold text-hp-text group-hover:text-hp-accent transition-colors">
                {combo.professionLabel} →
              </p>
              <p className="text-xs text-hp-muted mt-2 leading-relaxed">
                {combo.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
