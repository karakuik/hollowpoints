// Gen 2 / GSC shared data and team analysis helpers

const RAW = `Abra,Psychic,PU,25,20,15,105,55,90
Aerodactyl,Rock/Flying,UU,80,105,65,60,75,130
Aipom,Normal,ZU,55,70,55,40,55,85
Alakazam,Psychic,OU,55,50,45,135,85,120
Ampharos,Electric,UU,90,75,75,115,90,55
Arbok,Poison,PU,60,85,69,65,79,80
Arcanine,Fire,UU,90,110,80,100,80,95
Ariados,Bug/Poison,ZUBL,70,90,70,60,60,40
Articuno,Ice/Flying,UUBL,90,85,100,95,125,85
Azumarill,Water,PU,100,50,80,50,80,50
Bayleef,Grass,PU,60,62,80,63,80,60
Beedrill,Bug/Poison,ZUBL,65,80,40,45,80,75
Bellossom,Grass,UU,75,80,85,90,100,50
Bellsprout,Grass/Poison,LC,50,75,35,70,30,40
Blastoise,Water,UU,79,83,100,85,105,78
Blissey,Normal,OU,255,10,10,75,135,55
Bulbasaur,Grass/Poison,LC,45,49,49,65,65,45
Butterfree,Bug/Flying,ZU,60,45,50,80,80,70
Caterpie,Bug,LC,45,30,35,20,20,45
Celebi,Psychic/Grass,Uber,100,100,100,100,100,100
Chansey,Normal,UU,250,5,5,35,105,50
Charizard,Fire/Flying,UUBL,78,84,78,109,85,100
Charmander,Fire,LC,39,52,43,60,50,65
Charmeleon,Fire,ZUBL,58,64,58,80,65,80
Chikorita,Grass,LC,45,49,65,49,65,45
Chinchou,Water/Electric,NU,75,38,38,56,56,67
Clefable,Normal,UUBL,95,70,73,85,90,60
Clefairy,Normal,PU,70,45,48,60,65,35
Cleffa,Normal,LC,50,25,28,45,55,15
Cloyster,Water/Ice,OU,50,95,180,85,45,70
Corsola,Water/Rock,PU,55,55,85,65,85,35
Crobat,Poison/Flying,UU,85,90,80,70,80,130
Croconaw,Water,ZU,65,80,80,59,63,58
Cubone,Ground,PU,50,50,95,40,50,35
Cyndaquil,Fire,LC,39,52,43,60,50,65
Delibird,Ice/Flying,PU,45,55,45,65,45,75
Dewgong,Water/Ice,NU,90,70,80,70,95,70
Diglett,Ground,LC,10,55,25,35,45,95
Ditto,Normal,ZU,48,48,48,48,48,48
Dodrio,Normal/Flying,UU,60,110,70,60,60,100
Doduo,Normal/Flying,ZU,35,85,45,35,35,75
Donphan,Ground,UUBL,90,120,120,60,60,50
Dragonair,Dragon,NU,61,84,65,70,70,70
Dragonite,Dragon/Flying,UUBL,91,134,95,100,100,80
Dratini,Dragon,LC,41,64,45,50,50,50
Drowzee,Psychic,PU,60,48,45,43,90,42
Dugtrio,Ground,NU,35,80,50,50,70,120
Dunsparce,Normal,PU,100,70,70,65,65,45
Eevee,Normal,ZUBL,55,55,50,45,65,55
Ekans,Poison,LC,35,60,44,40,54,55
Electabuzz,Electric,UU,65,83,57,95,85,105
Electrode,Electric,UU,60,50,70,80,80,140
Elekid,Electric,PU,45,63,37,65,55,95
Entei,Fire,UUBL,115,115,85,90,75,100
Espeon,Psychic,UUBL,65,65,60,130,95,110
Exeggcute,Grass/Psychic,NU,60,40,80,60,45,40
Exeggutor,Grass/Psychic,OU,95,95,85,125,65,55
Farfetch'd,Normal/Flying,PU,52,65,55,58,62,60
Fearow,Normal/Flying,NU,65,90,65,61,61,100
Feraligatr,Water,UU,85,105,100,79,83,78
Flaaffy,Electric,PU,70,55,55,80,60,45
Flareon,Fire,NU,65,130,60,95,110,65
Forretress,Bug/Steel,OU,75,90,140,60,60,40
Furret,Normal,PU,85,76,64,45,55,90
Gastly,Ghost/Poison,PU,30,35,30,100,35,80
Gengar,Ghost/Poison,OU,60,65,60,130,75,110
Geodude,Rock/Ground,PU,40,80,100,30,30,20
Girafarig,Normal/Psychic,UU,70,80,65,90,65,85
Gligar,Ground/Flying,UU,65,75,105,35,65,85
Gloom,Grass/Poison,NU,60,65,70,85,75,40
Golbat,Poison/Flying,PU,75,80,70,65,75,90
Goldeen,Water,LC,45,67,60,35,50,63
Golduck,Water,NUBL,80,82,78,95,80,85
Golem,Rock/Ground,OU,80,110,130,55,65,45
Granbull,Normal,UU,90,120,75,60,60,45
Graveler,Rock/Ground,NU,55,95,115,45,45,35
Grimer,Poison,ZU,80,80,50,40,50,25
Growlithe,Fire,LC,55,70,45,70,50,60
Gyarados,Water/Flying,UU,95,125,79,60,100,81
Haunter,Ghost/Poison,UU,45,50,45,115,55,95
Heracross,Bug/Fighting,OU,80,125,75,40,95,85
Hitmonchan,Fighting,PU,50,105,79,35,110,76
Hitmonlee,Fighting,NU,50,120,53,35,110,87
Hitmontop,Fighting,NU,50,95,95,35,110,70
Ho-Oh,Fire/Flying,Uber,106,130,90,110,154,90
Hoothoot,Normal/Flying,LC,60,30,30,36,56,50
Hoppip,Grass/Flying,LC,35,35,40,35,55,50
Horsea,Water,LC,30,40,70,70,25,60
Houndoom,Dark/Fire,UUBL,75,90,50,110,80,95
Houndour,Dark/Fire,PU,45,60,30,80,50,65
Hypno,Psychic,UU,85,73,70,73,115,67
Igglybuff,Normal,LC,90,30,15,40,20,15
Ivysaur,Grass/Poison,ZU,60,62,63,80,80,60
Jigglypuff,Normal,NFE,115,45,20,45,25,20
Jolteon,Electric,OU,65,65,60,110,95,130
Jumpluff,Grass/Flying,UU,75,55,70,55,85,110
Jynx,Ice/Psychic,OU,65,50,35,115,95,95
Kabuto,Rock/Water,LC,30,80,90,55,45,55
Kabutops,Rock/Water,UU,60,115,105,65,70,80
Kadabra,Psychic,UU,40,35,30,120,70,105
Kakuna,Bug/Poison,NFE,45,25,50,25,25,35
Kangaskhan,Normal,UUBL,105,95,80,40,80,90
Kingdra,Water/Dragon,UUBL,75,95,95,95,95,85
Kingler,Water,NU,55,130,115,50,50,75
Koffing,Poison,ZU,40,65,95,60,45,35
Krabby,Water,LC,30,105,90,25,25,50
Lanturn,Water/Electric,UU,125,58,58,76,76,67
Lapras,Water/Ice,UUBL,130,85,80,85,95,60
Larvitar,Rock/Ground,LC,50,64,50,45,50,41
Ledian,Bug/Flying,NU,55,35,50,55,110,85
Ledyba,Bug/Flying,LC,40,20,30,40,80,55
Lickitung,Normal,NU,90,55,75,60,75,30
Lugia,Psychic/Flying,Uber,106,90,130,90,154,110
Machamp,Fighting,OU,90,130,80,65,85,55
Machoke,Fighting,PU,80,100,70,50,60,45
Machop,Fighting,LC,70,80,50,35,35,35
Magby,Fire,ZU,45,75,37,70,55,83
Magcargo,Fire/Rock,PU,50,50,120,80,80,30
Magikarp,Water,LC,20,10,55,15,20,80
Magmar,Fire,NU,65,95,57,100,85,93
Magnemite,Electric/Steel,NU,25,35,70,95,55,45
Magneton,Electric/Steel,UU,50,60,95,120,70,70
Mankey,Fighting,LC,40,80,35,35,45,70
Mantine,Water/Flying,ZUBL,65,40,70,80,140,70
Mareep,Electric,LC,55,40,40,65,45,35
Marill,Water,LC,70,20,50,20,50,40
Marowak,Ground,OU,60,80,110,50,80,45
Meganium,Grass,UUBL,80,82,100,83,100,80
Meowth,Normal,ZU,40,45,35,40,40,90
Metapod,Bug,NFE,50,20,55,25,25,30
Mew,Psychic,Uber,100,100,100,100,100,100
Mewtwo,Psychic,Uber,106,110,90,154,90,130
Miltank,Normal,OU,95,80,105,40,70,100
Misdreavus,Ghost,OU,60,60,60,85,85,85
Moltres,Fire/Flying,UUBL,90,100,90,125,85,90
Mr. Mime,Psychic,UU,40,45,65,100,120,90
Muk,Poison,UU,105,105,75,65,100,50
Murkrow,Dark/Flying,PU,60,85,42,85,42,91
Natu,Psychic/Flying,LC,40,50,45,70,45,70
Nidoking,Poison/Ground,OU,81,92,77,85,75,85
Nidoqueen,Poison/Ground,UU,90,82,87,75,85,76
Nidoran-F,Poison,LC,55,47,52,40,40,41
Nidoran-M,Poison,LC,46,57,40,40,40,50
Nidorina,Poison,ZU,70,62,67,55,55,56
Nidorino,Poison,NFE,61,72,57,55,55,65
Ninetales,Fire,NU,73,76,75,81,100,100
Noctowl,Normal/Flying,PU,100,50,50,76,96,70
Octillery,Water,NU,75,105,75,105,75,45
Oddish,Grass/Poison,LC,45,50,55,75,65,30
Omanyte,Rock/Water,ZU,35,40,100,90,55,35
Omastar,Rock/Water,UU,70,60,125,115,70,55
Onix,Rock/Ground,ZU,35,45,160,30,45,70
Paras,Bug/Grass,LC,35,70,55,45,55,25
Parasect,Bug/Grass,ZU,60,95,80,60,80,30
Persian,Normal,NU,65,70,60,65,65,115
Phanpy,Ground,LC,90,60,60,40,40,40
Pichu,Electric,LC,20,40,15,35,35,60
Pidgeot,Normal/Flying,NU,83,80,75,70,70,101
Pidgeotto,Normal/Flying,NFE,63,60,55,50,50,71
Pidgey,Normal/Flying,LC,40,45,40,35,35,56
Pikachu,Electric,UU,35,55,30,50,40,90
Piloswine,Ice/Ground,UU,100,100,80,60,60,50
Pineco,Bug,NU,50,65,90,35,35,15
Pinsir,Bug,UU,65,125,100,55,70,85
Politoed,Water,UU,90,75,75,90,100,70
Poliwag,Water,ZUBL,40,50,40,40,40,90
Poliwhirl,Water,PUBL,65,65,65,50,50,90
Poliwrath,Water/Fighting,NUBL,90,85,95,70,90,70
Ponyta,Fire,ZU,50,85,55,65,65,90
Porygon,Normal,NU,65,60,70,85,75,40
Porygon2,Normal,OU,85,80,90,105,95,60
Primeape,Fighting,NU,65,105,60,60,70,95
Psyduck,Water,LC,50,52,48,65,50,55
Pupitar,Rock/Ground,NU,70,84,70,65,70,51
Quagsire,Water/Ground,UU,95,85,85,65,65,35
Quilava,Fire,ZU,58,64,58,80,65,80
Qwilfish,Water/Poison,UU,65,95,75,55,55,85
Raichu,Electric,NUBL,60,90,55,90,80,100
Raikou,Electric,OU,90,85,75,115,100,115
Rapidash,Fire,NU,65,100,70,80,80,105
Raticate,Normal,PU,55,81,60,50,70,97
Rattata,Normal,LC,30,56,35,25,35,72
Remoraid,Water,LC,35,65,35,65,35,65
Rhydon,Ground/Rock,OU,105,130,120,45,45,40
Rhyhorn,Ground/Rock,PU,80,85,95,30,30,25
Sandshrew,Ground,LC,50,75,85,20,30,40
Sandslash,Ground,UU,75,100,110,45,55,65
Scizor,Bug/Steel,UUBL,70,130,100,55,80,65
Scyther,Bug/Flying,UU,70,110,80,55,80,105
Seadra,Water,PU,55,65,95,95,45,85
Seaking,Water,PU,80,92,65,65,80,68
Seel,Water,LC,65,45,55,45,70,45
Sentret,Normal,LC,35,46,34,35,45,20
Shellder,Water,LC,30,65,100,45,25,40
Shuckle,Bug/Rock,NU,20,10,230,10,230,5
Skarmory,Steel/Flying,OU,65,80,140,40,70,70
Skiploom,Grass/Flying,NFE,55,45,50,45,65,80
Slowbro,Water/Psychic,UU,95,75,110,100,80,30
Slowking,Water/Psychic,UU,95,75,80,100,110,30
Slowpoke,Water/Psychic,LC,90,65,65,40,40,15
Slugma,Fire,LC,40,40,40,70,40,20
Smeargle,Normal,UUBL,55,20,35,20,45,75
Smoochum,Ice/Psychic,LC,45,30,15,85,65,65
Sneasel,Dark/Ice,PU,55,95,55,35,75,115
Snorlax,Normal,OU,160,110,65,65,110,30
Snubbull,Normal,PU,60,80,50,40,40,30
Spearow,Normal/Flying,LC,40,60,30,31,31,70
Spinarak,Bug/Poison,LC,40,60,40,40,40,30
Squirtle,Water,LC,44,48,65,50,64,43
Stantler,Normal,NU,73,95,62,85,65,85
Starmie,Water/Psychic,OU,60,75,85,100,85,115
Staryu,Water,ZUBL,30,45,55,70,55,85
Steelix,Steel/Ground,OU,75,85,200,55,65,30
Sudowoodo,Rock,NU,70,100,115,30,65,30
Suicune,Water,OU,100,75,115,90,115,85
Sunflora,Grass,PU,75,75,55,105,85,30
Sunkern,Grass,LC,30,30,30,30,30,30
Swinub,Ice/Ground,LC,50,50,40,30,30,50
Tangela,Grass,PU,65,55,115,100,40,60
Tauros,Normal,UUBL,75,100,95,40,70,110
Teddiursa,Normal,LC,60,80,50,50,50,40
Tentacool,Water/Poison,ZU,40,40,35,50,100,70
Tentacruel,Water/Poison,UUBL,80,70,65,80,120,100
Togepi,Normal,LC,35,20,65,40,65,20
Togetic,Normal/Flying,ZU,55,40,85,80,105,40
Totodile,Water,LC,50,65,64,44,48,43
Typhlosion,Fire,UUBL,78,84,78,109,85,100
Tyranitar,Rock/Dark,OU,100,134,110,95,100,61
Tyrogue,Fighting,LC,35,35,35,35,35,35
Umbreon,Dark,OU,95,65,110,60,130,65
Unown,Psychic,ZU,48,72,48,72,48,48
Ursaring,Normal,UUBL,90,130,75,75,75,55
Vaporeon,Water,OU,130,65,60,110,95,65
Venomoth,Bug/Poison,PU,70,65,60,90,75,90
Venonat,Bug/Poison,LC,60,55,50,40,55,45
Venusaur,Grass/Poison,UUBL,80,82,83,100,100,80
Victreebel,Grass/Poison,UU,80,105,65,100,60,70
Vileplume,Grass/Poison,UU,75,80,85,100,90,50
Voltorb,Electric,PU,40,30,50,55,55,100
Vulpix,Fire,LC,38,41,40,50,65,65
Wartortle,Water,PU,59,63,80,65,80,58
Weedle,Bug/Poison,LC,40,35,30,20,20,50
Weepinbell,Grass/Poison,ZU,65,90,50,85,45,55
Weezing,Poison,NU,65,90,120,85,70,60
Wigglytuff,Normal,NU,140,70,45,75,50,45
Wobbuffet,Psychic,ZU,190,33,58,33,58,33
Wooper,Water/Ground,LC,55,45,45,25,25,15
Xatu,Psychic/Flying,NU,65,75,70,95,70,95
Yanma,Bug/Flying,ZU,65,65,45,75,45,95
Zapdos,Electric/Flying,OU,90,90,85,125,90,100
Zubat,Poison/Flying,LC,40,45,35,30,40,55`

export const TYPE_COLORS = {
  Normal: '#9e9e9e', Fire: '#e6582e', Water: '#3b8ddb', Grass: '#5aaa36',
  Electric: '#c8a800', Ice: '#5ab8b8', Fighting: '#c03028', Poison: '#a040a0',
  Ground: '#b89040', Flying: '#7060d0', Psychic: '#d84878', Bug: '#789010',
  Rock: '#a08828', Ghost: '#604878', Dragon: '#6030e8', Dark: '#503828', Steel: '#8888a8',
}

export const TYPES = [
  'Normal','Fire','Water','Grass','Electric','Ice',
  'Fighting','Poison','Ground','Flying','Psychic','Bug',
  'Rock','Ghost','Dragon','Dark','Steel',
]

// Gen 2 type chart: TYPE_CHART[attackerType][defenderType] = multiplier (only non-1x entries)
export const TYPE_CHART = {
  Normal:   { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire:     { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water:    { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Grass:    { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Electric: { Water: 2, Grass: 0.5, Electric: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Ice:      { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 0.5, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2 },
  Poison:   { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
  Ground:   { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Rock: 2, Bug: 0.5, Steel: 2 },
  Flying:   { Grass: 2, Electric: 0.5, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic:  { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug:      { Fire: 0.5, Grass: 2, Fighting: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5 },
  Rock:     { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost:    { Normal: 0, Psychic: 2, Ghost: 2, Steel: 0.5 },
  Dragon:   { Dragon: 2, Steel: 0.5 },
  Dark:     { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Steel: 0.5 },
  Steel:    { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5 },
}

// In Gen 2, move category is determined by the attacking type (not the move itself)
export const SPECIAL_TYPES = new Set(['Fire','Water','Grass','Electric','Ice','Psychic','Dragon','Dark'])

export const TIER_ORDER = ['Uber','OU','UUBL','UU','NUBL','NU','PUBL','PU','ZUBL','ZU','NFE','LC']

function getViability(tier) {
  if (['Uber','OU'].includes(tier))              return 'carry'
  if (['UUBL','UU'].includes(tier))              return 'solid'
  if (['NUBL','NU'].includes(tier))              return 'mid'
  if (['PUBL','PU','ZUBL','ZU'].includes(tier))  return 'weak'
  return 'skip'
}

export const ALL_POKEMON = RAW.trim().split('\n').map(line => {
  const [name, type, tier, hp, atk, def, spa, spd, spe] = line.split(',')
  const bst = +hp + +atk + +def + +spa + +spd + +spe
  return { name, type, tier, hp:+hp, atk:+atk, def:+def, spa:+spa, spd:+spd, spe:+spe, bst, viability: getViability(tier) }
})

export const ALL_TYPES = [...new Set(ALL_POKEMON.flatMap(d => d.type.split('/')))].sort()

// ── analysis helpers ───────────────────────────────────────────────────────────

export function getEffectiveness(atkType, defTypes) {
  return defTypes.reduce((mult, def) => mult * (TYPE_CHART[atkType]?.[def] ?? 1), 1)
}

// Which types does the team have STAB super-effective coverage against?
export function getOffensiveCoverage(team) {
  const stabs = new Set(team.flatMap(p => p ? p.type.split('/') : []))
  const result = {}
  for (const defType of TYPES) {
    result[defType] = [...stabs].some(atk => (TYPE_CHART[atk]?.[defType] ?? 1) >= 2)
  }
  return result
}

// How many team members are weak to each attacking type?
export function getTeamWeaknesses(team) {
  const counts = Object.fromEntries(TYPES.map(t => [t, 0]))
  for (const p of team) {
    if (!p) continue
    const defTypes = p.type.split('/')
    for (const atkType of TYPES) {
      if (getEffectiveness(atkType, defTypes) >= 2) counts[atkType]++
    }
  }
  return counts
}

// How many team members resist each attacking type?
export function getTeamResistances(team) {
  const counts = Object.fromEntries(TYPES.map(t => [t, 0]))
  for (const p of team) {
    if (!p) continue
    const defTypes = p.type.split('/')
    for (const atkType of TYPES) {
      if (getEffectiveness(atkType, defTypes) < 1) counts[atkType]++
    }
  }
  return counts
}

function avg(arr) { return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0 }

export function analyzeTeam(team) {
  const members = team.filter(Boolean)
  if (members.length === 0) return null

  const avgStats = {
    hp:  avg(members.map(p => p.hp)),
    atk: avg(members.map(p => p.atk)),
    def: avg(members.map(p => p.def)),
    spa: avg(members.map(p => p.spa)),
    spd: avg(members.map(p => p.spd)),
    spe: avg(members.map(p => p.spe)),
    bst: avg(members.map(p => p.bst)),
  }

  const specialCount = members.filter(p => SPECIAL_TYPES.has(p.type.split('/')[0])).length
  const physicalCount = members.length - specialCount

  // Type redundancy: any type shared by 2+ members
  const typeCounts = {}
  for (const p of members) {
    for (const t of p.type.split('/')) typeCounts[t] = (typeCounts[t] || 0) + 1
  }
  const redundant = Object.entries(typeCounts).filter(([, n]) => n >= 2).map(([t]) => t)

  return { count: members.length, avgStats, specialCount, physicalCount, redundant }
}

export function generateInsights(team, analysis, coverage, weaknesses) {
  if (!analysis) return []
  const insights = []
  const members = team.filter(Boolean)

  // Critical weaknesses (3+ members weak to same type)
  const criticalWeak = TYPES.filter(t => weaknesses[t] >= 3)
  if (criticalWeak.length > 0) {
    insights.push({ severity: 'danger', text: `Critical vulnerability: ${criticalWeak.join(', ')} — ${criticalWeak.length > 1 ? 'these types' : 'this type'} threaten ${criticalWeak.length > 1 ? 'most of' : ''} your whole team` })
  }

  // Significant weaknesses (2 members)
  const warnWeak = TYPES.filter(t => weaknesses[t] === 2)
  if (warnWeak.length > 0) {
    insights.push({ severity: 'warning', text: `Shared weakness: ${warnWeak.join(', ')} — 2 team members are vulnerable` })
  }

  // Coverage gaps
  const uncovered = TYPES.filter(t => !coverage[t])
  if (uncovered.length === 0) {
    insights.push({ severity: 'good', text: 'Full offensive coverage — your STAB types hit every type super effectively' })
  } else if (uncovered.length <= 3) {
    insights.push({ severity: 'warning', text: `Limited coverage vs: ${uncovered.join(', ')} — no STAB super effective hits` })
  } else {
    insights.push({ severity: 'danger', text: `Coverage gaps: ${uncovered.join(', ')} — consider moves outside your STAB types` })
  }

  // Speed tier
  const { avgStats, specialCount, physicalCount, redundant } = analysis
  if (avgStats.spe >= 95) {
    insights.push({ severity: 'good', text: `Fast team — avg Speed ${avgStats.spe}, you likely move first most turns` })
  } else if (avgStats.spe <= 55) {
    insights.push({ severity: 'warning', text: `Slow team — avg Speed ${avgStats.spe}, expect to take hits before you dish them out` })
  } else {
    insights.push({ severity: 'info', text: `Average Speed tier: ${avgStats.spe}` })
  }

  // Bulk
  const bulkScore = Math.round((avgStats.hp * (avgStats.def + avgStats.spd)) / 10000)
  if (bulkScore >= 14) {
    insights.push({ severity: 'good', text: `Bulky team — avg bulk score ${bulkScore}, hard to KO in one hit` })
  } else if (bulkScore <= 7) {
    insights.push({ severity: 'warning', text: `Frail team — avg bulk score ${bulkScore}, offensive pressure is your best defense` })
  }

  // Physical/Special bias
  if (members.length >= 4) {
    if (specialCount >= members.length - 1) {
      insights.push({ severity: 'info', text: `Special-heavy (${specialCount}/${members.length}) — consider a physical attacker for Normal/Dark/Steel coverage` })
    } else if (physicalCount >= members.length - 1) {
      insights.push({ severity: 'info', text: `Physical-heavy (${physicalCount}/${members.length}) — consider a special attacker for Psychic/Fire/Ice coverage` })
    }
  }

  // Type redundancy
  if (redundant.length > 0) {
    insights.push({ severity: 'info', text: `Type overlap: ${redundant.join(', ')} — shared types mean shared weaknesses` })
  }

  return insights
}
