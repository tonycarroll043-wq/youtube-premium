import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'Why do I need an API key?',
    a: 'This app uses the YouTube Data API v3 to fetch real videos, search results, and channel info. Google requires an API key to authenticate requests. The free tier gives you 10,000 quota units per day.',
  },
  {
    q: 'How do I get a YouTube Data API v3 key?',
    a: '1. Go to the Google Cloud Console and create a project.\n2. Enable the "YouTube Data API v3" from the API Library.\n3. Go to Credentials → Create Credentials → API key.\n4. Paste the key in Settings or the setup screen.',
  },
  {
    q: 'Why can\'t I see my subscriptions?',
    a: 'Subscriptions require OAuth 2.0 authentication with a real YouTube account. This build uses an API key only, so the Subscriptions tab shows trending content as a preview instead.',
  },
  {
    q: 'Why does the video still show ads?',
    a: 'The YouTube IFrame Player embeds videos directly from YouTube\'s servers. Whether an ad plays depends on your YouTube account status and the video\'s monetisation settings — we can\'t suppress server-side pre-roll ads. Use a browser extension (uBlock Origin) to block them.',
  },
  {
    q: 'Does download actually work?',
    a: 'The Download button is a UI element showing Premium is unlocked. Downloading YouTube videos is against YouTube\'s Terms of Service, so actual download functionality isn\'t implemented.',
  },
  {
    q: 'What is stored locally?',
    a: 'Watch history, Watch Later, Liked videos, and Playlists are all stored in your browser\'s localStorage. Nothing is sent to any server. Clear it anytime in Settings.',
  },
  {
    q: 'Why do some videos not appear for a category?',
    a: 'YouTube\'s `videoCategoryId` filter is sometimes inconsistently applied by the API. If a category returns few results, try a different region or browse via Search instead.',
  },
  {
    q: 'My API key works but some searches fail.',
    a: 'The `search.list` endpoint costs more quota than `videos.list`. Each search uses ~100 units. With 10,000 units/day free, you get ~100 searches. Once exhausted, requests fail until quota resets at midnight Pacific Time.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-yt-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-4 py-4 text-left hover:bg-yt-hover transition-colors"
      >
        <span className="text-yt-text text-sm font-medium pr-4">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-yt-muted flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-yt-muted flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-yt-muted text-sm leading-relaxed whitespace-pre-line">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function Help() {
  return (
    <div className="px-4 md:px-6 pt-4 pb-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-6 h-6 text-yt-muted" />
        <h1 className="text-yt-text text-2xl font-bold">Help & FAQ</h1>
      </div>

      <div className="bg-yt-surface rounded-xl border border-yt-border overflow-hidden mb-6">
        {FAQS.map((item) => <FaqItem key={item.q} {...item} />)}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="https://support.google.com/youtube"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-yt-border text-yt-text text-sm hover:bg-yt-surface transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          YouTube Help Center
        </a>
        <a
          href="https://developers.google.com/youtube/v3"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-yt-border text-yt-text text-sm hover:bg-yt-surface transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          YouTube Data API Docs
        </a>
      </div>
    </div>
  )
}
