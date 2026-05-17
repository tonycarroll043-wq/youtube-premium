import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  ThumbsUp, ThumbsDown, Share2, Download, BookmarkPlus,
  MoreHorizontal, Bell, CheckCircle, ChevronDown, ChevronUp, Check,
} from 'lucide-react'
import VideoPlayer from '../components/VideoPlayer'
import VideoCard from '../components/VideoCard'
import {
  getVideo, getRelatedVideos, getChannel, getComments,
  formatViews, formatCount, formatDuration, timeAgo, channelColor,
} from '../services/youtube'
import {
  addToHistory, addToLiked, removeFromLiked, isLiked,
  addToWatchLater, removeFromWatchLater, isInWatchLater,
} from '../services/storage'

function CommentItem({ comment }) {
  const top = comment.snippet?.topLevelComment?.snippet
  if (!top) return null
  const bg = channelColor(top.authorDisplayName)
  return (
    <div className="flex gap-3">
      <div
        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold mt-0.5"
        style={{ backgroundColor: bg }}
      >
        {(top.authorDisplayName || '?')[0].toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-yt-text text-xs font-medium">{top.authorDisplayName}</span>
          <span className="text-yt-muted text-xs">{timeAgo(top.publishedAt)}</span>
        </div>
        <p className="text-yt-text text-sm leading-relaxed whitespace-pre-wrap">{top.textDisplay}</p>
        <div className="flex items-center gap-4 mt-2">
          <button className="flex items-center gap-1.5 text-yt-muted hover:text-yt-text text-xs transition-colors">
            <ThumbsUp className="w-3.5 h-3.5" />
            {formatCount(top.likeCount)}
          </button>
          <button className="flex items-center gap-1.5 text-yt-muted hover:text-yt-text text-xs transition-colors">
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
          <button className="text-yt-muted hover:text-yt-text text-xs transition-colors font-medium">Reply</button>
        </div>
      </div>
    </div>
  )
}

export default function Watch() {
  const [searchParams] = useSearchParams()
  const videoId = searchParams.get('v') || ''

  const [video, setVideo] = useState(null)
  const [channel, setChannel] = useState(null)
  const [related, setRelated] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [descExpanded, setDescExpanded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    if (!videoId) return
    setLoading(true)
    setError(null)
    setDescExpanded(false)
    setLiked(isLiked(videoId))
    setSaved(isInWatchLater(videoId))
    setDisliked(false)

    getVideo(videoId)
      .then(async (data) => {
        const v = data.items?.[0]
        if (!v) throw new Error('Video not found')
        setVideo(v)
        addToHistory(v)

        // Fetch related + channel + comments in parallel
        const [relData, chanData, commData] = await Promise.allSettled([
          getRelatedVideos(videoId, v.snippet.title),
          getChannel(v.snippet.channelId),
          getComments(videoId),
        ])

        if (relData.status === 'fulfilled') setRelated(relData.value.items || [])
        if (chanData.status === 'fulfilled') setChannel(chanData.value.items?.[0] || null)
        if (commData.status === 'fulfilled') setComments(commData.value.items || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [videoId])

  if (!videoId) {
    return <div className="flex items-center justify-center py-32 text-yt-muted">No video selected</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <p className="text-yt-text text-lg font-medium mb-2">Couldn't load video</p>
        <p className="text-yt-muted text-sm">{error}</p>
      </div>
    )
  }

  const snippet = video?.snippet
  const stats = video?.statistics
  const channelBg = channelColor(snippet?.channelTitle || '')
  const channelSnippet = channel?.snippet
  const subs = formatCount(channel?.statistics?.subscriberCount)
  const likes = formatCount(stats?.likeCount)

  return (
    <div className="flex gap-6 px-4 md:px-6 pt-4 pb-10 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#333] text-yt-text text-sm px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 pointer-events-none">
          <Check className="w-4 h-4 text-green-400" />
          {toast}
        </div>
      )}
      {/* Main column */}
      <div className="flex-1 min-w-0 max-w-[860px]">
        {/* Player */}
        <div className="rounded-xl overflow-hidden">
          <VideoPlayer videoId={videoId} />
        </div>

        {loading ? (
          <div className="mt-4 space-y-3 animate-pulse">
            <div className="h-6 bg-yt-surface rounded w-3/4" />
            <div className="h-4 bg-yt-surface rounded w-1/3" />
          </div>
        ) : (
          <>
            {/* Title */}
            <h1 className="text-yt-text text-lg font-semibold mt-3 leading-snug">{snippet?.title}</h1>

            {/* Actions row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
              {/* Channel */}
              <div className="flex items-center gap-3">
                <Link to={`/channel/${snippet?.channelId}`}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: channelBg }}
                  >
                    {channelSnippet?.thumbnails?.default?.url ? (
                      <img src={channelSnippet.thumbnails.default.url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      (snippet?.channelTitle || '?')[0].toUpperCase()
                    )}
                  </div>
                </Link>
                <div>
                  <Link to={`/channel/${snippet?.channelId}`} className="flex items-center gap-1 text-yt-text text-sm font-medium hover:text-white">
                    {snippet?.channelTitle}
                    <CheckCircle className="w-3.5 h-3.5 text-yt-muted" />
                  </Link>
                  {subs && <p className="text-yt-muted text-xs">{subs} subscribers</p>}
                </div>
                <button
                  onClick={() => setSubscribed((s) => !s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ml-2
                    ${subscribed
                      ? 'bg-yt-surface text-yt-text hover:bg-yt-hover'
                      : 'bg-yt-text text-yt-bg hover:opacity-90'
                    }`}
                >
                  {subscribed ? (
                    <span className="flex items-center gap-1.5"><Bell className="w-4 h-4" /> Subscribed</span>
                  ) : 'Subscribe'}
                </button>
              </div>

              {/* Like/Dislike/Share/etc */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Like/Dislike pill */}
                <div className="flex items-center rounded-full bg-yt-surface overflow-hidden">
                  <button
                    onClick={() => {
                      const next = !liked
                      setLiked(next); setDisliked(false)
                      if (next) { addToLiked(video); showToast('Added to Liked videos') }
                      else { removeFromLiked(videoId); showToast('Removed from Liked videos') }
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm transition-colors
                      ${liked ? 'text-yt-blue' : 'text-yt-text hover:bg-yt-hover'}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {liked ? formatCount((parseInt(stats?.likeCount || 0) + 1).toString()) : likes}
                  </button>
                  <div className="w-px h-5 bg-yt-border" />
                  <button
                    onClick={() => { setDisliked((d) => !d); setLiked(false) }}
                    className={`flex items-center px-3 py-2 text-sm transition-colors
                      ${disliked ? 'text-yt-blue' : 'text-yt-text hover:bg-yt-hover'}`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>

                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-yt-surface text-yt-text text-sm hover:bg-yt-hover transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-yt-surface text-yt-text text-sm hover:bg-yt-hover transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => {
                    const next = !saved
                    setSaved(next)
                    if (next) { addToWatchLater(video); showToast('Saved to Watch later') }
                    else { removeFromWatchLater(videoId); showToast('Removed from Watch later') }
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-colors
                    ${saved ? 'bg-yt-chip-active text-yt-bg' : 'bg-yt-surface text-yt-text hover:bg-yt-hover'}`}
                >
                  {saved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                  {saved ? 'Saved' : 'Save'}
                </button>
                <button className="p-2 rounded-full bg-yt-surface text-yt-text hover:bg-yt-hover transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div
              className={`mt-4 bg-yt-surface rounded-xl p-3 cursor-pointer ${!descExpanded ? 'hover:bg-yt-hover' : ''} transition-colors`}
              onClick={() => setDescExpanded((e) => !e)}
            >
              <div className="flex items-center gap-2 text-yt-text text-sm font-medium mb-1">
                <span>{formatViews(stats?.viewCount)}</span>
                <span>·</span>
                <span>{timeAgo(snippet?.publishedAt)}</span>
              </div>
              <p className={`text-yt-text text-sm leading-relaxed whitespace-pre-wrap ${!descExpanded ? 'line-clamp-3' : ''}`}>
                {snippet?.description}
              </p>
              <button className="flex items-center gap-1 text-yt-text text-sm font-medium mt-2">
                {descExpanded ? <><ChevronUp className="w-4 h-4" /> Show less</> : <><ChevronDown className="w-4 h-4" /> Show more</>}
              </button>
            </div>

            {/* Comments */}
            <div className="mt-6">
              <h2 className="text-yt-text font-medium text-base mb-4">
                {formatCount(stats?.commentCount)} Comments
              </h2>
              <div className="space-y-6">
                {comments.map((c, i) => (
                  <CommentItem key={c.id || i} comment={c} />
                ))}
                {comments.length === 0 && (
                  <p className="text-yt-muted text-sm">Comments are disabled for this video.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Related videos sidebar */}
      <aside className="hidden lg:block w-[400px] flex-shrink-0">
        <div className="space-y-2">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-2 animate-pulse p-2">
                  <div className="w-40 h-24 bg-yt-surface rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-yt-surface rounded w-full" />
                    <div className="h-3 bg-yt-surface rounded w-3/4" />
                    <div className="h-3 bg-yt-surface rounded w-1/2" />
                  </div>
                </div>
              ))
            : related.map((v) => (
                <VideoCard key={v.id} video={v} compact />
              ))
          }
        </div>
      </aside>
    </div>
  )
}
