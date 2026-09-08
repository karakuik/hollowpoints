const { createClient } = require('@supabase/supabase-js')
const crypto = require('node:crypto')

const headers = { 'Content-Type':'application/json' }
const reply = (statusCode, body) => ({ statusCode, headers, body:JSON.stringify(body) })
const key = value => String(value || '').normalize('NFKC').replace(/\s*#\s*/, '#').trim().toLowerCase()
const validId = value => { const s=String(value||'').trim(), i=s.lastIndexOf('#'); return i>0 && i<s.length-1 }
const safeToken = (given, expected) => {
  const a=Buffer.from(given), b=Buffer.from(expected)
  return a.length===b.length && crypto.timingSafeEqual(a,b)
}

exports.handler = async event => {
  if (event.httpMethod !== 'POST') return reply(405,{ error:'Method not allowed' })
  const expected=process.env.FIRST_BLOOD_UPLOAD_TOKEN || ''
  const given=String(event.headers.authorization||'').replace(/^Bearer\s+/i,'')
  if (!expected || !safeToken(given,expected)) return reply(401,{ error:'Invalid upload token' })
  let record
  try { record=JSON.parse(event.body) } catch { return reply(400,{ error:'Invalid JSON' }) }
  if (!record?.id || Number(record.queueId)!==2400 || !Array.isArray(record.participants) || record.participants.length>20) return reply(400,{ error:'Invalid Mayhem match record' })
  const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_KEY)
  const { data:old }=await db.from('first_blood_matches').select('match_data').eq('match_id',String(record.id)).maybeSingle()
  const existing=old?.match_data
  const newer=Number(record.liveData?.gameTime||0)>=Number(existing?.liveData?.gameTime||0)?record:existing
  const older=newer===record?existing:record
  const players=new Map()
  for(const p of [...(older?.participants||[]),...(newer?.participants||[])]){
    const id=key(p.name); if(!id) continue
    const previous=players.get(id)||{}
    players.set(id,{...previous,...p,gotFirstBlood:Boolean(previous.gotFirstBlood||p.gotFirstBlood),wasFirstDeath:Boolean(previous.wasFirstDeath||p.wasFirstDeath),pentakills:Math.max(Number(previous.pentakills||0),Number(p.pentakills||0)),kills:previous.kills==null&&p.kills==null?null:Math.max(Number(previous.kills||0),Number(p.kills||0)),isLocalPlayer:false})
  }
  const merged={...(older||{}),...newer,id:String(record.id),participants:[...players.values()]}
  const participant_ids=[...new Set(merged.participants.map(p=>key(p.name)).filter(validId))]
  const { error }=await db.from('first_blood_matches').upsert({match_id:merged.id,match_data:merged,participant_ids,game_created_at:Number(merged.createdAt||0),received_at:new Date().toISOString()})
  if(error) return reply(500,{ error:'Could not save match' })
  return reply(existing?200:201,{ ok:true,created:!existing,matchId:merged.id })
}
