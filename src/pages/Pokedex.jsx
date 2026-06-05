import { useState, useMemo } from 'react'
import Nav from '../components/Nav'
import Meta from '../components/Meta'
import '../styles/pokedex.css'

// ── raw data ──────────────────────────────────────────────────────────────────
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

const EVO = {
  Abra:       { chain: [{n:'Kadabra',h:'Lv 16'},{n:'Alakazam',h:'Trade'}], finalTier:'OU', trade:true },
  Kadabra:    { chain: [{n:'Alakazam',h:'Trade'}], finalTier:'OU', trade:true },
  Bellsprout: { chain: [{n:'Weepinbell',h:'Lv 21'},{n:'Victreebel',h:'Leaf Stone'}], finalTier:'UU' },
  Weepinbell: { chain: [{n:'Victreebel',h:'Leaf Stone'}], finalTier:'UU' },
  Bulbasaur:  { chain: [{n:'Ivysaur',h:'Lv 16'},{n:'Venusaur',h:'Lv 32'}], finalTier:'UUBL' },
  Ivysaur:    { chain: [{n:'Venusaur',h:'Lv 32'}], finalTier:'UUBL' },
  Caterpie:   { chain: [{n:'Metapod',h:'Lv 7'},{n:'Butterfree',h:'Lv 10'}], finalTier:'ZU' },
  Metapod:    { chain: [{n:'Butterfree',h:'Lv 10'}], finalTier:'ZU' },
  Weedle:     { chain: [{n:'Kakuna',h:'Lv 7'},{n:'Beedrill',h:'Lv 10'}], finalTier:'ZUBL' },
  Kakuna:     { chain: [{n:'Beedrill',h:'Lv 10'}], finalTier:'ZUBL' },
  Charmander: { chain: [{n:'Charmeleon',h:'Lv 16'},{n:'Charizard',h:'Lv 36'}], finalTier:'UUBL' },
  Charmeleon: { chain: [{n:'Charizard',h:'Lv 36'}], finalTier:'UUBL' },
  Chikorita:  { chain: [{n:'Bayleef',h:'Lv 18'},{n:'Meganium',h:'Lv 32'}], finalTier:'UUBL' },
  Bayleef:    { chain: [{n:'Meganium',h:'Lv 32'}], finalTier:'UUBL' },
  Chinchou:   { chain: [{n:'Lanturn',h:'Lv 27'}], finalTier:'UU' },
  Cleffa:     { chain: [{n:'Clefairy',h:'Happiness'},{n:'Clefable',h:'Moon Stone'}], finalTier:'UUBL' },
  Clefairy:   { chain: [{n:'Clefable',h:'Moon Stone'}], finalTier:'UUBL' },
  Cyndaquil:  { chain: [{n:'Quilava',h:'Lv 14'},{n:'Typhlosion',h:'Lv 36'}], finalTier:'UUBL' },
  Quilava:    { chain: [{n:'Typhlosion',h:'Lv 36'}], finalTier:'UUBL' },
  Diglett:    { chain: [{n:'Dugtrio',h:'Lv 26'}], finalTier:'NU' },
  Doduo:      { chain: [{n:'Dodrio',h:'Lv 31'}], finalTier:'UU' },
  Dratini:    { chain: [{n:'Dragonair',h:'Lv 30'},{n:'Dragonite',h:'Lv 55'}], finalTier:'UUBL' },
  Dragonair:  { chain: [{n:'Dragonite',h:'Lv 55'}], finalTier:'UUBL' },
  Drowzee:    { chain: [{n:'Hypno',h:'Lv 26'}], finalTier:'UU' },
  Eevee:      { chain: [{n:'Espeon/Umbreon/Vaporeon/etc',h:'Stone or Happiness+Time'}], finalTier:'OU' },
  Ekans:      { chain: [{n:'Arbok',h:'Lv 22'}], finalTier:'PU' },
  Elekid:     { chain: [{n:'Electabuzz',h:'Lv 30'}], finalTier:'UU' },
  Exeggcute:  { chain: [{n:'Exeggutor',h:'Leaf Stone'}], finalTier:'OU' },
  Flaaffy:    { chain: [{n:'Ampharos',h:'Lv 30'}], finalTier:'UU' },
  Mareep:     { chain: [{n:'Flaaffy',h:'Lv 15'},{n:'Ampharos',h:'Lv 30'}], finalTier:'UU' },
  Gastly:     { chain: [{n:'Haunter',h:'Lv 25'},{n:'Gengar',h:'Trade'}], finalTier:'OU', trade:true },
  Haunter:    { chain: [{n:'Gengar',h:'Trade'}], finalTier:'OU', trade:true },
  Geodude:    { chain: [{n:'Graveler',h:'Lv 25'},{n:'Golem',h:'Trade'}], finalTier:'OU', trade:true },
  Graveler:   { chain: [{n:'Golem',h:'Trade'}], finalTier:'OU', trade:true },
  Golbat:     { chain: [{n:'Crobat',h:'Happiness'}], finalTier:'UU' },
  Zubat:      { chain: [{n:'Golbat',h:'Lv 22'},{n:'Crobat',h:'Happiness'}], finalTier:'UU' },
  Grimer:     { chain: [{n:'Muk',h:'Lv 38'}], finalTier:'UU' },
  Growlithe:  { chain: [{n:'Arcanine',h:'Fire Stone'}], finalTier:'UU' },
  Hoothoot:   { chain: [{n:'Noctowl',h:'Lv 20'}], finalTier:'PU' },
  Hoppip:     { chain: [{n:'Skiploom',h:'Lv 18'},{n:'Jumpluff',h:'Lv 27'}], finalTier:'UU' },
  Skiploom:   { chain: [{n:'Jumpluff',h:'Lv 27'}], finalTier:'UU' },
  Horsea:     { chain: [{n:'Seadra',h:'Lv 32'},{n:'Kingdra',h:'Trade+Dragon Scale'}], finalTier:'UUBL', trade:true },
  Seadra:     { chain: [{n:'Kingdra',h:'Trade+Dragon Scale'}], finalTier:'UUBL', trade:true },
  Houndour:   { chain: [{n:'Houndoom',h:'Lv 24'}], finalTier:'UUBL' },
  Igglybuff:  { chain: [{n:'Jigglypuff',h:'Happiness'},{n:'Wigglytuff',h:'Moon Stone'}], finalTier:'NU' },
  Jigglypuff: { chain: [{n:'Wigglytuff',h:'Moon Stone'}], finalTier:'NU' },
  Koffing:    { chain: [{n:'Weezing',h:'Lv 35'}], finalTier:'NU' },
  Krabby:     { chain: [{n:'Kingler',h:'Lv 28'}], finalTier:'NU' },
  Larvitar:   { chain: [{n:'Pupitar',h:'Lv 30'},{n:'Tyranitar',h:'Lv 55'}], finalTier:'OU' },
  Pupitar:    { chain: [{n:'Tyranitar',h:'Lv 55'}], finalTier:'OU' },
  Ledyba:     { chain: [{n:'Ledian',h:'Lv 18'}], finalTier:'NU' },
  Machop:     { chain: [{n:'Machoke',h:'Lv 28'},{n:'Machamp',h:'Trade'}], finalTier:'OU', trade:true },
  Machoke:    { chain: [{n:'Machamp',h:'Trade'}], finalTier:'OU', trade:true },
  Magby:      { chain: [{n:'Magmar',h:'Lv 30'}], finalTier:'NU' },
  Magikarp:   { chain: [{n:'Gyarados',h:'Lv 20'}], finalTier:'UU' },
  Magnemite:  { chain: [{n:'Magneton',h:'Lv 30'}], finalTier:'UU' },
  Mankey:     { chain: [{n:'Primeape',h:'Lv 28'}], finalTier:'NU' },
  Marill:     { chain: [{n:'Azumarill',h:'Lv 18'}], finalTier:'PU' },
  Meowth:     { chain: [{n:'Persian',h:'Lv 28'}], finalTier:'NU' },
  Natu:       { chain: [{n:'Xatu',h:'Lv 25'}], finalTier:'NU' },
  'Nidoran-F':{ chain: [{n:'Nidorina',h:'Lv 16'},{n:'Nidoqueen',h:'Moon Stone'}], finalTier:'UU' },
  Nidorina:   { chain: [{n:'Nidoqueen',h:'Moon Stone'}], finalTier:'UU' },
  'Nidoran-M':{ chain: [{n:'Nidorino',h:'Lv 16'},{n:'Nidoking',h:'Moon Stone'}], finalTier:'OU' },
  Nidorino:   { chain: [{n:'Nidoking',h:'Moon Stone'}], finalTier:'OU' },
  Oddish:     { chain: [{n:'Gloom',h:'Lv 21'},{n:'Vileplume/Bellossom',h:'Leaf/Sun Stone'}], finalTier:'UU' },
  Gloom:      { chain: [{n:'Vileplume/Bellossom',h:'Leaf or Sun Stone'}], finalTier:'UU' },
  Omanyte:    { chain: [{n:'Omastar',h:'Lv 40'}], finalTier:'UU' },
  Onix:       { chain: [{n:'Steelix',h:'Trade+Metal Coat'}], finalTier:'OU', trade:true },
  Paras:      { chain: [{n:'Parasect',h:'Lv 24'}], finalTier:'ZU' },
  Phanpy:     { chain: [{n:'Donphan',h:'Lv 25'}], finalTier:'UUBL' },
  Pichu:      { chain: [{n:'Pikachu',h:'Happiness'},{n:'Raichu',h:'Thunder Stone'}], finalTier:'NUBL' },
  Pikachu:    { chain: [{n:'Raichu',h:'Thunder Stone'}], finalTier:'NUBL' },
  Pidgey:     { chain: [{n:'Pidgeotto',h:'Lv 18'},{n:'Pidgeot',h:'Lv 36'}], finalTier:'NU' },
  Pidgeotto:  { chain: [{n:'Pidgeot',h:'Lv 36'}], finalTier:'NU' },
  Pineco:     { chain: [{n:'Forretress',h:'Lv 31'}], finalTier:'OU' },
  Poliwag:    { chain: [{n:'Poliwhirl',h:'Lv 25'},{n:'Poliwrath/Politoed',h:'Water Stone or Trade+Kings Rock'}], finalTier:'UU' },
  Poliwhirl:  { chain: [{n:'Poliwrath/Politoed',h:'Water Stone or Trade+Kings Rock'}], finalTier:'UU' },
  Ponyta:     { chain: [{n:'Rapidash',h:'Lv 40'}], finalTier:'NU' },
  Psyduck:    { chain: [{n:'Golduck',h:'Lv 33'}], finalTier:'NUBL' },
  Remoraid:   { chain: [{n:'Octillery',h:'Lv 25'}], finalTier:'NU' },
  Rhyhorn:    { chain: [{n:'Rhydon',h:'Lv 42'}], finalTier:'OU' },
  Sandshrew:  { chain: [{n:'Sandslash',h:'Lv 22'}], finalTier:'UU' },
  Scyther:    { chain: [{n:'Scizor',h:'Trade+Metal Coat'}], finalTier:'UUBL', trade:true },
  Seel:       { chain: [{n:'Dewgong',h:'Lv 34'}], finalTier:'NU' },
  Sentret:    { chain: [{n:'Furret',h:'Lv 15'}], finalTier:'PU' },
  Shellder:   { chain: [{n:'Cloyster',h:'Water Stone'}], finalTier:'OU' },
  Slowpoke:   { chain: [{n:'Slowbro',h:'Lv 37'},{n:'or Slowking',h:'Trade+Kings Rock'}], finalTier:'UU' },
  Slugma:     { chain: [{n:'Magcargo',h:'Lv 38'}], finalTier:'PU' },
  Smoochum:   { chain: [{n:'Jynx',h:'Lv 30'}], finalTier:'OU' },
  Sneasel:    { chain: [], note: 'No evo in Gen 2' },
  Snubbull:   { chain: [{n:'Granbull',h:'Lv 23'}], finalTier:'UU' },
  Spearow:    { chain: [{n:'Fearow',h:'Lv 20'}], finalTier:'NU' },
  Spinarak:   { chain: [{n:'Ariados',h:'Lv 22'}], finalTier:'ZUBL' },
  Squirtle:   { chain: [{n:'Wartortle',h:'Lv 16'},{n:'Blastoise',h:'Lv 36'}], finalTier:'UU' },
  Wartortle:  { chain: [{n:'Blastoise',h:'Lv 36'}], finalTier:'UU' },
  Staryu:     { chain: [{n:'Starmie',h:'Water Stone'}], finalTier:'OU' },
  Sunkern:    { chain: [{n:'Sunflora',h:'Sun Stone'}], finalTier:'PU' },
  Swinub:     { chain: [{n:'Piloswine',h:'Lv 33'}], finalTier:'UU' },
  Teddiursa:  { chain: [{n:'Ursaring',h:'Lv 30'}], finalTier:'UUBL' },
  Tentacool:  { chain: [{n:'Tentacruel',h:'Lv 30'}], finalTier:'UUBL' },
  Togepi:     { chain: [{n:'Togetic',h:'Happiness'}], finalTier:'ZU' },
  Totodile:   { chain: [{n:'Croconaw',h:'Lv 18'},{n:'Feraligatr',h:'Lv 30'}], finalTier:'UU' },
  Croconaw:   { chain: [{n:'Feraligatr',h:'Lv 30'}], finalTier:'UU' },
  Tyrogue:    { chain: [{n:'Hitmonlee/chan/top',h:'Lv 20 by stats'}], finalTier:'NU' },
  Venonat:    { chain: [{n:'Venomoth',h:'Lv 31'}], finalTier:'PU' },
  Voltorb:    { chain: [{n:'Electrode',h:'Lv 30'}], finalTier:'UU' },
  Vulpix:     { chain: [{n:'Ninetales',h:'Fire Stone'}], finalTier:'NU' },
  Rattata:    { chain: [{n:'Raticate',h:'Lv 20'}], finalTier:'PU' },
  Goldeen:    { chain: [{n:'Seaking',h:'Lv 33'}], finalTier:'PU' },
  Kabuto:     { chain: [{n:'Kabutops',h:'Lv 40'}], finalTier:'UU' },
  Wooper:     { chain: [{n:'Quagsire',h:'Lv 20'}], finalTier:'UU' },
  Mantine:    { chain: [], note: 'No evo in Gen 2' },
  Yanma:      { chain: [], note: 'No evo in Gen 2' },
  Aipom:      { chain: [], note: 'No evo in Gen 2' },
  Unown:      { chain: [], note: 'No evo' },
  Smeargle:   { chain: [], note: 'No evo' },
}

const TIER_ORDER = ['Uber','OU','UUBL','UU','NUBL','NU','PUBL','PU','ZUBL','ZU','NFE','LC']

const TYPE_COLORS = {
  Normal:'#9e9e9e', Fire:'#e6582e', Water:'#3b8ddb', Grass:'#5aaa36',
  Electric:'#c8a800', Ice:'#5ab8b8', Fighting:'#c03028', Poison:'#a040a0',
  Ground:'#b89040', Flying:'#7060d0', Psychic:'#d84878', Bug:'#789010',
  Rock:'#a08828', Ghost:'#604878', Dragon:'#6030e8', Dark:'#503828', Steel:'#8888a8',
}

const MAX_STATS = { hp:255, atk:134, def:230, spa:154, spd:230, spe:140 }

const VERDICT_LABEL = { carry:'★ CARRY', solid:'▲ SOLID', mid:'~ MID', weak:'▼ WEAK', skip:'✕ SKIP' }
const DOT_CLS  = { carry:'vdot-carry', solid:'vdot-solid', mid:'vdot-mid', weak:'vdot-weak', skip:'vdot-skip' }
const ROW_CLS  = { carry:'row-viable', solid:'row-viable', mid:'row-decent', weak:'row-skip', skip:'row-misc' }
const VERDICT_CLS = { carry:'verdict-carry', solid:'verdict-solid', mid:'verdict-mid', weak:'verdict-weak', skip:'verdict-skip' }

// ── helpers ───────────────────────────────────────────────────────────────────
function getViability(tier) {
  if (['Uber','OU'].includes(tier))         return 'carry'
  if (['UUBL','UU'].includes(tier))         return 'solid'
  if (['NUBL','NU'].includes(tier))         return 'mid'
  if (['PUBL','PU','ZUBL','ZU'].includes(tier)) return 'weak'
  return 'skip'
}

function ftClass(ft, trade) {
  if (trade) return 'eb-trade'
  if (!ft)   return 'eb-meh'
  if (['OU','Uber'].includes(ft))           return 'eb-great'
  if (['UUBL','UU','NUBL'].includes(ft))    return 'eb-good'
  return 'eb-meh'
}

function ftLabel(ft, trade) {
  if (trade) return 'TRADE'
  if (!ft)   return 'MEH'
  if (['OU','Uber'].includes(ft))           return 'GREAT'
  if (['UUBL','UU','NUBL'].includes(ft))    return 'GOOD'
  return 'MEH'
}

function tierCls(t) { return 't-' + t.toLowerCase().replace(/[^a-z]/g, '') }

// ── parsed data (module-level, computed once) ─────────────────────────────────
const ALL_POKEMON = RAW.trim().split('\n').map(line => {
  const [name, type, tier, hp, atk, def, spa, spd, spe] = line.split(',')
  const bst = +hp + +atk + +def + +spa + +spd + +spe
  return { name, type, tier, hp:+hp, atk:+atk, def:+def, spa:+spa, spd:+spd, spe:+spe, bst, viability: getViability(tier) }
})

const ALL_TYPES = [...new Set(ALL_POKEMON.flatMap(d => d.type.split('/')))].sort()

// ── sub-components ────────────────────────────────────────────────────────────
function StatBar({ val, max }) {
  const pct = Math.round(val / max * 100)
  const color = pct > 65 ? '#39d353' : pct > 35 ? '#f0b429' : '#e05252'
  return (
    <div className="stat-bar">
      <div className="bar-bg">
        <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="bar-val">{val}</span>
    </div>
  )
}

function TypeBadges({ typeStr }) {
  return (
    <>
      {typeStr.split('/').map(t => {
        const bg = TYPE_COLORS[t] || '#888'
        return (
          <span key={t} className="type-badge" style={{ background:`${bg}22`, color:bg, border:`1px solid ${bg}44` }}>
            {t}
          </span>
        )
      })}
    </>
  )
}

function EvoCell({ name }) {
  const evo = EVO[name]
  if (!evo || (!evo.chain?.length && !evo.note)) return <span className="evo-muted">— final form —</span>
  if (evo.note) return <span className="evo-muted">{evo.note}</span>
  const { chain, finalTier, trade } = evo
  const bc = ftClass(finalTier, trade)
  const bl = ftLabel(finalTier, trade)
  return (
    <div className="evo-cell">
      {chain.map((step, i) => (
        <div key={i} className="evo-line" style={i > 0 ? { marginLeft: i * 10 } : undefined}>
          <span className="evo-arrow">→</span>
          <span className="evo-name">{step.n}</span>
          <span className="evo-how">({step.h})</span>
          {i === chain.length - 1 && <span className={`evo-badge ${bc}`}>{bl}</span>}
        </div>
      ))}
    </div>
  )
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function Pokedex() {
  const [query, setQuery]                   = useState('')
  const [viabilityFilter, setViabilityFilter] = useState('')
  const [tierFilter, setTierFilter]         = useState('')
  const [typeFilter, setTypeFilter]         = useState('')
  const [sortKey, setSortKey]               = useState('tier')
  const [sortDir, setSortDir]               = useState(1)

  const visibleRows = useMemo(() => {
    const q = query.toLowerCase()
    const filtered = ALL_POKEMON.filter(d => {
      if (q && !d.name.toLowerCase().includes(q))          return false
      if (viabilityFilter && d.viability !== viabilityFilter) return false
      if (tierFilter && d.tier !== tierFilter)              return false
      if (typeFilter && !d.type.split('/').includes(typeFilter)) return false
      return true
    })
    return [...filtered].sort((a, b) => {
      const av = sortKey === 'tier' ? TIER_ORDER.indexOf(a.tier) : a[sortKey]
      const bv = sortKey === 'tier' ? TIER_ORDER.indexOf(b.tier) : b[sortKey]
      if (typeof av === 'string') return av.localeCompare(bv) * sortDir
      return (av - bv) * sortDir
    })
  }, [query, viabilityFilter, tierFilter, typeFilter, sortKey, sortDir])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d * -1)
    } else {
      setSortKey(key)
      setSortDir(key === 'name' || key === 'type' || key === 'tier' ? 1 : -1)
    }
  }

  const thCls = (key) => `pdx-th${sortKey === key ? ' sorted' : ''}`

  return (
    <div
      className="min-h-screen bg-hp-bg text-hp-text"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      <Nav />
      <Meta title="Crystal Pokédex" description="GSC viability reference — all 251 Pokémon with stats, tiers, and evolution chains." />

      <div className="pokedex-wrap">
        <header>
          <div className="pdx-logo">★ CRYSTAL POKÉDEX ★</div>
          <div className="pdx-subtitle">GSC VIABILITY REFERENCE — STORY MODE EDITION — 251 POKÉMON</div>
        </header>

        <div className="pdx-controls">
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <select value={viabilityFilter} onChange={e => setViabilityFilter(e.target.value)}>
            <option value="">All viability</option>
            <option value="carry">★ Carry (OU/Uber)</option>
            <option value="solid">▲ Solid (UU)</option>
            <option value="mid">~ Mid (NU)</option>
            <option value="weak">▼ Weak (PU/ZU)</option>
            <option value="skip">✕ Skip (LC/NFE)</option>
          </select>
          <select value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
            <option value="">All tiers</option>
            {TIER_ORDER.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All types</option>
            {ALL_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={sortKey} onChange={e => handleSort(e.target.value)}>
            <option value="tier">Sort: Tier</option>
            <option value="bst">Sort: BST</option>
            <option value="name">Sort: Name</option>
            <option value="hp">Sort: HP</option>
            <option value="atk">Sort: Atk</option>
            <option value="spa">Sort: SpA</option>
            <option value="spe">Sort: Spe</option>
          </select>
        </div>

        <div className="pdx-legend">
          {[
            { color:'#39d353', label:'★ Carry — endgame viable' },
            { color:'#90d060', label:'▲ Solid — good pick' },
            { color:'#f0b429', label:'~ Mid — usable filler' },
            { color:'#e05252', label:'▼ Weak — replace eventually' },
            { color:'#6b7080', label:'✕ LC/NFE — evolve or ditch' },
            { color:'#60a0f0', label:'TRADE badge = needs link cable' },
          ].map(({ color, label }) => (
            <div key={label} className="legend-item">
              <span className="dot" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>

        <div className="pdx-summary">
          SHOWING {visibleRows.length} / {ALL_POKEMON.length} POKÉMON
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th className="pdx-th">·</th>
                <th className={thCls('name')} onClick={() => handleSort('name')}>NAME</th>
                <th className={thCls('type')} onClick={() => handleSort('type')}>TYPE</th>
                <th className={thCls('tier')} onClick={() => handleSort('tier')}>TIER</th>
                <th className="pdx-th" style={{cursor:'default'}}>EVOLUTION CHAIN</th>
                <th className={thCls('hp')}  onClick={() => handleSort('hp')}>HP</th>
                <th className={thCls('atk')} onClick={() => handleSort('atk')}>ATK</th>
                <th className={thCls('def')} onClick={() => handleSort('def')}>DEF</th>
                <th className={thCls('spa')} onClick={() => handleSort('spa')}>SPA</th>
                <th className={thCls('spd')} onClick={() => handleSort('spd')}>SPD</th>
                <th className={thCls('spe')} onClick={() => handleSort('spe')}>SPE</th>
                <th className={thCls('bst')} onClick={() => handleSort('bst')}>BST</th>
                <th className="pdx-th" style={{cursor:'default'}}>VERDICT</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={13} className="no-results">NO POKÉMON FOUND</td>
                </tr>
              ) : visibleRows.map(d => (
                <tr key={d.name} className={ROW_CLS[d.viability]}>
                  <td><span className={`vdot ${DOT_CLS[d.viability]}`} /></td>
                  <td><div className="name-cell">{d.name}</div></td>
                  <td><TypeBadges typeStr={d.type} /></td>
                  <td><span className={`tier-badge ${tierCls(d.tier)}`}>{d.tier}</span></td>
                  <td><EvoCell name={d.name} /></td>
                  <td><StatBar val={d.hp}  max={MAX_STATS.hp} /></td>
                  <td><StatBar val={d.atk} max={MAX_STATS.atk} /></td>
                  <td><StatBar val={d.def} max={MAX_STATS.def} /></td>
                  <td><StatBar val={d.spa} max={MAX_STATS.spa} /></td>
                  <td><StatBar val={d.spd} max={MAX_STATS.spd} /></td>
                  <td><StatBar val={d.spe} max={MAX_STATS.spe} /></td>
                  <td><StatBar val={d.bst} max={680} /></td>
                  <td><span className={`verdict ${VERDICT_CLS[d.viability]}`}>{VERDICT_LABEL[d.viability]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
