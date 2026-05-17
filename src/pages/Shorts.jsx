import { useState, useEffect, useRef } from 'react'
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Music2, ChevronUp, ChevronDown, Volume2, VolumeX } from 'lucide-react'
import { getShorts, formatCount, timeAgo, channelColor } from '../services/youtube'
import { Link } from 'react-router-dom'

function Short({ video, active }) {
  const { snippet, statistics, id } = video
  const avatarBg = channelColor(snippet?.channelTitle || '')

  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Video container – 9:16 portrait */}
      <div className="relative bg-black rounded-2xl overflow-hidden" style={{ height: '100%', aspectRatio: '9/16', maxHeight: '88vh' }}>
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&loop=1&playlist=${id}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={snippet?.title}
          />
        ) : (
          <img
            src={snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url}
            alt={snippet?.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <Link
              to={`/channel/${snippet?.channelId}`}
              className="flex items-center gap-2 pointer-events-auto"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                style={{ backgroundColor: avatarBg }}
              >
                {(snippet?.channelTitle || '?')[0].toUpperCase()}
              </div>
              <span className="text-white text-sm font-semibold">@{snippet?.channelTitle}</span>
            </Link>
            <button className="pointer-events-auto px-3 py-1 rounded-full border border-white text-white text-xs font-medium hover:bg-white/20 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-white text-sm leading-snug line-clamp-2">{snippet?.title}</p>
          <div className="flex items-center gap-1.5 mt-1.5 text-white/70 text-xs">
            <Music2 className="w-3 h-3" />
            <span className="truncate">{snippet?.channelTitle} · Original audio</span>
          </div>
        </div>
      </div>

      {/* Right-side action buttons */}
      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-5 md:right-[-56px]">
        <ActionBtn icon={ThumbsUp} label={formatCount(statistics?.likeCount)} />
        <ActionBtn icon={ThumbsDown} label="Dislike" hideLabel />
        <ActionBtn icon={MessageSquare} label={formatCount(statistics?.commentCount)} />
        <ActionBtn icon={Share2} label="Share" />
      </div>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, hideLabel }) {
  const [active, setActive] = useState(false)
  return (
    <button
      onClick={() => setActive((a) => !a)}
      className="flex flex-col items-center gap-1"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-yt-blue text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
        <Icon className="w-5 h-5" />
      </div>
      {!hideLabel && <span className="text-white text-xs">{label}</span>}
    </button>
  )
}

export default function Shorts() {
  const [shorts, setShorts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)
  const [nextPageToken, setNextPageToken] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    getShorts()
      .then((data) => {
        setShorts(data.items || [])
        setNextPageToken(data.nextPageToken || '')
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function goTo(idx) {
    if (idx < 0 || idx >= shorts.length) return
    setActiveIdx(idx)
    // Load more when near end
    if (idx >= shorts.length - 3 && nextPageToken) {
      getShorts({ pageToken: nextPageToken }).then((data) => {
        setShorts((s) => [...s, ...(data.items || [])])
        setNextPageToken(data.nextPageToken || '')
      }).catch(() => {})
    }
  }

  // Keyboard nav
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowUp') goTo(activeIdx - 1)
      if (e.key === 'ArrowDown') goTo(activeIdx + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIdx, shorts.length])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-8 h-8 border-2 border-yt-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-yt-bg py-4">
      <div className="flex gap-4 items-center">
        {/* Up */}
        <button
          onClick={() => goTo(activeIdx - 1)}
          disabled={activeIdx === 0}
          className="p-3 rounded-full bg-yt-surface hover:bg-yt-hover disabled:opacity-30 transition-colors text-yt-text"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        {/* Short player */}
        <div style={{ height: '88vh', aspectRatio: '9/16' }} className="relative">
          {shorts[activeIdx] && (
            <Short video={shorts[activeIdx]} active key={shorts[activeIdx].id} />
          )}
        </div>

        {/* Down */}
        <button
          onClick={() => goTo(activeIdx + 1)}
          disabled={activeIdx >= shorts.length - 1}
          className="p-3 rounded-full bg-yt-surface hover:bg-yt-hover disabled:opacity-30 transition-colors text-yt-text"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
