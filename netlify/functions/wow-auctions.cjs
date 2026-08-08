// Proxies Blizzard's Game Data API auction endpoints for Stormrage-US so the
// Jewelcrafting tracker can pull real prices without shipping the OAuth
// client secret to the browser. Client Credentials flow — no per-user login,
// this is app-only access to public AH data.
//
// Requires BLIZZARD_CLIENT_ID / BLIZZARD_CLIENT_SECRET env vars (server-side
// only, no VITE_ prefix). Get them from https://develop.battle.net/ →
// Create Client.

const CLIENT_ID     = process.env.BLIZZARD_CLIENT_ID
const CLIENT_SECRET = process.env.BLIZZARD_CLIENT_SECRET
const REGION        = 'us'
const REALM_SLUG    = 'stormrage'
const CACHE_TTL_MS  = (Number(process.env.AH_CACHE_TTL_MINUTES) || 10) * 60 * 1000

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
}

// Module-scope cache — persists across invocations only while the Netlify
// function container stays warm. Best-effort: worst case is an extra
// Blizzard fetch, not a broken response, so no external cache store needed.
let tokenCache   = { token: null, expiresAt: 0 }
let realmCache   = { connectedRealmId: null }
let auctionCache = { prices: null, fetchedAt: 0 }

async function getAccessToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token
  }
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
  const res = await fetch(`https://${REGION}.battle.net/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error(`OAuth token exchange failed: ${res.status}`)
  const json = await res.json()
  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  }
  return tokenCache.token
}

async function getConnectedRealmId(token) {
  if (realmCache.connectedRealmId) return realmCache.connectedRealmId
  const url = `https://${REGION}.api.blizzard.com/data/wow/realm/${REALM_SLUG}?namespace=dynamic-${REGION}&locale=en_US`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`Realm lookup failed: ${res.status}`)
  const json = await res.json()
  const href = json.connected_realm?.href || ''
  const match = href.match(/connected-realm\/(\d+)/)
  if (!match) throw new Error('Could not resolve connected realm ID from realm lookup response')
  realmCache.connectedRealmId = match[1]
  return realmCache.connectedRealmId
}

// Returns { [itemId]: copperPerUnit } across both the commodities endpoint
// (stackable trade goods — ore, dust, gems) and the per-realm auctions
// endpoint (crafted gear, jewelry) at the lowest price found for each item.
async function getAuctionPrices(token, connectedRealmId) {
  if (auctionCache.prices && Date.now() - auctionCache.fetchedAt < CACHE_TTL_MS) {
    return auctionCache.prices
  }

  const opts = { headers: { Authorization: `Bearer ${token}` } }

  // Commodities (stackable trade goods — ore, dust, gems) trade on a
  // region-wide pooled market since patch 9.0, NOT per-realm — this is not
  // under /connected-realm/. Non-commodity auctions (crafted gear, jewelry)
  // are still realm-specific.
  const [commoditiesRes, auctionsRes] = await Promise.all([
    fetch(`https://${REGION}.api.blizzard.com/data/wow/auctions/commodities?namespace=dynamic-${REGION}&locale=en_US`, opts),
    fetch(`https://${REGION}.api.blizzard.com/data/wow/connected-realm/${connectedRealmId}/auctions?namespace=dynamic-${REGION}&locale=en_US`, opts),
  ])

  if (!commoditiesRes.ok || !auctionsRes.ok) {
    throw new Error(`Auction fetch failed: commodities=${commoditiesRes.status} auctions=${auctionsRes.status}`)
  }

  const [commodities, auctions] = await Promise.all([commoditiesRes.json(), auctionsRes.json()])

  const prices = {}
  function consider(itemId, copperPerUnit) {
    if (itemId == null || !copperPerUnit || copperPerUnit <= 0) return
    const key = String(itemId)
    if (!prices[key] || copperPerUnit < prices[key]) prices[key] = copperPerUnit
  }

  for (const a of commodities.auctions || []) {
    consider(a.item?.id, a.unit_price)
  }
  for (const a of auctions.auctions || []) {
    if (a.buyout && a.quantity) consider(a.item?.id, Math.round(a.buyout / a.quantity))
  }

  auctionCache = { prices, fetchedAt: Date.now() }
  return prices
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: HEADERS, body: '' }
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return {
      statusCode: 503,
      headers: HEADERS,
      body: JSON.stringify({ error: 'Blizzard API not configured — set BLIZZARD_CLIENT_ID and BLIZZARD_CLIENT_SECRET' }),
    }
  }

  const itemsParam = event.queryStringParameters?.items
  if (!itemsParam) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Missing ?items=id1,id2,...' }) }
  }
  const requestedIds = itemsParam.split(',').map(s => s.trim()).filter(Boolean)

  try {
    const token = await getAccessToken()
    const connectedRealmId = await getConnectedRealmId(token)
    const allPrices = await getAuctionPrices(token, connectedRealmId)

    const prices = {}
    for (const id of requestedIds) {
      if (allPrices[id] != null) prices[id] = allPrices[id]
    }

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({
        realm: REALM_SLUG,
        connectedRealmId,
        fetchedAt: auctionCache.fetchedAt,
        prices,
      }),
    }
  } catch (err) {
    console.error('wow-auctions function error:', err)
    return { statusCode: 502, headers: HEADERS, body: JSON.stringify({ error: 'Blizzard API request failed' }) }
  }
}
