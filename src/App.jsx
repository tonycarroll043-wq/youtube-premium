import { useState } from 'react'
import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ApiKeySetup from './components/ApiKeySetup'
import Home from './pages/Home'
import Watch from './pages/Watch'
import Search from './pages/Search'
import Shorts from './pages/Shorts'
import Subscriptions from './pages/Subscriptions'
import History from './pages/History'
import WatchLater from './pages/WatchLater'
import LikedVideos from './pages/LikedVideos'
import Playlists from './pages/Playlists'
import YourVideos from './pages/YourVideos'
import TrendingPage from './pages/TrendingPage'
import Channel from './pages/Channel'
import Premium from './pages/Premium'
import Settings from './pages/Settings'
import Help from './pages/Help'
import Feedback from './pages/Feedback'
import { getApiKey } from './services/youtube'

function Layout({ children, sidebarOpen, onMenuClick, onApiKeyReset }) {
  return (
    <>
      <Header onMenuClick={onMenuClick} onApiKeyReset={onApiKeyReset} />
      <div className="flex pt-14">
        <Sidebar open={sidebarOpen} />
        <main
          className="flex-1 min-w-0 transition-all duration-200"
          style={{ marginLeft: sidebarOpen ? '240px' : '72px' }}
        >
          {children}
        </main>
      </div>
    </>
  )
}

export default function App() {
  const [apiKey, setApiKey] = useState(getApiKey())
  const [sidebarOpen, setSidebarOpen] = useState(true)

  if (!apiKey) {
    return <ApiKeySetup onSave={setApiKey} />
  }

  function handleApiKeyReset() { setApiKey('') }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-yt-bg text-yt-text">
        <Layout
          sidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen((o) => !o)}
          onApiKeyReset={handleApiKeyReset}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/history" element={<History />} />
            <Route path="/watch-later" element={<WatchLater />} />
            <Route path="/liked" element={<LikedVideos />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/your-videos" element={<YourVideos />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/channel/:channelId" element={<Channel />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/settings" element={<Settings onApiKeyReset={handleApiKeyReset} />} />
            <Route path="/help" element={<Help />} />
            <Route path="/feedback" element={<Feedback />} />
            {/* Category feeds */}
            <Route path="/feed/music" element={<Home defaultCategory="10" />} />
            <Route path="/feed/gaming" element={<Home defaultCategory="20" />} />
            <Route path="/feed/news" element={<Home defaultCategory="25" />} />
            <Route path="/feed/sports" element={<Home defaultCategory="17" />} />
            <Route path="/feed/learning" element={<Home defaultCategory="27" />} />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
  )
}
