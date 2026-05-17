const KEYS = {
  history: 'yt_history',
  watchLater: 'yt_watch_later',
  liked: 'yt_liked',
  playlists: 'yt_playlists',
}

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

// ── History ──────────────────────────────────────────────────
export function addToHistory(video) {
  if (!video?.id) return
  const list = load(KEYS.history).filter((v) => v.id !== video.id)
  list.unshift({ ...video, watchedAt: new Date().toISOString() })
  save(KEYS.history, list.slice(0, 300))
}
export function getHistory() { return load(KEYS.history) }
export function removeFromHistory(id) { save(KEYS.history, load(KEYS.history).filter((v) => v.id !== id)) }
export function clearHistory() { save(KEYS.history, []) }

// ── Watch Later ───────────────────────────────────────────────
export function addToWatchLater(video) {
  if (!video?.id) return
  const list = load(KEYS.watchLater).filter((v) => v.id !== video.id)
  list.unshift(video)
  save(KEYS.watchLater, list)
}
export function removeFromWatchLater(id) { save(KEYS.watchLater, load(KEYS.watchLater).filter((v) => v.id !== id)) }
export function getWatchLater() { return load(KEYS.watchLater) }
export function isInWatchLater(id) { return load(KEYS.watchLater).some((v) => v.id === id) }

// ── Liked Videos ──────────────────────────────────────────────
export function addToLiked(video) {
  if (!video?.id) return
  const list = load(KEYS.liked).filter((v) => v.id !== video.id)
  list.unshift(video)
  save(KEYS.liked, list)
}
export function removeFromLiked(id) { save(KEYS.liked, load(KEYS.liked).filter((v) => v.id !== id)) }
export function getLiked() { return load(KEYS.liked) }
export function isLiked(id) { return load(KEYS.liked).some((v) => v.id === id) }

// ── Playlists ─────────────────────────────────────────────────
export function getPlaylists() { return load(KEYS.playlists) }

export function createPlaylist(name) {
  const pl = { id: Date.now().toString(), name, videos: [], createdAt: new Date().toISOString() }
  const list = [pl, ...load(KEYS.playlists)]
  save(KEYS.playlists, list)
  return pl
}

export function deletePlaylist(plId) { save(KEYS.playlists, load(KEYS.playlists).filter((p) => p.id !== plId)) }

export function renamePlaylist(plId, name) {
  save(KEYS.playlists, load(KEYS.playlists).map((p) => p.id === plId ? { ...p, name } : p))
}

export function addToPlaylist(plId, video) {
  save(KEYS.playlists, load(KEYS.playlists).map((p) => {
    if (p.id !== plId) return p
    const videos = [video, ...p.videos.filter((v) => v.id !== video.id)]
    return { ...p, videos }
  }))
}

export function removeFromPlaylist(plId, videoId) {
  save(KEYS.playlists, load(KEYS.playlists).map((p) => {
    if (p.id !== plId) return p
    return { ...p, videos: p.videos.filter((v) => v.id !== videoId) }
  }))
}

export function isInPlaylist(plId, videoId) {
  return load(KEYS.playlists).find((p) => p.id === plId)?.videos.some((v) => v.id === videoId) || false
}
