const { createClient } = require('@supabase/supabase-js')
const headers={ 'Content-Type':'application/json','Cache-Control':'public, max-age=15' }
const reply=(statusCode,body)=>({statusCode,headers,body:JSON.stringify(body)})
exports.handler=async event=>{
  if(event.httpMethod!=='GET') return reply(405,{error:'Method not allowed'})
  const gameName=String(event.queryStringParameters?.gameName||'').trim()
  const tagLine=String(event.queryStringParameters?.tagLine||'').replace(/^#/,'').trim()
  if(!gameName||!tagLine) return reply(400,{error:'Enter a player name and tag'})
  const riotId=`${gameName}#${tagLine}`, identity=riotId.normalize('NFKC').toLowerCase()
  const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_KEY)
  const {data,error}=await db.from('first_blood_matches').select('match_data').contains('participant_ids',[identity]).order('game_created_at',{ascending:false}).limit(1000)
  if(error) return reply(500,{error:'Could not load player history'})
  const matches=(data||[]).map(row=>row.match_data)
  const actual=matches.flatMap(m=>m.participants||[]).find(p=>String(p.name||'').normalize('NFKC').toLowerCase()===identity)?.name||riotId
  return reply(200,{player:{riotId:actual,gameName:actual.split('#')[0],tagLine:actual.split('#').slice(1).join('#')},matches,matchCount:matches.length})
}
