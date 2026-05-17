import { Link, useLocation } from 'react-router-dom'
import {
  Home, Flame, Music2, Gamepad2, Newspaper, Trophy,
  FlaskConical, Clock, ThumbsUp, PlaySquare, Library,
  History, ListVideo, Crown, Settings, HelpCircle,
  MessageSquare, ChevronRight, Video,
} from 'lucide-react'

const NAV_MAIN = [
  { icon: Home,      label: 'Home',          to: '/' },
  { icon: Video,     label: 'Shorts',         to: '/shorts' },
  { icon: PlaySquare,label: 'Subscriptions',  to: '/subscriptions' },
]

const NAV_YOU = [
  { icon: History,   label: 'History',        to: '/history' },
  { icon: ListVideo, label: 'Playlists',       to: '/playlists' },
  { icon: Video,     label: 'Your videos',     to: '/your-videos' },
  { icon: Clock,     label: 'Watch later',     to: '/watch-later' },
  { icon: ThumbsUp,  label: 'Liked videos',    to: '/liked' },
]

const NAV_EXPLORE = [
  { icon: Flame,     label: 'Trending',        to: '/trending',   cat: '' },
  { icon: Music2,    label: 'Music',            to: '/feed/music',  cat: '10' },
  { icon: Gamepad2,  label: 'Gaming',           to: '/feed/gaming', cat: '20' },
  { icon: Newspaper, label: 'News',             to: '/feed/news',   cat: '25' },
  { icon: Trophy,    label: 'Sports',           to: '/feed/sports', cat: '17' },
  { icon: FlaskConical,label: 'Learning',       to: '/feed/learning',cat:'27' },
]

const NAV_BOTTOM = [
  { icon: Crown,        label: 'YouTube Premium', to: '/premium', gold: true },
  { icon: Settings,     label: 'Settings',         to: '/settings' },
  { icon: HelpCircle,   label: 'Help',             to: '/help' },
  { icon: MessageSquare,label: 'Send feedback',    to: '/feedback' },
]

function NavItem({ icon: Icon, label, to, gold, mini }) {
  const location = useLocation()
  const active = location.pathname === to

  if (mini) {
    return (
      <Link
        to={to}
        title={label}
        className={`flex flex-col items-center justify-center gap-1 py-4 px-1 rounded-xl transition-colors w-full
          ${active ? 'bg-yt-hover font-medium' : 'hover:bg-yt-surface'}`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${gold ? 'text-yt-premium' : active ? 'text-yt-text' : 'text-yt-text'}`} />
        <span className={`text-[10px] text-center leading-tight ${gold ? 'text-yt-premium' : 'text-yt-text'}`}>
          {label.split(' ')[0]}
        </span>
      </Link>
    )
  }

  return (
    <Link
      to={to}
      className={`flex items-center gap-6 px-3 py-2.5 rounded-xl transition-colors w-full text-sm
        ${active ? 'bg-yt-hover font-medium' : 'hover:bg-yt-surface'}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${gold ? 'text-yt-premium' : 'text-yt-text'}`} />
      <span className={gold ? 'text-yt-premium' : 'text-yt-text'}>{label}</span>
    </Link>
  )
}

function Section({ label, children, mini }) {
  if (mini) return children
  return (
    <div className="py-2 border-t border-yt-border">
      {label && <p className="text-yt-text font-medium text-sm px-3 pt-2 pb-1">{label}</p>}
      {children}
    </div>
  )
}

export default function Sidebar({ open }) {
  const mini = !open

  return (
    <aside
      className={`fixed top-14 left-0 bottom-0 z-40 bg-yt-bg overflow-y-auto overflow-x-hidden sidebar-transition hide-scrollbar
        ${mini ? 'w-[72px]' : 'w-60'}`}
    >
      <div className={`py-2 ${mini ? 'px-1' : 'px-2'}`}>
        {/* Main nav */}
        <div className={mini ? '' : 'pb-2 border-b border-yt-border'}>
          {NAV_MAIN.map((item) => (
            <NavItem key={item.to} {...item} mini={mini} />
          ))}
        </div>

        {!mini && (
          <>
            {/* You section */}
            <Section label="You">
              {NAV_YOU.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
              <button className="flex items-center gap-6 px-3 py-2.5 rounded-xl hover:bg-yt-surface w-full text-sm text-yt-text transition-colors">
                <ChevronRight className="w-5 h-5" />
                Show more
              </button>
            </Section>

            {/* Explore section */}
            <Section label="Explore">
              {NAV_EXPLORE.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </Section>

            {/* More from YouTube */}
            <Section label="More from YouTube">
              {NAV_BOTTOM.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </Section>
          </>
        )}

        {mini && (
          <>
            <div className="py-1 border-t border-yt-border mt-1">
              {NAV_EXPLORE.slice(0, 4).map((item) => (
                <NavItem key={item.to} {...item} mini />
              ))}
            </div>
            <div className="py-1 border-t border-yt-border mt-1">
              <NavItem {...NAV_BOTTOM[0]} mini />
              <NavItem {...NAV_BOTTOM[1]} mini />
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
