const CATEGORIES = [
  { id: '',  label: 'All' },
  { id: '10', label: 'Music' },
  { id: '20', label: 'Gaming' },
  { id: '24', label: 'Entertainment' },
  { id: '25', label: 'News' },
  { id: '17', label: 'Sports' },
  { id: '28', label: 'Science & Tech' },
  { id: '27', label: 'Education' },
  { id: '23', label: 'Comedy' },
  { id: '26', label: 'Howto & Style' },
  { id: '1',  label: 'Film & Animation' },
  { id: '2',  label: 'Autos' },
  { id: '15', label: 'Pets' },
]

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
      {CATEGORIES.map((cat) => {
        const active = selected === cat.id
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${active
                ? 'bg-yt-chip-active text-yt-bg'
                : 'bg-yt-chip text-yt-text hover:bg-yt-hover'
              }`}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
