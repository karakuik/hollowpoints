import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import Meta from '../components/Meta'

const idKey=v=>String(v||'').normalize('NFKC').replace(/\s*#\s*/,'#').trim().toLowerCase()
const usable=p=>{const s=String(p?.name||'').trim(),i=s.lastIndexOf('#');return p?.hasRiotId!==false&&i>0&&i<s.length-1}
const pct=(n,d)=>d?Math.round(n/d*100):0
const playerLink=name=>{const i=name.lastIndexOf('#');return `/first-blood/player/${encodeURIComponent(name.slice(0,i))}?tag=${encodeURIComponent(name.slice(i+1))}`}

function aggregate(matches,profile){
  const map=new Map()
  for(const match of matches) for(const p of match.participants||[]){
    if(!usable(p))continue
    const k=idKey(p.name),x=map.get(k)||{name:p.name,games:0,firsts:0,deaths:0,pentas:0,kills:0,killGames:0,profile:k===idKey(profile)}
    x.games++;x.firsts+=!!p.gotFirstBlood;x.deaths+=!!p.wasFirstDeath;x.pentas+=Number(p.pentakills||0)
    if(p.kills!=null&&Number.isFinite(Number(p.kills))){x.kills+=Number(p.kills);x.killGames++} map.set(k,x)
  }
  return [...map.values()]
}
function Table({title,note,heads,rows}){return <section className="mb-10"><div className="flex items-end justify-between gap-4 mb-3"><h2 className="text-xl font-bold">{title}</h2><span className="text-xs text-hp-muted">{note}</span></div><div className="overflow-x-auto border border-hp-border rounded-lg bg-hp-surface"><table className="w-full min-w-[620px] text-sm"><thead><tr className="text-hp-muted text-xs uppercase">{heads.map(h=><th key={h} className="text-left px-4 py-3 border-b border-hp-border">{h}</th>)}</tr></thead><tbody>{rows.length?rows.map((r,i)=><tr key={i} className="border-b last:border-0 border-hp-border/60">{r.map((c,j)=><td key={j} className="px-4 py-3">{c}</td>)}</tr>):<tr><td colSpan={heads.length} className="px-4 py-6 text-hp-muted">No qualifying data yet.</td></tr>}</tbody></table></div></section>}

export default function FirstBlood(){
  const {gameName}=useParams(),[query]=useSearchParams(),navigate=useNavigate()
  const [name,setName]=useState(gameName?decodeURIComponent(gameName):''),[tag,setTag]=useState(query.get('tag')||'')
  const [data,setData]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(false),[showAll,setShowAll]=useState(false)
  useEffect(()=>{if(!gameName||!query.get('tag'))return;setLoading(true);setError('');fetch(`/api/players/${encodeURIComponent(decodeURIComponent(gameName))}?tagLine=${encodeURIComponent(query.get('tag'))}`).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error);return d}).then(setData).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[gameName,query])
  const stats=useMemo(()=>aggregate(data?.matches||[],data?.player?.riotId),[data])
  const me=useMemo(()=>{const key=idKey(data?.player?.riotId);return (data?.matches||[]).map(m=>({m,p:(m.participants||[]).find(p=>idKey(p.name)===key)})).filter(x=>x.p)},[data])
  const teammates=useMemo(()=>{const map=new Map();for(const {m,p:meP} of me){if(typeof meP.won!=='boolean'||!meP.team)continue;for(const p of m.participants||[]){if(!usable(p)||idKey(p.name)===idKey(meP.name)||p.team!==meP.team)continue;const k=idKey(p.name),x=map.get(k)||{name:p.name,games:0,wins:0};x.games++;x.wins+=meP.won;map.set(k,x)}}return [...map.values()].sort((a,b)=>pct(b.wins,b.games)-pct(a.wins,a.games)||b.games-a.games).slice(0,15)},[me])
  const firsts=me.filter(x=>x.p.gotFirstBlood).length,firstDeaths=me.filter(x=>x.p.wasFirstDeath).length,completed=me.filter(x=>typeof x.p.won==='boolean'),wins=completed.filter(x=>x.p.won).length
  const link=n=><Link className="font-semibold hover:text-hp-accent" to={playerLink(n)}>{n}</Link>
  const submit=e=>{e.preventDefault();if(name.trim()&&tag.trim())navigate(`/first-blood/player/${encodeURIComponent(name.trim())}?tag=${encodeURIComponent(tag.replace(/^#/,'').trim())}`)}
  return <Layout><Meta title="First Blood — ARAM Mayhem" description="ARAM Mayhem first blood, first death, win rate, and teammate statistics."/><div className="mb-10"><p className="text-xs font-bold tracking-[.2em] text-hp-accent">ARAM: MAYHEM · QUEUE 2400</p><h1 className="text-4xl sm:text-6xl font-black tracking-tight mt-3">Who drew <span className="text-red-500">first blood?</span></h1><p className="text-hp-muted mt-4 max-w-2xl">Search any player captured by the First Blood recorders.</p><form onSubmit={submit} className="mt-6 flex flex-col sm:flex-row bg-hp-surface border border-hp-border rounded-lg overflow-hidden max-w-3xl"><input className="flex-1 bg-transparent px-5 py-4 outline-none" value={name} onChange={e=>setName(e.target.value)} placeholder="Player name"/><div className="flex items-center border-t sm:border-t-0 sm:border-l border-hp-border px-4"><b className="text-hp-muted">#</b><input className="w-24 bg-transparent px-2 py-4 outline-none" value={tag} onChange={e=>setTag(e.target.value)} placeholder="NA1"/></div><button className="bg-red-500 hover:bg-red-400 text-white font-bold px-7 py-4">Search player</button></form>{error&&<p className="text-red-400 mt-3">{error}</p>}</div>
  {loading&&<p className="text-hp-muted">Loading player history…</p>}{data&&<><div className="flex justify-between items-end border-t border-hp-border pt-8"><div><p className="text-xs tracking-widest text-hp-accent">PLAYER REPORT</p><h2 className="text-3xl font-bold mt-1">{data.player.riotId}</h2></div><span className="text-xs text-hp-muted">{me.length} MAYHEM MATCHES</span></div><div className="grid grid-cols-2 lg:grid-cols-5 gap-3 my-7">{[['First-blood rate',`${pct(firsts,me.length)}%`],['First bloods',firsts],['First deaths',firstDeaths],['Not involved',me.length-firsts-firstDeaths],['Win rate',completed.length?`${pct(wins,completed.length)}%`:'—']].map(([a,b],i)=><div key={a} className={`p-5 bg-hp-surface border border-hp-border rounded-lg ${i===0?'border-t-red-500 border-t-2':''}`}><p className="text-xs text-hp-muted">{a}</p><strong className="text-3xl block mt-2">{b}</strong></div>)}</div>
  <Table title="Most played players" note={showAll?'Showing everyone':'Top 10'} heads={['Player','Games','First kills','First deaths','FB rate']} rows={stats.sort((a,b)=>b.games-a.games||b.firsts-a.firsts).slice(0,showAll?undefined:10).map(x=>[link(x.name),x.games,x.firsts,x.deaths,`${pct(x.firsts,x.games)}%`])}/>{stats.length>10&&<button onClick={()=>setShowAll(!showAll)} className="-mt-8 mb-10 text-sm text-hp-accent">{showAll?'Show top 10':'Show more players'}</button>}
  <Table title="Who gets caught first?" note="Top 15 · minimum 10 games" heads={['Player','Games','First deaths','First-death rate']} rows={stats.filter(x=>x.games>=10).sort((a,b)=>pct(b.deaths,b.games)-pct(a.deaths,a.games)||b.games-a.games).slice(0,15).map(x=>[link(x.name),x.games,x.deaths,`${pct(x.deaths,x.games)}%`])}/>
  <Table title="Who do I win with?" note="Top 15 teammates" heads={['Player','Games together','Wins','Win rate']} rows={teammates.map(x=>[link(x.name),x.games,x.wins,`${pct(x.wins,x.games)}%`])}/>
  <Table title="Who draws first blood?" note="Top 10" heads={['Player','Games','First kills','Rate']} rows={stats.filter(x=>x.firsts).sort((a,b)=>b.firsts-a.firsts).slice(0,10).map(x=>[link(x.name),x.games,x.firsts,`${pct(x.firsts,x.games)}%`])}/>
  <Table title="Pentakill leaders" note="Top 10" heads={['Player','Games','Pentakills','Rate']} rows={stats.filter(x=>x.pentas).sort((a,b)=>b.pentas-a.pentas).slice(0,10).map(x=>[link(x.name),x.games,x.pentas,`${pct(x.pentas,x.games)}%`])}/>
  <Table title="Average kills per game" note="Sorted by tracked games, then total kills" heads={['Player','Tracked games','Total kills','Average']} rows={stats.filter(x=>x.killGames).sort((a,b)=>b.killGames-a.killGames||b.kills-a.kills).slice(0,10).map(x=>[link(x.name),x.killGames,x.kills,(x.kills/x.killGames).toFixed(1)])}/></>}</Layout>
}
