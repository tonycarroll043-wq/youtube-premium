import { useState, useEffect } from 'react'
import { getHomeVideos } from '../services/youtube'
import VideoCard from '../components/VideoCard'
import { UserPlus } from 'lucide-react'

const TABS = ['All', 'Today', 'This week', 'Live']

export default function Subscriptions() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('All')

  useEffect(() => {
    getHomeVideos()
      .then((d) => setVideos(d.items || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="px-4 md:px-6 pt-4 pb-10">
      {/* Sign-in nudge */}
      <div className="mb-6 flex items-start gap-4 bg-yt-surface border border-yt-border rounded-xl p-4">
        <UserPlus className="w-5 h-5 text-yt-muted mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-yt-text text-sm font-medium">Sign in to see subscriptions from channels you follow</p>
          <p className="text-yt-muted text-xs mt-0.5">Showing trending videos as a preview. API-based auth not included in this build.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-5 overflow-x-auto hide-scrollbar pb-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${tab === t ? 'bg-yt-chip-active text-yt-bg' : 'bg-yt-chip text-yt-text hover:bg-yt-hover'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-yt-surface rounded-xl mb-3" />
              <div className="flex gap-3"><div className="w-9 h-9 rounded-full bg-yt-surface" /><div className="flex-1 space-y-2"><div className="h-3 bg-yt-surface rounded" /><div className="h-3 bg-yt-surface rounded w-3/4" /></div></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  )
}
