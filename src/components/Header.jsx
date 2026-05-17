import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Mic, Bell, Plus, Menu, Settings, LogOut, Crown } from 'lucide-react'
import { clearApiKey } from '../services/youtube'

function YTPremiumLogo() {
  return (
    <Link to="/" className="flex items-center gap-1.5 select-none">
      <svg viewBox="0 0 28 20" className="w-8 h-[22px] flex-shrink-0">
        <rect width="28" height="20" rx="4" fill="#ff0000"/>
        <polygon points="11,5 22,10 11,15" fill="white"/>
      </svg>
      <span className="text-yt-text font-bold text-[1.1rem] tracking-tight leading-none">YouTube</span>
      <span className="text-yt-premium text-[0.6rem] font-bold tracking-[0.15em] uppercase self-end mb-[1px] leading-none">Premium</span>
    </Link>
  )
}

export default function Header({ onMenuClick, onApiKeyReset }) {
  const [query, setQuery] = useState('')
  const [accountOpen, setAccountOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const accountRef = useRef(null)

  // Sync search input with URL param
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q)
  }, [searchParams])

  // Close account dropdown on outside click
  useEffect(() => {
    function handle(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  function handleApiReset() {
    clearApiKey()
    setAccountOpen(false)
    onApiKeyReset()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-yt-bg">
      {/* Left */}
      <div className="flex items-center gap-4 w-[240px]">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-yt-surface transition-colors flex-shrink-0"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 text-yt-text" />
        </button>
        <YTPremiumLogo />
      </div>

      {/* Center – Search */}
      <form onSubmit={handleSearch} className="flex items-center flex-1 max-w-[640px] mx-4">
        <div className="flex flex-1 items-center border border-yt-border rounded-l-full bg-yt-bg px-4 h-10 focus-within:border-yt-blue transition-colors">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent text-yt-text placeholder-yt-muted text-sm"
          />
        </div>
        <button
          type="submit"
          className="h-10 px-5 bg-yt-surface border border-yt-border border-l-0 rounded-r-full hover:bg-yt-hover transition-colors flex items-center justify-center flex-shrink-0"
          aria-label="Search"
        >
          <Search className="w-[18px] h-[18px] text-yt-text" />
        </button>
        <button
          type="button"
          className="ml-2 w-10 h-10 rounded-full bg-yt-surface hover:bg-yt-hover transition-colors flex items-center justify-center flex-shrink-0"
          aria-label="Search with voice"
        >
          <Mic className="w-[18px] h-[18px] text-yt-text" />
        </button>
      </form>

      {/* Right */}
      <div className="flex items-center gap-1 w-[240px] justify-end">
        {/* Create */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yt-border hover:bg-yt-surface text-yt-text text-sm transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create</span>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-yt-surface transition-colors relative" aria-label="Notifications">
          <Bell className="w-5 h-5 text-yt-text" />
          <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-yt-red rounded-full border-2 border-yt-bg" />
        </button>

        {/* Account */}
        <div className="relative" ref={accountRef}>
          <button
            onClick={() => setAccountOpen((o) => !o)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold ml-1"
            aria-label="Account"
          >
            P
          </button>

          {accountOpen && (
            <div className="absolute right-0 top-10 w-56 bg-[#282828] border border-yt-border rounded-xl shadow-xl overflow-hidden z-50">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-yt-border">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  P
                </div>
                <div>
                  <p className="text-yt-text text-sm font-medium">Premium User</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Crown className="w-3 h-3 text-yt-premium" />
                    <span className="text-yt-premium text-xs font-semibold">YouTube Premium</span>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-yt-hover text-yt-text text-sm transition-colors"
                  onClick={() => setAccountOpen(false)}
                >
                  <Settings className="w-4 h-4 text-yt-muted" />
                  Settings
                </Link>
                <button
                  onClick={handleApiReset}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-yt-hover text-yt-text text-sm w-full text-left transition-colors"
                >
                  <LogOut className="w-4 h-4 text-yt-muted" />
                  Change API Key
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
