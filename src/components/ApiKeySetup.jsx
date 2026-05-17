import { useState } from 'react'
import { saveApiKey } from '../services/youtube'

export default function ApiKeySetup({ onSave }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = key.trim()
    if (!trimmed) { setError('Please enter your API key'); return }
    setLoading(true)
    setError('')
    // Quick validation: try fetching a single video
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=1&key=${trimmed}`
      )
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      saveApiKey(trimmed)
      onSave(trimmed)
    } catch (err) {
      setError(err.message || 'Invalid API key')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-yt-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <svg viewBox="0 0 28 20" className="w-10 h-7">
            <rect width="28" height="20" rx="4" fill="#ff0000"/>
            <polygon points="11,5 22,10 11,15" fill="white"/>
          </svg>
          <span className="text-yt-text font-bold text-2xl tracking-tight">YouTube</span>
          <span className="text-yt-premium text-sm font-semibold tracking-widest self-end mb-0.5">PREMIUM</span>
        </div>

        <div className="bg-yt-surface rounded-2xl p-8 border border-yt-border">
          <h1 className="text-yt-text text-xl font-medium mb-2">Connect YouTube API</h1>
          <p className="text-yt-muted text-sm mb-6 leading-relaxed">
            A YouTube Data API v3 key is required to fetch videos.
            Get one free at{' '}
            <a
              href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
              target="_blank"
              rel="noreferrer"
              className="text-yt-blue hover:underline"
            >
              Google Cloud Console
            </a>
            .
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-yt-muted text-xs mb-2 uppercase tracking-wider">API Key</label>
              <input
                type="text"
                value={key}
                onChange={(e) => { setKey(e.target.value); setError('') }}
                placeholder="AIza..."
                className="w-full bg-yt-bg border border-yt-border rounded-lg px-4 py-3 text-yt-text text-sm placeholder-yt-muted focus:border-yt-blue transition-colors"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yt-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Validating…' : 'Get Started'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-yt-border">
            <p className="text-yt-muted text-xs leading-relaxed">
              <strong className="text-yt-text">Steps:</strong> Create a project → Enable YouTube Data API v3 → Create credentials (API key) → Paste above. The free tier includes 10,000 units/day.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
