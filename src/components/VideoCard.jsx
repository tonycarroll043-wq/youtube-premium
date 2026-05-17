import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MoreVertical, Clock, ListPlus, Share2, Flag } from 'lucide-react'
import {
  formatViews, formatDuration, timeAgo, getBestThumbnail, channelColor,
} from '../services/youtube'

function ThreeDotMenu({ onClose }) {
  const items = [
    { icon: ListPlus, label: 'Save to Watch later' },
    { icon: ListPlus, label: 'Save to playlist' },
    { icon: Share2, label: 'Share' },
    { icon: Flag, label: 'Not interested' },
  ]
  return (
    <div
      className="absolute right-0 top-8 z-50 w-52 bg-[#282828] border border-yt-border rounded-xl shadow-xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {items.map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="flex items-center gap-4 w-full px-4 py-3 hover:bg-yt-hover text-yt-text text-sm text-left transition-colors"
          onClick={onClose}
        >
          <Icon className="w-4 h-4 text-yt-muted flex-shrink-0" />
          {label}
        </button>
      ))}
    </div>
  )
}

export default function VideoCard({ video, compact = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  if (!video?.snippet) return null

  const { snippet, contentDetails, statistics, id } = video
  const videoId = typeof id === 'string' ? id : id?.videoId || ''
  const thumb = getBestThumbnail(snippet.thumbnails)
  const duration = formatDuration(contentDetails?.duration)
  const views = formatViews(statistics?.viewCount)
  const ago = timeAgo(snippet.publishedAt)
  const avatarBg = channelColor(snippet.channelTitle)

  if (compact) {
    return (
      <Link
        to={`/watch?v=${videoId}`}
        className="flex gap-2 group hover:bg-yt-surface rounded-xl p-2 transition-colors"
      >
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-40 rounded-lg overflow-hidden bg-yt-surface">
          <img
            src={thumb}
            alt={snippet.title}
            className="w-full aspect-video object-cover"
            loading="lazy"
          />
          {duration && (
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded font-medium">
              {duration}
            </span>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-yt-text text-xs font-medium line-clamp-2 leading-snug">{snippet.title}</p>
          <p className="text-yt-muted text-[11px] mt-1">{snippet.channelTitle}</p>
          <p className="text-yt-muted text-[11px]">{views} · {ago}</p>
        </div>
      </Link>
    )
  }

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
    >
      {/* Thumbnail */}
      <Link to={`/watch?v=${videoId}`} className="block relative rounded-xl overflow-hidden bg-yt-surface">
        <div className="aspect-video">
          <img
            src={thumb}
            alt={snippet.title}
            className={`w-full h-full object-cover transition-transform duration-200 ${hovered ? 'scale-105' : 'scale-100'}`}
            loading="lazy"
          />
        </div>
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
            {duration}
          </span>
        )}
        {hovered && (
          <div className="absolute inset-0 bg-black/10" />
        )}
      </Link>

      {/* Meta */}
      <div className="flex gap-3 mt-3">
        {/* Channel avatar */}
        <Link
          to={`/channel/${snippet.channelId}`}
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5"
          style={{ backgroundColor: avatarBg }}
        >
          {(snippet.channelTitle || '?')[0].toUpperCase()}
        </Link>

        {/* Title + meta + menu */}
        <div className="flex-1 min-w-0 relative">
          <div className="flex gap-2 items-start">
            <Link to={`/watch?v=${videoId}`} className="flex-1 min-w-0">
              <h3 className="text-yt-text text-sm font-medium line-clamp-2 leading-snug group-hover:text-white transition-colors">
                {snippet.title}
              </h3>
            </Link>
            {/* Three-dot menu */}
            <div className="relative flex-shrink-0">
              <button
                className={`p-1 rounded-full hover:bg-yt-hover transition-colors -mt-0.5 ${hovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                onClick={(e) => { e.preventDefault(); setMenuOpen((o) => !o) }}
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4 text-yt-text" />
              </button>
              {menuOpen && <ThreeDotMenu onClose={() => setMenuOpen(false)} />}
            </div>
          </div>
          <Link to={`/channel/${snippet.channelId}`} className="text-yt-muted text-xs hover:text-yt-text transition-colors mt-1 block">
            {snippet.channelTitle}
          </Link>
          <p className="text-yt-muted text-xs mt-0.5">
            {views} · {ago}
          </p>
        </div>
      </div>
    </div>
  )
}
