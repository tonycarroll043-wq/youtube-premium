import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, X, PlayCircle } from 'lucide-react'
import { getWatchLater, removeFromWatchLater } from '../services/storage'
import { getBestThumbnail, formatViews, formatDuration, timeAgo, channelColor } from '../services/youtube'

function WatchLaterRow({ video, onRemove }) {
  const { snippet, contentDetails, statistics, id } = video
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
        <p className="text-yt-muted text-xs mt-0.5">{formatViews(statistics?.viewCount)} · {timeAgo(snippet.publishedAt)}</p>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-yt-surface text-yt-muted hover:text-yt-text transition-all flex-shrink-0 self-start mt-1"
        title="Remove"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function WatchLater() {
  const [list, setList] = useState(() => getWatchLater())

  function handleRemove(id) {
    removeFromWatchLater(id)
    setList(getWatchLater())
  }

  return (
    <div className="px-4 md:px-6 pt-4 pb-10 max-w-[900px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-yt-text text-2xl font-bold">Watch later</h1>
        {list.length > 0 && (
          <Link
            to={`/watch?v=${list[0].id}`}
            className="flex items-center gap-2 px-4 py-2 bg-yt-text text-yt-bg rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <PlayCircle className="w-4 h-4" />
            Play all
          </Link>
        )}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Clock className="w-16 h-16 text-yt-muted mb-4 opacity-30" />
          <p className="text-yt-text font-medium mb-1">No videos saved</p>
          <p className="text-yt-muted text-sm">Save videos to watch them later. Hit the Save button on any video.</p>
        </div>
      ) : (
        <>
          <p className="text-yt-muted text-sm mb-4">{list.length} video{list.length !== 1 ? 's' : ''}</p>
          <div className="divide-y divide-yt-border">
            {list.map((v) => <WatchLaterRow key={v.id} video={v} onRemove={handleRemove} />)}
          </div>
        </>
      )}
    </div>
  )
}
