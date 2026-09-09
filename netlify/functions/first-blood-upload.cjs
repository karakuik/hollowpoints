const { createClient } = require('@supabase/supabase-js')
const {
  bearerToken, clientIp, hashToken, mergeRecords, riotIdKey, safeToken,
  takeRateLimit, validRiotId, validateRecord,
} = require('./first-blood-core.cjs')

const headers = { 'Content-Type':'application/json', 'X-Content-Type-Options':'nosniff', 'Cache-Control':'no-store' }
const reply = (statusCode, body, extraHeaders = {}) => ({ statusCode, headers:{ ...headers, ...extraHeaders }, body:JSON.stringify(body) })
const MAX_BODY_BYTES = 256 * 1024

async function authenticate(db, event) {
  const token = bearerToken(event.headers)
  // Check the old secret first so a website deploy remains operational while the
  // database migration is waiting to be run by the host.
  const legacy = process.env.FIRST_BLOOD_UPLOAD_TOKEN || ''
  if (legacy && safeToken(token, legacy)) return { id:null, label:'Legacy uploader', legacy:true }
  if (/^fbu_[A-Za-z0-9_-]{43}$/.test(token)) {
    const { data, error } = await db.from('first_blood_uploaders')
      .select('id,label,revoked_at').eq('token_hash', hashToken(token)).maybeSingle()
    if (error) throw error
    if (data && !data.revoked_at) return { id:data.id, label:data.label, legacy:false }
  }

  return null
}

exports.handler = async event => {
  if (event.httpMethod !== 'POST') return reply(405, { error:'Method not allowed' }, { Allow:'POST' })
  if (Buffer.byteLength(event.body || '', 'utf8') > MAX_BODY_BYTES) return reply(413, { error:'Match record is too large' })

  const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_KEY,{ auth:{ persistSession:false } })
  let uploader
  try { uploader=await authenticate(db,event) }
  catch(error) { console.error('Uploader authentication failed',error); return reply(500,{ error:'Upload service unavailable' }) }
  if(!uploader) return reply(401,{ error:'Uploader is not registered' })

  try {
    const addressHash=hashToken(clientIp(event)).slice(0,24)
    const identity=uploader.id||`legacy-${addressHash}`
    if(!await takeRateLimit(db,`upload-minute:${identity}`,300,60)||
       !await takeRateLimit(db,`upload-day:${identity}`,5000,86400)||
       !await takeRateLimit(db,`upload-ip-minute:${addressHash}`,600,60)) {
      return reply(429,{ error:'Upload limit reached; try again shortly' },{ 'Retry-After':'60' })
    }
  } catch(error) {
    console.error(error)
    // The legacy route had no rate-limit table. Keep existing clients alive until
    // the host runs the SQL migration; registered clients always fail closed.
    if(!uploader.legacy) return reply(500,{ error:'Upload service unavailable' })
  }

  let record
  try { record=JSON.parse(event.body) } catch { return reply(400,{ error:'Invalid JSON' }) }
  const validationError=validateRecord(record)
  if(validationError) return reply(400,{ error:validationError })

  const matchId=String(record.id), payloadHash=hashToken(event.body)
  const existingColumns=uploader.legacy?'match_data':'match_data,uploader_ids'
  const { data:old,error:readError }=await db.from('first_blood_matches').select(existingColumns).eq('match_id',matchId).maybeSingle()
  if(readError) return reply(500,{ error:'Could not check match' })
  const existing=old?.match_data
  const merged=mergeRecords(existing,record)
  const participant_ids=[...new Set(merged.participants.map(p=>riotIdKey(p.name)).filter(validRiotId))]
  const uploader_ids=[...new Set([...(old?.uploader_ids||[]),uploader.id].filter(Boolean))]
  const matchRow={match_id:matchId,match_data:merged,participant_ids,game_created_at:Number(merged.createdAt),received_at:new Date().toISOString()}
  if(!uploader.legacy) matchRow.uploader_ids=uploader_ids
  const { error }=await db.from('first_blood_matches').upsert(matchRow)
  if(error) return reply(500,{ error:'Could not save match' })

  if(uploader.id) await Promise.all([
    db.from('first_blood_upload_receipts').upsert({match_id:matchId,uploader_id:uploader.id,payload_hash:payloadHash,received_at:new Date().toISOString()}),
    db.from('first_blood_uploaders').update({last_seen_at:new Date().toISOString()}).eq('id',uploader.id),
  ])
  return reply(existing?200:201,{ok:true,created:!existing,matchId,registered:!uploader.legacy,verifiedSubmissions:uploader_ids.length})
}
