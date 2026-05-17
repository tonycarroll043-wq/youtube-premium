import { Crown, Download, Music2, Zap, ShieldOff, PlayCircle, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: ShieldOff, title: 'Ad-free videos', desc: 'Enjoy YouTube without any ads on all your devices.' },
  { icon: Download, title: 'Downloads', desc: 'Download videos and playlists to watch offline anywhere.' },
  { icon: PlayCircle, title: 'Background play', desc: 'Listen to videos while using other apps or with your screen locked.' },
  { icon: Music2, title: 'YouTube Music Premium', desc: 'Included — stream millions of songs and music videos ad-free.' },
  { icon: Zap, title: 'Premium early access', desc: 'Be among the first to try new YouTube features.' },
  { icon: Smartphone, title: 'All your devices', desc: 'Works on mobile, tablet, desktop, TV, and game consoles.' },
]

export default function Premium() {
  return (
    <div className="px-4 md:px-6 pt-6 pb-16 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center py-12 mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <svg viewBox="0 0 28 20" className="w-12 h-8">
            <rect width="28" height="20" rx="4" fill="#ff0000"/>
            <polygon points="11,5 22,10 11,15" fill="white"/>
          </svg>
          <span className="text-yt-text font-bold text-3xl">YouTube</span>
          <Crown className="w-6 h-6 text-yt-premium" />
          <span className="text-yt-premium text-2xl font-bold">Premium</span>
        </div>
        <p className="text-yt-muted text-lg mb-2">Already included — no paywall here.</p>
        <p className="text-yt-text text-sm max-w-md mx-auto">
          All Premium features are unlocked in this build. Enjoy YouTube the way it was meant to be.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-yt-premium text-yt-bg font-bold text-sm">
          <Crown className="w-4 h-4" />
          Premium Active
        </div>
      </div>

      {/* Features grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-yt-surface rounded-2xl p-5 border border-yt-border">
            <div className="w-10 h-10 rounded-xl bg-yt-premium/10 flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-yt-premium" />
            </div>
            <h3 className="text-yt-text font-semibold mb-1.5">{title}</h3>
            <p className="text-yt-muted text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-yt-surface to-yt-chip rounded-2xl p-8 border border-yt-border text-center">
        <Crown className="w-10 h-10 text-yt-premium mx-auto mb-3" />
        <h2 className="text-yt-text text-xl font-bold mb-2">You're all set</h2>
        <p className="text-yt-muted text-sm mb-6">Start watching ad-free. Download, Background play — everything is on.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-yt-red text-white rounded-full font-medium hover:bg-red-700 transition-colors"
        >
          Start watching
        </Link>
      </div>
    </div>
  )
}
