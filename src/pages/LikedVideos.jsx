import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ThumbsUp, X, PlayCircle } from 'lucide-react'
import { getLiked, removeFromLiked } from '../services/storage'
import { getBestThumbnail, formatViews, formatDuration, timeAgo, channelColor } from '../services/youtube'
import VideoCard from '../components/VideoCard'

export default function LikedVideos() {
  const [list, setList] = useState(() => getLiked())

  function handleRemove(id) {
    removeFromLiked(id)
    setList(getLiked())
  }

  return (
    <div className="px-4 md:px-6 pt-4 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-yt-text text-2xl font-bold">Liked videos</h1>
          {list.length > 0 && <p className="text-yt-muted text-sm mt-1">{list.length} video{list.length !== 1 ? 's' : ''}</p>}
        </div>
        {list.length > 0 && (
          <Link
            to={`/watch?v=${list[0].id}`}
            className="flex items-center gap-2 px-4 py-2 bg-yt-text text-yt-bg rounded-full text-sm font-medium hover:opacity-90"
          >
            <PlayCircle className="w-4 h-4" />
            Play all
          </Link>
        )}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ThumbsUp className="w-16 h-16 text-yt-muted mb-4 opacity-30" />
          <p className="text-yt-text font-medium mb-1">No liked videos yet</p>
          <p className="text-yt-muted text-sm">Videos you like will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {list.map((v) => (
            <div key={v.id} className="relative group">
              <VideoCard video={v} />
              <button
                onClick={() => handleRemove(v.id)}
                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-black/70 text-white hover:bg-black/90 transition-all"
                title="Remove from liked"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
