import { useState } from 'react'
import { MessageSquare, CheckCircle, Send } from 'lucide-react'

const TYPES = ['Bug report', 'Feature request', 'General feedback', 'Other']

export default function Feedback() {
  const [type, setType] = useState('General feedback')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) return
    // Log to console (no server to send to)
    console.info('[Feedback]', { type, message })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="px-4 md:px-6 pt-4 pb-10 max-w-xl">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
          <h2 className="text-yt-text text-xl font-bold mb-2">Thanks for your feedback!</h2>
          <p className="text-yt-muted text-sm mb-6">Your response has been logged to the console. This is a local-only build.</p>
          <button
            onClick={() => { setSubmitted(false); setMessage('') }}
            className="px-5 py-2.5 rounded-full border border-yt-border text-yt-text text-sm hover:bg-yt-surface transition-colors"
          >
            Send more feedback
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 md:px-6 pt-4 pb-10 max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-yt-muted" />
        <h1 className="text-yt-text text-2xl font-bold">Send feedback</h1>
      </div>
      <p className="text-yt-muted text-sm mb-6">Help improve this build by sharing what's working and what isn't.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type */}
        <div>
          <label className="block text-yt-muted text-xs uppercase tracking-wider mb-2">Feedback type</label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors
                  ${type === t ? 'bg-yt-chip-active text-yt-bg font-medium' : 'bg-yt-chip text-yt-text hover:bg-yt-hover'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-yt-muted text-xs uppercase tracking-wider mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your feedback…"
            rows={6}
            className="w-full bg-yt-bg border border-yt-border rounded-xl px-4 py-3 text-yt-text text-sm placeholder-yt-muted resize-none focus:border-yt-blue transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className="flex items-center gap-2 px-6 py-2.5 bg-yt-blue text-yt-bg rounded-full text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          <Send className="w-4 h-4" />
          Submit feedback
        </button>
      </form>
    </div>
  )
}
