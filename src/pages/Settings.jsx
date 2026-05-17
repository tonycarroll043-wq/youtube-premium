import { useState } from 'react'
import { Key, Trash2, ChevronRight, Moon, Globe, Bell, Shield, Info } from 'lucide-react'
import { getApiKey, saveApiKey, clearApiKey } from '../services/youtube'
import { clearHistory } from '../services/storage'

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-yt-muted text-xs font-semibold uppercase tracking-wider px-4 mb-1">{title}</h2>
      <div className="bg-yt-surface rounded-xl overflow-hidden border border-yt-border">
        {children}
      </div>
    </div>
  )
}

function Row({ icon: Icon, label, value, onClick, danger, toggle, toggled }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 w-full px-4 py-3.5 text-left hover:bg-yt-hover transition-colors border-b border-yt-border last:border-0
        ${danger ? 'hover:bg-red-900/20' : ''}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${danger ? 'text-red-400' : 'text-yt-muted'}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${danger ? 'text-red-400' : 'text-yt-text'}`}>{label}</p>
        {value && <p className="text-yt-muted text-xs mt-0.5 truncate">{value}</p>}
      </div>
      {toggle !== undefined ? (
        <div
          className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${toggled ? 'bg-yt-blue' : 'bg-yt-border'}`}
        >
          <div className={`w-4 h-4 rounded-full bg-white mt-1 transition-transform ${toggled ? 'translate-x-5' : 'translate-x-1'}`} />
        </div>
      ) : (
        <ChevronRight className="w-4 h-4 text-yt-muted flex-shrink-0" />
      )}
    </button>
  )
}

export default function Settings({ onApiKeyReset }) {
  const [apiKey, setApiKeyState] = useState(() => getApiKey())
  const [editingKey, setEditingKey] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [autoplay, setAutoplay] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [toast, setToast] = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500) }

  function handleSaveKey() {
    const trimmed = newKey.trim()
    if (trimmed) { saveApiKey(trimmed); setApiKeyState(trimmed); setEditingKey(false); showToast('API key updated') }
  }

  function handleResetKey() {
    clearApiKey()
    if (onApiKeyReset) onApiKeyReset()
  }

  function handleClearHistory() {
    clearHistory()
    showToast('Watch history cleared')
  }

  const maskedKey = apiKey ? `${apiKey.slice(0, 8)}${'•'.repeat(20)}` : 'Not set'

  return (
    <div className="px-4 md:px-6 pt-4 pb-10 max-w-2xl">
      <h1 className="text-yt-text text-2xl font-bold mb-6">Settings</h1>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#333] text-yt-text text-sm px-4 py-2.5 rounded-lg shadow-xl">
          {toast}
        </div>
      )}

      <Section title="API">
        <Row
          icon={Key}
          label="YouTube API Key"
          value={maskedKey}
          onClick={() => setEditingKey((e) => !e)}
        />
        {editingKey && (
          <div className="px-4 py-3 bg-yt-chip border-b border-yt-border">
            <input
              autoFocus
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveKey() }}
              placeholder="Paste new API key…"
              className="w-full bg-yt-bg border border-yt-border rounded-lg px-3 py-2 text-yt-text text-sm placeholder-yt-muted mb-2"
            />
            <div className="flex gap-2">
              <button onClick={handleSaveKey} className="px-4 py-1.5 bg-yt-blue text-yt-bg rounded-full text-xs font-medium">Save</button>
              <button onClick={() => setEditingKey(false)} className="px-4 py-1.5 bg-yt-surface border border-yt-border text-yt-text rounded-full text-xs">Cancel</button>
            </div>
          </div>
        )}
        <Row icon={Key} label="Reset API Key" onClick={handleResetKey} danger />
      </Section>

      <Section title="Playback">
        <Row icon={Moon} label="Autoplay next video" toggle toggled={autoplay} onClick={() => setAutoplay((a) => !a)} />
        <Row icon={Globe} label="Playback quality" value="Auto" onClick={() => {}} />
      </Section>

      <Section title="Notifications">
        <Row icon={Bell} label="Push notifications" toggle toggled={notifications} onClick={() => setNotifications((n) => !n)} />
      </Section>

      <Section title="Privacy">
        <Row icon={Trash2} label="Clear watch history" onClick={handleClearHistory} danger />
        <Row icon={Shield} label="Privacy policy" onClick={() => window.open('https://policies.google.com/privacy', '_blank')} />
      </Section>

      <Section title="About">
        <Row icon={Info} label="YouTube Premium Clone" value="Built with React + Vite + YouTube Data API v3" onClick={() => {}} />
      </Section>
    </div>
  )
}
