const BASE = 'https://www.googleapis.com/youtube/v3'

export const getApiKey = () => localStorage.getItem('yt_api_key') || ''
export const saveApiKey = (key) => localStorage.setItem('yt_api_key', key)
export const clearApiKey = () => localStorage.removeItem('yt_api_key')

async function yt(endpoint, params) {
  const key = getApiKey()
  if (!key) throw Object.assign(new Error('NO_API_KEY'), { code: 'NO_API_KEY' })
  const url = new URL(`${BASE}/${endpoint}`)
  url.searchParams.set('key', key)
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== '') url.searchParams.set(k, v)
  }
  const res = await fetch(url)
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw Object.assign(new Error(data.error?.message || `HTTP ${res.status}`), {
      code: data.error?.errors?.[0]?.reason || 'API_ERROR',
      status: res.status,
    })
  }
  return res.json()
}

export async function getHomeVideos({ categoryId = '', pageToken = '' } = {}) {
  return yt('videos', {
    part: 'snippet,contentDetails,statistics',
    chart: 'mostPopular',
    maxResults: 24,
    regionCode: 'US',
    videoCategoryId: categoryId,
    pageToken,
  })
}

export async function searchVideos(query, { pageToken = '', type = 'video' } = {}) {
  const data = await yt('search', {
    part: 'snippet',
    q: query,
    type,
    maxResults: 24,
    pageToken,
  })
  if (!data.items?.length) return { ...data, items: [] }
  const ids = data.items.map((i) => i.id.videoId).filter(Boolean).join(',')
  if (!ids) return { ...data, items: [] }
  const details = await yt('videos', {
    part: 'snippet,contentDetails,statistics',
    id: ids,
  })
  return { ...data, items: details.items }
}

export async function getVideo(videoId) {
  return yt('videos', {
    part: 'snippet,contentDetails,statistics',
    id: videoId,
  })
}

export async function getRelatedVideos(videoId, title) {
  // relatedToVideoId was deprecated; search by title as fallback
  const data = await yt('search', {
    part: 'snippet',
    q: title,
    type: 'video',
    maxResults: 20,
  })
  if (!data.items?.length) return { items: [] }
  const ids = data.items
    .map((i) => i.id.videoId)
    .filter((id) => id && id !== videoId)
    .slice(0, 16)
    .join(',')
  if (!ids) return { items: [] }
  return yt('videos', {
    part: 'snippet,contentDetails,statistics',
    id: ids,
  })
}

export async function getChannel(channelId) {
  return yt('channels', {
    part: 'snippet,statistics',
    id: channelId,
  })
}

export async function getComments(videoId) {
  return yt('commentThreads', {
    part: 'snippet',
    videoId,
    maxResults: 20,
    order: 'relevance',
  }).catch(() => ({ items: [] }))
}

export async function getChannelVideos(channelId, { pageToken = '' } = {}) {
  const chanData = await yt('channels', { part: 'contentDetails,snippet,statistics', id: channelId })
  const chan = chanData.items?.[0]
  if (!chan) throw new Error('Channel not found')
  const uploadsId = chan.contentDetails?.relatedPlaylists?.uploads
  if (!uploadsId) return { channel: chan, items: [] }
  const plData = await yt('playlistItems', {
    part: 'contentDetails',
    playlistId: uploadsId,
    maxResults: 24,
    pageToken,
  })
  const ids = plData.items.map((i) => i.contentDetails.videoId).join(',')
  if (!ids) return { channel: chan, items: [], nextPageToken: '' }
  const videos = await yt('videos', { part: 'snippet,contentDetails,statistics', id: ids })
  return { channel: chan, items: videos.items, nextPageToken: plData.nextPageToken || '' }
}

export async function getShorts({ pageToken = '' } = {}) {
  const data = await yt('search', {
    part: 'snippet',
    q: '#shorts',
    type: 'video',
    videoDuration: 'short',
    maxResults: 20,
    pageToken,
  })
  if (!data.items?.length) return { items: [], nextPageToken: '' }
  const ids = data.items.map((i) => i.id.videoId).filter(Boolean).join(',')
  if (!ids) return { items: [], nextPageToken: '' }
  const details = await yt('videos', { part: 'snippet,contentDetails,statistics', id: ids })
  return { items: details.items, nextPageToken: data.nextPageToken || '' }
}

// ─── Formatters ───────────────────────────────────────────────

export function formatViews(n) {
  const v = parseInt(n || 0)
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B views`
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M views`
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K views`
  return `${v} views`
}

export function formatCount(n) {
  const v = parseInt(n || 0)
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`
  return `${v}`
}

export function formatDuration(iso) {
  if (!iso) return ''
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return ''
  const h = parseInt(m[1] || 0)
  const min = parseInt(m[2] || 0)
  const s = parseInt(m[3] || 0)
  if (h > 0) return `${h}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${min}:${String(s).padStart(2, '0')}`
}

export function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const s = Math.floor(diff / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  const mo = Math.floor(d / 30)
  const y = Math.floor(d / 365)
  if (y > 0) return `${y} year${y > 1 ? 's' : ''} ago`
  if (mo > 0) return `${mo} month${mo > 1 ? 's' : ''} ago`
  if (d > 0) return `${d} day${d > 1 ? 's' : ''} ago`
  if (h > 0) return `${h} hour${h > 1 ? 's' : ''} ago`
  if (m > 0) return `${m} minute${m > 1 ? 's' : ''} ago`
  return 'just now'
}

export function getBestThumbnail(thumbnails) {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    ''
  )
}

export function channelColor(name = '') {
  const colors = [
    '#1565C0','#283593','#6A1B9A','#4A148C','#880E4F',
    '#B71C1C','#E65100','#1B5E20','#004D40','#006064',
    '#01579B','#37474F','#424242',
  ]
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return colors[Math.abs(hash) % colors.length]
}
