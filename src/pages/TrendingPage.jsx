import { useState, useEffect } from 'react'
import { getHomeVideos } from '../services/youtube'
import VideoCard from '../components/VideoCard'
import { Flame } from 'lucide-react'

const TABS = [
  { label: 'Trending', cat: '' },
  { label: 'Music', cat: '10' },
  { label: 'Gaming', cat: '20' },
  { label: 'Movies', cat: '1' },
  { label: 'News', cat: '25' },
]

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setVideos([])
    getHomeVideos({ categoryId: TABS[activeTab].cat })
      .then((d) => setVideos(d.items || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeTab])

  return (
    <div className="px-4 md:px-6 pt-4 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-yt-red flex items-center justify-center">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-yt-text text-2xl font-bold">Trending</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto hide-scrollbar border-b border-yt-border pb-0">
        {TABS.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActiveTab(i)}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex-shrink-0
              ${i === activeTab
                ? 'border-yt-text text-yt-text'
                : 'border-transparent text-yt-muted hover:text-yt-text'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 16 }).map((_, i) => (
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
