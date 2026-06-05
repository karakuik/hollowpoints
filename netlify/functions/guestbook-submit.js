const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' }
  if (event.httpMethod !== 'POST')    return { statusCode: 405, headers: CORS, body: '{}' }

  let body
  try { body = JSON.parse(event.body) }
  catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) } }

  const { name, message, url } = body
  if (!name?.trim() || !message?.trim()) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Name and message are required' }) }
  }

  const { error } = await supabase.from('guestbook').insert({
    name:    name.trim().slice(0, 80),
    message: message.trim().slice(0, 500),
    url:     url?.trim().slice(0, 200) || null,
    approved: false,
  })

  if (error) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) }
  return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) }
}
