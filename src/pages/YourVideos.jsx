import { Video, Lock } from 'lucide-react'

export default function YourVideos() {
  return (
    <div className="px-4 md:px-6 pt-4 pb-10">
      <h1 className="text-yt-text text-2xl font-bold mb-6">Your videos</h1>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-yt-surface flex items-center justify-center mb-4">
          <Lock className="w-7 h-7 text-yt-muted" />
        </div>
        <p className="text-yt-text font-medium mb-1">Sign in to manage your videos</p>
        <p className="text-yt-muted text-sm max-w-sm">
          Uploading and managing your own videos requires YouTube account authentication, which isn't included in this build.
        </p>
        <a
          href="https://studio.youtube.com"
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full border border-yt-border text-yt-text text-sm hover:bg-yt-surface transition-colors"
        >
          <Video className="w-4 h-4" />
          Open YouTube Studio
        </a>
      </div>
    </div>
  )
}
