import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Edit2, Check, X, ListVideo, PlayCircle } from 'lucide-react'
import {
  getPlaylists, createPlaylist, deletePlaylist, renamePlaylist,
} from '../services/storage'
import { getBestThumbnail } from '../services/youtube'

function PlaylistCard({ playlist, onDelete, onRename }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(playlist.name)
  const thumb = playlist.videos[0] ? getBestThumbnail(playlist.videos[0].snippet?.thumbnails) : null

  function submitRename() {
    const trimmed = name.trim()
    if (trimmed && trimmed !== playlist.name) onRename(playlist.id, trimmed)
    setEditing(false)
  }

  return (
    <div className="group relative bg-yt-surface hover:bg-yt-hover rounded-xl overflow-hidden transition-colors">
      {/* Thumbnail stack */}
      <Link to={`/playlist/${playlist.id}`} className="block relative aspect-video bg-yt-chip">
        {thumb ? (
          <img src={thumb} alt={playlist.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ListVideo className="w-12 h-12 text-yt-muted opacity-40" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <PlayCircle className="w-12 h-12 text-white" />
        </div>
        {/* Video count badge */}
        <div className="absolute bottom-0 right-0 bg-black/80 text-white text-xs px-2 py-1 m-1 rounded">
          {playlist.videos.length} videos
        </div>
      </Link>

      <div className="p-3">
        {editing ? (
          <div className="flex gap-2 items-center">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitRename(); if (e.key === 'Escape') setEditing(false) }}
              className="flex-1 bg-yt-bg border border-yt-blue rounded px-2 py-1 text-yt-text text-sm"
            />
            <button onClick={submitRename} className="text-green-400 hover:text-green-300"><Check className="w-4 h-4" /></button>
            <button onClick={() => setEditing(false)} className="text-yt-muted hover:text-yt-text"><X className="w-4 h-4" /></button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-yt-text text-sm font-medium line-clamp-1">{playlist.name}</p>
              <p className="text-yt-muted text-xs mt-0.5">Playlist · Private</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-yt-hover text-yt-muted hover:text-yt-text"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => onDelete(playlist.id)} className="p-1 rounded hover:bg-yt-hover text-yt-muted hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Playlists() {
  const [playlists, setPlaylists] = useState(() => getPlaylists())
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  function handleCreate() {
    const trimmed = newName.trim()
    if (!trimmed) return
    createPlaylist(trimmed)
    setPlaylists(getPlaylists())
    setNewName('')
    setCreating(false)
  }

  function handleDelete(id) {
    deletePlaylist(id)
    setPlaylists(getPlaylists())
  }

  function handleRename(id, name) {
    renamePlaylist(id, name)
    setPlaylists(getPlaylists())
  }

  return (
    <div className="px-4 md:px-6 pt-4 pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-yt-text text-2xl font-bold">Playlists</h1>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-yt-border text-yt-text text-sm hover:bg-yt-surface transition-colors"
        >
          <Plus className="w-4 h-4" />
          New playlist
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="mb-6 bg-yt-surface border border-yt-border rounded-xl p-4 flex gap-3 items-center">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false) }}
            placeholder="Playlist name"
            className="flex-1 bg-yt-bg border border-yt-border rounded-lg px-3 py-2 text-yt-text text-sm placeholder-yt-muted"
          />
          <button onClick={handleCreate} className="px-4 py-2 bg-yt-blue text-yt-bg rounded-full text-sm font-medium hover:opacity-90">Create</button>
          <button onClick={() => setCreating(false)} className="text-yt-muted hover:text-yt-text"><X className="w-5 h-5" /></button>
        </div>
      )}

      {playlists.length === 0 && !creating ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ListVideo className="w-16 h-16 text-yt-muted mb-4 opacity-30" />
          <p className="text-yt-text font-medium mb-1">No playlists yet</p>
          <p className="text-yt-muted text-sm mb-4">Create a playlist to organise your videos.</p>
          <button
            onClick={() => setCreating(true)}
            className="px-5 py-2.5 bg-yt-text text-yt-bg rounded-full text-sm font-medium hover:opacity-90"
          >
            New playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl} onDelete={handleDelete} onRename={handleRename} />
          ))}
        </div>
      )}
    </div>
  )
}
