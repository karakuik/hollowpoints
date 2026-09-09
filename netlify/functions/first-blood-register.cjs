const crypto = require('node:crypto')
const os = require('node:os')
const { createClient } = require('@supabase/supabase-js')
const { clientIp, hashToken, safeToken, takeRateLimit } = require('./first-blood-core.cjs')

const headers = { 'Content-Type':'application/json', 'X-Content-Type-Options':'nosniff', 'Cache-Control':'no-store' }
const reply = (statusCode, body, extraHeaders = {}) => ({ statusCode, headers:{ ...headers, ...extraHeaders }, body:JSON.stringify(body) })

exports.handler = async event => {
  if (event.httpMethod !== 'POST') return reply(405, { error:'Method not allowed' }, { Allow:'POST' })
  if (Buffer.byteLength(event.body || '', 'utf8') > 4096) return reply(413, { error:'Registration request is too large' })

  let input
  try { input = JSON.parse(event.body) } catch { return reply(400, { error:'Invalid JSON' }) }
  const inviteCode = String(input?.inviteCode || '')
  const installId = String(input?.installId || '').trim().toLowerCase()
  const label = String(input?.deviceName || os.hostname() || 'Windows PC').trim().slice(0, 80)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(installId)) return reply(400, { error:'Invalid installation ID' })
  if (!label) return reply(400, { error:'Enter a name for this PC' })

  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth:{ persistSession:false } })
  const addressHash = hashToken(clientIp(event)).slice(0, 24)
  try {
    if (!await takeRateLimit(db, `register-hour:${addressHash}`, 10, 3600)) {
      return reply(429, { error:'Too many registration attempts; try again later' }, { 'Retry-After':'3600' })
    }
  } catch (error) { console.error(error); return reply(500, { error:'Registration service unavailable' }) }

  const expected = process.env.FIRST_BLOOD_ENROLLMENT_CODE || ''
  if (!expected || !safeToken(inviteCode, expected)) return reply(401, { error:'The invite code is incorrect or expired' })

  const deviceToken = `fbu_${crypto.randomBytes(32).toString('base64url')}`
  const { data, error } = await db.from('first_blood_uploaders').upsert({
    install_id:installId, label, token_hash:hashToken(deviceToken), revoked_at:null, enrolled_at:new Date().toISOString(),
  }, { onConflict:'install_id' }).select('id,label').single()
  if (error) { console.error('Could not register uploader',error); return reply(500,{ error:'Could not register this PC' }) }
  return reply(201,{ok:true,deviceToken,uploader:{id:data.id,label:data.label}})
}
