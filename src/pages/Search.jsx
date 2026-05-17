import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { searchVideos, formatViews, formatDuration, timeAgo, getBestThumbnail, channelColor } from '../services/youtube'
import { SlidersHorizontal, CheckCircle } from 'lucide-react'

const FILTERS = ['All', 'Videos', 'Channels', 'Playlists', 'This week', 'This month']

function SearchResultRow({ video }) {
  const { snippet, contentDetails, statistics, id } = video
  if (!snippet) return null
  const videoId = typeof id === 'string' ? id : id?.videoId || ''
  const thumb = getBestThumbnail(snippet.thumbnails)
  const duration = formatDuration(contentDetails?.duration)
  const views = formatViews(statistics?.viewCount)
  const ago = timeAgo(snippet.publishedAt)
  const avatarBg = channelColor(snippet.channelTitle)
  const desc = snippet.description?.slice(0, 120)

  return (
    <div className="flex gap-4 group">
      {/* Thumbnail */}
      <Link to={`/watch?v=${videoId}`} className="relative flex-shrink-0 w-64 rounded-xl overflow-hidden bg-yt-surface">
        <div className="aspect-video">
          <img src={thumb} alt={snippet.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
            {duration}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 pt-1">
        <Link to={`/watch?v=${videoId}`}>
          <h3 className="text-yt-text text-base font-normal line-clamp-2 leading-snug hover:text-white">
            {snippet.title}
          </h3>
        </Link>
        <p className="text-yt-muted text-xs mt-1.5">{views} · {ago}</p>
        <div className="flex items-center gap-1.5 mt-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
            style={{ backgroundColor: avatarBg }}
          >
            {(snippet.channelTitle || '?')[0].toUpperCase()}
          </div>
          <Link to={`/channel/${snippet.channelId}`} className="text-yt-muted text-xs hover:text-yt-text flex items-center gap-1">
            {snippet.channelTitle}
            <CheckCircle className="w-3 h-3" />
          </Link>
        </div>
        {desc && <p className="text-yt-muted text-xs mt-3 line-clamp-2 leading-relaxed">{desc}</p>}
      </div>
    </div>
  )
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('All')
  const [nextPageToken, setNextPageToken] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    if (!query) return
    setFilter('All')
    setVideos([])
    setNextPageToken('')
    setLoading(true)
    setError(null)
    searchVideos(query)
      .then((data) => {
        setVideos(data.items || [])
        setNextPageToken(data.nextPageToken || '')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [query])

  async function loadMore() {
    if (!nextPageToken || loadingMore) return
    setLoadingMore(true)
    try {
      const data = await searchVideos(query, { pageToken: nextPageToken })
      setVideos((v) => [...v, ...(data.items || [])])
      setNextPageToken(data.nextPageToken || '')
    } finally {
      setLoadingMore(false)
    }
  }

  if (!query) {
    return (
      <div className="flex items-center justify-center py-32 text-yt-muted">
        Enter a search query above
      </div>
    )
  }

  return (
    <div className="px-4 md:px-6 pt-4 pb-10 max-w-[900px]">
      {/* Filter chips */}
      <div className="flex items-center gap-3 mb-5 overflow-x-auto hide-scrollbar pb-1">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yt-chip text-yt-text text-sm flex-shrink-0 hover:bg-yt-hover transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${filter === f ? 'bg-yt-chip-active text-yt-bg' : 'bg-yt-chip text-yt-text hover:bg-yt-hover'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="py-10 text-center">
          <p className="text-yt-text font-medium mb-2">Search failed</p>
          <p className="text-yt-muted text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-64 h-36 bg-yt-surface rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2 pt-2">
                <div className="h-4 bg-yt-surface rounded w-3/4" />
                <div className="h-4 bg-yt-surface rounded w-1/2" />
                <div className="h-3 bg-yt-surface rounded w-1/4 mt-4" />
                <div className="h-3 bg-yt-surface rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="space-y-5">
            {videos.map((video) => (
              <SearchResultRow key={video.id} video={video} />
            ))}
          </div>
          {nextPageToken && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-8 py-2.5 border border-yt-border rounded-full text-yt-text text-sm hover:bg-yt-surface transition-colors disabled:opacity-50"
              >
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
