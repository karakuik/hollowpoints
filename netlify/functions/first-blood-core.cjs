const crypto = require('node:crypto')

const riotIdKey = value => String(value || '').normalize('NFKC').replace(/\s*#\s*/, '#').trim().toLowerCase()
const validRiotId = value => {
  const text = String(value || '').trim()
  const separator = text.lastIndexOf('#')
  return separator > 0 && separator < text.length - 1 && text.length <= 80
}
const finiteInteger = (value, min, max) => Number.isInteger(Number(value)) && Number(value) >= min && Number(value) <= max

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token || ''), 'utf8').digest('hex')
}

function safeToken(given, expected) {
  const left = Buffer.from(String(given || ''))
  const right = Buffer.from(String(expected || ''))
  return left.length === right.length && crypto.timingSafeEqual(left, right)
}

function bearerToken(headers = {}) {
  return String(headers.authorization || headers.Authorization || '').replace(/^Bearer\s+/i, '').trim()
}

function clientIp(event) {
  const headers = event.headers || {}
  return String(headers['x-nf-client-connection-ip'] || headers['client-ip'] || 'unknown').trim().slice(0, 64)
}

function validateRecord(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return 'Invalid JSON object'
  if (!/^\d{6,20}$/.test(String(record.id || ''))) return 'Invalid match ID'
  if (Number(record.queueId) !== 2400) return 'Only ARAM: Mayhem queue 2400 is accepted'
  if (!finiteInteger(record.createdAt, 1_500_000_000_000, Date.now() + 86_400_000)) return 'Invalid match timestamp'
  if (!validRiotId(record.player)) return 'Invalid recording player Riot ID'
  if (!Array.isArray(record.participants) || record.participants.length < 2 || record.participants.length > 20) return 'Invalid participant list'

  const identities = new Set()
  let firstKillers = 0
  let firstDeaths = 0
  for (const participant of record.participants) {
    if (!participant || typeof participant !== 'object' || !validRiotId(participant.name)) return 'Every participant must have a valid Riot ID'
    const identity = riotIdKey(participant.name)
    if (identities.has(identity)) return 'Duplicate participant Riot ID'
    identities.add(identity)
    if (typeof participant.champion !== 'string' || !participant.champion.trim() || participant.champion.length > 80) return 'Invalid participant champion'
    if (participant.kills != null && !finiteInteger(participant.kills, 0, 500)) return 'Invalid participant kills'
    if (participant.pentakills != null && !finiteInteger(participant.pentakills, 0, 50)) return 'Invalid participant pentakills'
    if (participant.augments != null) {
      if (!Array.isArray(participant.augments) || participant.augments.length > 6) return 'Invalid participant augments'
      const augmentIds = new Set()
      const augmentOrders = new Set()
      for (const augment of participant.augments) {
        if (!augment || typeof augment !== 'object' || !finiteInteger(augment.id, 1, 1000000) || !finiteInteger(augment.order, 1, 6)) return 'Invalid participant augment'
        if (augmentIds.has(Number(augment.id)) || augmentOrders.has(Number(augment.order))) return 'Duplicate participant augment'
        augmentIds.add(Number(augment.id)); augmentOrders.add(Number(augment.order))
        if (typeof augment.name !== 'string' || !augment.name.trim() || augment.name.length > 100) return 'Invalid augment name'
        if (!['kSilver','kGold','kPrismatic','kUnknown'].includes(augment.rarity)) return 'Invalid augment rarity'
      }
    }
    if (participant.gotFirstBlood === true) firstKillers += 1
    if (participant.wasFirstDeath === true) firstDeaths += 1
  }
  if (!identities.has(riotIdKey(record.player))) return 'Recording player is not in the participant list'
  if (firstKillers > 1 || firstDeaths > 1) return 'Invalid first-blood result'
  return null
}

function mergeRecords(existing, incoming) {
  if (!existing) return incoming
  const newer = Number(incoming.liveData?.gameTime || 0) >= Number(existing.liveData?.gameTime || 0) ? incoming : existing
  const older = newer === incoming ? existing : incoming
  const players = new Map()
  for (const participant of [...(older.participants || []), ...(newer.participants || [])]) {
    const identity = riotIdKey(participant.name)
    if (!identity) continue
    const previous = players.get(identity) || {}
    players.set(identity, {
      ...previous,
      ...participant,
      gotFirstBlood: Boolean(previous.gotFirstBlood || participant.gotFirstBlood),
      wasFirstDeath: Boolean(previous.wasFirstDeath || participant.wasFirstDeath),
      pentakills: Math.max(Number(previous.pentakills || 0), Number(participant.pentakills || 0)),
      kills: previous.kills == null && participant.kills == null ? null : Math.max(Number(previous.kills || 0), Number(participant.kills || 0)),
      augments: (participant.augments?.length || 0) >= (previous.augments?.length || 0) ? participant.augments : previous.augments,
      isLocalPlayer: false,
    })
  }
  return { ...older, ...newer, id: String(incoming.id), participants: [...players.values()] }
}

async function takeRateLimit(db, bucket, maximum, windowSeconds) {
  const { data, error } = await db.rpc('first_blood_take_rate_limit', {
    p_bucket: bucket,
    p_maximum: maximum,
    p_window_seconds: windowSeconds,
  })
  if (error) throw new Error(`Rate limiter unavailable: ${error.message}`)
  return data === true
}

module.exports = { bearerToken, clientIp, hashToken, mergeRecords, riotIdKey, safeToken, takeRateLimit, validRiotId, validateRecord }
