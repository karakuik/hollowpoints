const test = require('node:test')
const assert = require('node:assert/strict')
const { mergeRecords, validateRecord } = require('../netlify/functions/first-blood-core.cjs')

const record = overrides => ({
  id:'5637955917', queueId:2400, createdAt:Date.now(), player:'Eriseths#NA1',
  participants:[
    { name:'Eriseths#NA1', champion:'Mel', kills:10, pentakills:0, gotFirstBlood:false, wasFirstDeath:false },
    { name:'Clemont#NA1', champion:'TahmKench', kills:5, pentakills:0, gotFirstBlood:true, wasFirstDeath:false },
  ],
  ...overrides,
})

test('accepts a well-formed Mayhem match', () => assert.equal(validateRecord(record()), null))
test('rejects an untracked queue', () => assert.match(validateRecord(record({ queueId:450 })), /queue 2400/))
test('rejects blank participant identities', () => assert.match(validateRecord(record({ participants:[{ name:'', champion:'Mel' }] })), /participant/i))
test('rejects multiple first-blood killers', () => {
  const participants = record().participants.map(player => ({ ...player, gotFirstBlood:true }))
  assert.match(validateRecord(record({ participants })), /first-blood/)
})
test('accepts valid ordered Mayhem augments', () => {
  const value = record()
  value.participants[0].augments = [
    { id:1154, order:1, name:"Urf's Champion", rarity:'kPrismatic', icon:'1154.png' },
    { id:1097, order:2, name:'Witchful Thinking', rarity:'kSilver', icon:'1097.png' },
  ]
  assert.equal(validateRecord(value), null)
})
test('rejects duplicate augment selection order', () => {
  const value = record()
  value.participants[0].augments = [
    { id:1154, order:1, name:"Urf's Champion", rarity:'kPrismatic' },
    { id:1097, order:1, name:'Witchful Thinking', rarity:'kSilver' },
  ]
  assert.equal(validateRecord(value), 'Duplicate participant augment')
})
test('duplicate perspectives keep the highest counters and advanced snapshot', () => {
  const oldPlayers = record().participants
  oldPlayers[0].augments = [{ id:1154, order:1, name:"Urf's Champion", rarity:'kPrismatic' }]
  const old = record({ liveData:{ gameTime:100 }, participants:oldPlayers })
  const nextPlayers = record().participants.map((player, index) => ({ ...player, kills:index ? 9 : 11 }))
  const next = record({ liveData:{ gameTime:900 }, participants:nextPlayers })
  const merged = mergeRecords(old, next)
  assert.equal(merged.liveData.gameTime, 900)
  assert.equal(merged.participants.find(player => player.name === 'Clemont#NA1').kills, 9)
  assert.equal(merged.participants.find(player => player.name === 'Eriseths#NA1').augments[0].id, 1154)
})
