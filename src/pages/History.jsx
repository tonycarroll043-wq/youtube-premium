import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, X, Search, Clock } from 'lucide-react'
import {
  getHistory, removeFromHistory, clearHistory,
} from '../services/storage'
import {
  getBestThumbnail, formatViews, formatDuration, timeAgo, channelColor,
} from '../services/youtube'

function HistoryRow({ video, onRemove }) {
  const { snippet, contentDetails, statistics, id, watchedAt } = video
  if (!snippet) return null
  const thumb = getBestThumbnail(snippet.thumbnails)
  const duration = formatDuration(contentDetails?.duration)
  const bg = channelColor(snippet.channelTitle)

  return (
    <div className="flex gap-4 group py-2">
      <Link to={`/watch?v=${id}`} className="relative flex-shrink-0 w-48 rounded-xl overflow-hidden bg-yt-surface">
        <div className="aspect-video">
          <img src={thumb} alt={snippet.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        {duration && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded font-medium">{duration}</span>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/watch?v=${id}`}>
          <h3 className="text-yt-text text-sm font-medium line-clamp-2 leading-snug hover:text-white">{snippet.title}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: bg }}>
            {(snippet.channelTitle || '?')[0].toUpperCase()}
          </div>
          <Link to={`/channel/${snippet.channelId}`} className="text-yt-muted text-xs hover:text-yt-text">{snippet.channelTitle}</Link>
        </div>
        <p className="text-yt-muted text-xs mt-0.5">{formatViews(statistics?.viewCount)} · Watched {timeAgo(watchedAt)}</p>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-yt-surface text-yt-muted hover:text-yt-text transition-all flex-shrink-0 self-start mt-1"
        title="Remove from history"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function History() {
  const [history, setHistory] = useState(() => getHistory())
  const [search, setSearch] = useState('')

  const filtered = search
    ? history.filter((v) => v.snippet?.title?.toLowerCase().includes(search.toLowerCase()))
    : history

  function handleRemove(id) {
    removeFromHistory(id)
    setHistory(getHistory())
  }

  function handleClear() {
    clearHistory()
    setHistory([])
  }

  return (
    <div className="px-4 md:px-6 pt-4 pb-10 max-w-[900px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-yt-text text-2xl font-bold">Watch history</h1>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 text-yt-muted hover:text-yt-text text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear all history
          </button>
        )}
      </div>

      {/* Search history */}
      {history.length > 0 && (
        <div className="flex items-center gap-3 mb-5 border border-yt-border rounded-full px-4 h-10 focus-within:border-yt-blue transition-colors">
          <Search className="w-4 h-4 text-yt-muted flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search watch history"
            className="flex-1 bg-transparent text-yt-text placeholder-yt-muted text-sm"
          />
        </div>
      )}

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Clock className="w-16 h-16 text-yt-muted mb-4 opacity-30" />
          <p className="text-yt-text font-medium mb-1">No watch history yet</p>
          <p className="text-yt-muted text-sm">Videos you watch will appear here.</p>
        </div>
      ) : (
        <div className="divide-y divide-yt-border">
          {filtered.map((v) => (
            <HistoryRow key={v.id + v.watchedAt} video={v} onRemove={handleRemove} />
          ))}
          {filtered.length === 0 && (
            <p className="text-yt-muted text-sm py-8 text-center">No results for "{search}"</p>
          )}
        </div>
      )}
    </div>
  )
}
