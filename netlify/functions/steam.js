const API_KEY  = process.env.STEAM_API_KEY
const STEAM_ID = process.env.STEAM_USER_ID

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: HEADERS, body: '' }
  }

  if (!API_KEY || !STEAM_ID) {
    return {
      statusCode: 503,
      headers: HEADERS,
      body: JSON.stringify({ error: 'Steam not configured' }),
    }
  }

  const type = event.queryStringParameters?.type || 'recent'

  try {
    if (type === 'recent') {
      const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${API_KEY}&steamid=${STEAM_ID}&count=5&format=json`
      const res  = await fetch(url)
      const { response } = await res.json()
      const games = (response.games || []).map(g => ({
        name:             g.name,
        appid:            g.appid,
        playtime_2weeks:  g.playtime_2weeks  || 0,
        playtime_forever: g.playtime_forever || 0,
        icon:             g.img_icon_url
          ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
          : null,
      }))
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ games }) }
    }

    if (type === 'profile') {
      const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${STEAM_ID}`
      const res  = await fetch(url)
      const { response } = await res.json()
      const player = response.players?.[0]
      if (!player) {
        return { statusCode: 404, headers: HEADERS, body: JSON.stringify({ error: 'Player not found' }) }
      }
      return {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify({
          name:          player.personaname,
          avatar:        player.avatarmedium,
          profileUrl:    player.profileurl,
          currentGame:   player.gameextrainfo || null,
          currentGameId: player.gameid        || null,
        }),
      }
    }

    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: 'Unknown type. Use ?type=recent or ?type=profile' }) }
  } catch (err) {
    console.error('Steam function error:', err)
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: 'Steam API request failed' }) }
  }
}
