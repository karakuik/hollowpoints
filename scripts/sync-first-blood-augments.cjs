const fs = require('node:fs')
const path = require('node:path')
const https = require('node:https')

const lockfiles = [
  process.env.LEAGUE_INSTALL_PATH && path.join(process.env.LEAGUE_INSTALL_PATH, 'lockfile'),
  'C:\\Riot Games\\League of Legends\\lockfile',
  'C:\\Program Files\\Riot Games\\League of Legends\\lockfile',
  'D:\\Riot Games\\League of Legends\\lockfile',
].filter(Boolean)

function findLeague() {
  for (const file of lockfiles) {
    try {
      const parts = fs.readFileSync(file, 'utf8').trim().split(':')
      if (parts.length >= 5) return { port:Number(parts[2]), password:parts[3] }
    } catch (error) {
      if (!['ENOENT','EACCES','EPERM'].includes(error.code)) throw error
    }
  }
  throw new Error('League is not open. Open the League client, then run this command again.')
}

function request(league, pathname) {
  return new Promise((resolve, reject) => {
    const req = https.get({
      hostname:'127.0.0.1', port:league.port, path:pathname,
      auth:`riot:${league.password}`, rejectUnauthorized:false,
    }, response => {
      const chunks = []
      response.on('data', chunk => chunks.push(chunk))
      response.on('end', () => {
        const body = Buffer.concat(chunks)
        if (response.statusCode < 200 || response.statusCode >= 300) return reject(new Error(`${pathname} returned ${response.statusCode}`))
        resolve({ body, contentType:response.headers['content-type'] || '' })
      })
    })
    req.on('error', reject)
  })
}

async function json(league, pathname) {
  return JSON.parse((await request(league, pathname)).body.toString('utf8'))
}

async function runPool(items, concurrency, task) {
  let cursor = 0
  async function worker() {
    while (cursor < items.length) {
      const item = items[cursor++]
      await task(item)
    }
  }
  await Promise.all(Array.from({ length:Math.min(concurrency, items.length) }, worker))
}

async function main() {
  const league = findLeague()
  const [lists, definitions] = await Promise.all([
    json(league, '/lol-game-data/assets/v1/augment-lists.json'),
    json(league, '/lol-game-data/assets/v1/cherry-augments.json'),
  ])
  const kiwi = lists.find(list => list.modeName === 'KIWI')
  if (!kiwi) throw new Error('The current League patch does not contain a KIWI Mayhem augment list.')
  const names = new Set(kiwi.augmentList.map(value => String(value).split('/').pop()))
  const catalog = definitions
    .filter(augment => names.has(augment.augmentNameId))
    .map(augment => ({
      id:Number(augment.id),
      augmentNameId:augment.augmentNameId,
      name:augment.nameTRA || augment.simpleNameTRA || augment.augmentNameId,
      rarity:augment.rarity || 'kUnknown',
      icon:`${Number(augment.id)}.png`,
      sourcePath:augment.augmentSmallIconPath,
    }))
    .sort((a, b) => a.id - b.id)
  const unique = new Map(catalog.map(augment => [augment.augmentNameId, augment]))
  const missing = [...names].filter(name => !unique.has(name))
  if (missing.length) throw new Error(`Missing metadata for ${missing.length} Mayhem augments: ${missing.join(', ')}`)
  if (catalog.length !== names.size) throw new Error(`Expected ${names.size} unique augments but found ${catalog.length} definitions.`)
  if (new Set(catalog.map(augment => augment.id)).size !== catalog.length) throw new Error('The current catalog contains duplicate augment IDs.')

  const destination = path.join(__dirname, '..', 'public', 'first-blood', 'augments')
  fs.mkdirSync(destination, { recursive:true })
  let completed = 0
  await runPool(catalog, 12, async augment => {
    const image = await request(league, augment.sourcePath)
    if (!image.contentType.startsWith('image/png')) throw new Error(`Unexpected icon response for ${augment.name}`)
    fs.writeFileSync(path.join(destination, augment.icon), image.body)
    completed += 1
    if (completed % 25 === 0 || completed === catalog.length) console.log(`Downloaded ${completed}/${catalog.length} augment icons`)
  })
  const publicCatalog = catalog.map(({ sourcePath, ...augment }) => augment)
  fs.writeFileSync(path.join(destination, 'catalog.json'), `${JSON.stringify({ generatedAt:new Date().toISOString(), mode:'KIWI', count:publicCatalog.length, augments:publicCatalog }, null, 2)}\n`)
  console.log(`Saved ${publicCatalog.length} current Mayhem augments to ${destination}`)
}

main().catch(error => { console.error(error.message); process.exitCode = 1 })
