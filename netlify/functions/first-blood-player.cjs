const { createClient } = require('@supabase/supabase-js')
const { clientIp, hashToken, takeRateLimit } = require('./first-blood-core.cjs')
const headers={ 'Content-Type':'application/json','Cache-Control':'public, max-age=15' }
const reply=(statusCode,body)=>({statusCode,headers,body:JSON.stringify(body)})
exports.handler=async event=>{
  if(event.httpMethod!=='GET') return reply(405,{error:'Method not allowed'})
  let pathName=''
  try{pathName=decodeURIComponent(event.path.split('/').pop()||'')}catch{return reply(400,{error:'Invalid player name'})}
  const gameName=String(event.queryStringParameters?.gameName||pathName||'').trim()
  const tagLine=String(event.queryStringParameters?.tagLine||'').replace(/^#/,'').trim()
  if(!gameName||!tagLine||gameName.length>32||tagLine.length>16||/[#\u0000-\u001f]/.test(gameName)||/[#\u0000-\u001f]/.test(tagLine)) return reply(400,{error:'Enter a valid player name and tag'})
  const riotId=`${gameName}#${tagLine}`, identity=riotId.normalize('NFKC').toLowerCase()
  const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_KEY)
  try{const address=hashToken(clientIp(event)).slice(0,24);if(!await takeRateLimit(db,`player-minute:${address}`,120,60)||!await takeRateLimit(db,`player-day:${address}`,2000,86400))return reply(429,{error:'Search limit reached; try again shortly'})}catch(error){console.warn('Player rate limiter not installed yet',error.message)}
  const {data,error}=await db.from('first_blood_matches').select('participants:match_data->participants').contains('participant_ids',[identity]).order('game_created_at',{ascending:false}).limit(1000)
  if(error) return reply(500,{error:'Could not load player history'})
  const matches=(data||[]).map(row=>({participants:row.participants||[]}))
  const actual=matches.flatMap(m=>m.participants||[]).find(p=>String(p.name||'').normalize('NFKC').toLowerCase()===identity)?.name||riotId
  return reply(200,{player:{riotId:actual,gameName:actual.split('#')[0],tagLine:actual.split('#').slice(1).join('#')},matches,matchCount:matches.length})
}
