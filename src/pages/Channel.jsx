import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Bell, CheckCircle } from 'lucide-react'
import { getChannelVideos, formatCount, channelColor } from '../services/youtube'
import VideoCard from '../components/VideoCard'

const TABS = ['Videos', 'Shorts', 'Live', 'Playlists', 'Community', 'About']

export default function Channel() {
  const { channelId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('Videos')
  const [subscribed, setSubscribed] = useState(false)
  const [nextPageToken, setNextPageToken] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    if (!channelId) return
    setLoading(true)
    setError(null)
    getChannelVideos(channelId)
      .then((d) => { setData(d); setNextPageToken(d.nextPageToken || '') })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [channelId])

  async function loadMore() {
    if (!nextPageToken || loadingMore) return
    setLoadingMore(true)
    try {
      const d = await getChannelVideos(channelId, { pageToken: nextPageToken })
      setData((prev) => ({ ...prev, items: [...(prev?.items || []), ...(d.items || [])] }))
      setNextPageToken(d.nextPageToken || '')
    } finally { setLoadingMore(false) }
  }

  if (loading) return (
    <div>
      <div className="h-32 bg-yt-surface animate-pulse" />
      <div className="px-4 md:px-6 pt-4">
        <div className="flex gap-4 items-center animate-pulse">
          <div className="w-24 h-24 rounded-full bg-yt-surface" />
          <div className="space-y-2">
            <div className="h-5 bg-yt-surface rounded w-40" />
            <div className="h-3 bg-yt-surface rounded w-24" />
          </div>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center py-32 text-center px-4">
      <div>
        <p className="text-yt-text font-medium mb-2">Couldn't load channel</p>
        <p className="text-yt-muted text-sm">{error}</p>
      </div>
    </div>
  )

  const chan = data?.channel
  const snippet = chan?.snippet
  const stats = chan?.statistics
  const avatarBg = channelColor(snippet?.title || '')
  const banner = snippet?.thumbnails?.maxres?.url || snippet?.thumbnails?.high?.url

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-28 md:h-40 bg-yt-surface overflow-hidden">
        {banner ? (
          <img src={banner} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${avatarBg}88, ${avatarBg}44)` }} />
        )}
      </div>

      {/* Channel info */}
      <div className="px-4 md:px-6 pt-4 pb-4 border-b border-yt-border">
        <div className="flex flex-wrap items-center gap-4">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 border-4 border-yt-bg -mt-10"
            style={{ backgroundColor: avatarBg }}
          >
            {snippet?.thumbnails?.default?.url ? (
              <img src={snippet.thumbnails.default.url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (snippet?.title || '?')[0].toUpperCase()}
          </div>

          {/* Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-yt-text text-xl font-bold">{snippet?.title}</h1>
              <CheckCircle className="w-4 h-4 text-yt-muted" />
            </div>
            <div className="flex items-center gap-2 text-yt-muted text-sm mt-0.5 flex-wrap">
              {snippet?.customUrl && <span>@{snippet.customUrl.replace('@', '')}</span>}
              {stats?.subscriberCount && <span>· {formatCount(stats.subscriberCount)} subscribers</span>}
              {stats?.videoCount && <span>· {formatCount(stats.videoCount)} videos</span>}
            </div>
            {snippet?.description && (
              <p className="text-yt-muted text-xs mt-1 line-clamp-1">{snippet.description}</p>
            )}
          </div>

          {/* Subscribe */}
          <button
            onClick={() => setSubscribed((s) => !s)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0
              ${subscribed ? 'bg-yt-surface text-yt-text hover:bg-yt-hover' : 'bg-yt-text text-yt-bg hover:opacity-90'}`}
          >
            {subscribed ? <><Bell className="w-4 h-4" /> Subscribed</> : 'Subscribe'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 overflow-x-auto hide-scrollbar">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0
                ${tab === t ? 'bg-yt-surface text-yt-text' : 'text-yt-muted hover:text-yt-text hover:bg-yt-surface'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Videos grid */}
      <div className="px-4 md:px-6 pt-6 pb-10">
        {tab === 'Videos' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {data?.items?.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
            {nextPageToken && (
              <div className="flex justify-center mt-10">
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
        {tab !== 'Videos' && (
          <div className="flex items-center justify-center py-24 text-center">
            <p className="text-yt-muted text-sm">This tab isn't available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
