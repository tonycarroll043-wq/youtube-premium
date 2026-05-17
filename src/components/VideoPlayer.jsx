import { useState } from 'react'
import { Download, PictureInPicture2, Maximize2 } from 'lucide-react'

export default function VideoPlayer({ videoId }) {
  const [theater, setTheater] = useState(false)

  return (
    <div className={`relative bg-black ${theater ? 'w-screen -mx-6 rounded-none' : 'rounded-xl overflow-hidden'}`}>
      {/* 16:9 IFrame */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          key={videoId}
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Premium overlay controls (top-right) */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
        <button
          onClick={() => setTheater((t) => !t)}
          className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white transition-colors"
          title={theater ? 'Default view' : 'Theater mode'}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white transition-colors"
          title="Miniplayer"
        >
          <PictureInPicture2 className="w-4 h-4" />
        </button>
        <button
          className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white transition-colors"
          title="Download (Premium)"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
