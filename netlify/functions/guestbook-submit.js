const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

async function geocode(location) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'hollowpoints.gg/1.0 (ryanmitukg@gmail.com)' } }
    )
    const results = await res.json()
    if (!results.length) return null
    const jitter = () => (Math.random() - 0.5) * 0.06
    return {
      lat: parseFloat(results[0].lat) + jitter(),
      lng: parseFloat(results[0].lon) + jitter(),
    }
  } catch {
    return null
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' }
  if (event.httpMethod !== 'POST')    return { statusCode: 405, headers: CORS, body: '{}' }

  let body
  try { body = JSON.parse(event.body) }
  catch { return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) } }

  const { name, message, url, location } = body
  if (!name?.trim() || !message?.trim()) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Name and message are required' }) }
  }

  const { error } = await supabase.from('guestbook').insert({
    name:    name.trim().slice(0, 80),
    message: message.trim().slice(0, 500),
    url:     url?.trim().slice(0, 200) || null,
    approved: true,
  })

  if (error) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) }

  // Geocode location and drop a pin if provided
  if (location?.trim()) {
    const coords = await geocode(location.trim())
    if (coords) {
      await supabase.from('visitor_pins').insert({
        lat:   Math.round(coords.lat * 1e6) / 1e6,
        lng:   Math.round(coords.lng * 1e6) / 1e6,
        label: name.trim().slice(0, 60),
      })
    }
  }

  return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) }
}
