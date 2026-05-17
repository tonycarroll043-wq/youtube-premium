import { useState, useEffect, useCallback } from 'react'
import { getHomeVideos } from '../services/youtube'
import VideoCard from '../components/VideoCard'
import CategoryFilter from '../components/CategoryFilter'

export default function Home({ defaultCategory = '' }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState(defaultCategory)
  const [nextPageToken, setNextPageToken] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)

  const loadVideos = useCallback(async (cat, reset = true) => {
    if (reset) { setLoading(true); setError(null); setVideos([]) }
    try {
      const data = await getHomeVideos({ categoryId: cat })
      setVideos(data.items || [])
      setNextPageToken(data.nextPageToken || '')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadVideos(category) }, [category, loadVideos])

  async function loadMore() {
    if (!nextPageToken || loadingMore) return
    setLoadingMore(true)
    try {
      const data = await getHomeVideos({ categoryId: category, pageToken: nextPageToken })
      setVideos((v) => [...v, ...(data.items || [])])
      setNextPageToken(data.nextPageToken || '')
    } catch (_) { /* silently ignore */ }
    finally { setLoadingMore(false) }
  }

  return (
    <div className="px-4 md:px-6 pt-4 pb-10">
      {/* Category Filter */}
      <div className="mb-5 sticky top-14 bg-yt-bg pt-2 pb-3 z-30">
        <CategoryFilter selected={category} onChange={(c) => { setCategory(c) }} />
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-yt-text text-lg font-medium mb-2">Something went wrong</p>
          <p className="text-yt-muted text-sm mb-6 max-w-md">{error}</p>
          <button
            onClick={() => loadVideos(category)}
            className="px-5 py-2.5 bg-yt-blue text-yt-bg rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      )}

      {/* Skeleton */}
      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-yt-surface rounded-xl mb-3" />
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-yt-surface flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-yt-surface rounded w-full" />
                  <div className="h-3 bg-yt-surface rounded w-3/4" />
                  <div className="h-3 bg-yt-surface rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {/* Load more */}
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
    </div>
  )
}
