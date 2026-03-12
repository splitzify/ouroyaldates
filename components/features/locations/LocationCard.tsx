import type { Location } from '@/types'
import { PLATFORM_LABELS } from '@/types'
import { MapPin, Instagram, Music2, Star, Link as LinkIcon, ExternalLink, Trash2 } from 'lucide-react'

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  maps:      <MapPin      className="w-4 h-4 text-emerald-500" />,
  instagram: <Instagram   className="w-4 h-4 text-pink-500" />,
  tiktok:    <Music2      className="w-4 h-4 text-gray-900" />,
  yelp:      <Star        className="w-4 h-4 text-red-500" />,
  other:     <LinkIcon    className="w-4 h-4 text-gray-400" />,
}

const PLATFORM_BG: Record<string, string> = {
  maps:      'bg-emerald-50',
  instagram: 'bg-pink-50',
  tiktok:    'bg-gray-50',
  yelp:      'bg-red-50',
  other:     'bg-gray-50',
}

interface Props {
  location:    Location
  onDelete:    (id: string) => void
  isSelected?: boolean
}

export default function LocationCard({ location, onDelete, isSelected }: Props) {
  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-xl border transition-all duration-150
      ${isSelected
        ? 'border-rose-200 bg-rose-50/50 shadow-sm'
        : 'border-gray-100 bg-white hover:border-rose-100'
      }
    `}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${PLATFORM_BG[location.platform] ?? 'bg-gray-50'}`}>
        {PLATFORM_ICONS[location.platform] ?? PLATFORM_ICONS.other}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-900 truncate">{location.name}</span>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {PLATFORM_LABELS[location.platform as keyof typeof PLATFORM_LABELS]}
          </span>
        </div>
        {location.notes && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{location.notes}</p>
        )}
        <a
          href={location.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-0.5 mt-1 text-xs text-rose-500 hover:text-rose-700 hover:underline"
        >
          Open <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onDelete(location.id) }}
        className="text-gray-200 hover:text-red-400 transition-colors flex-shrink-0 p-1 -mr-1 rounded-lg hover:bg-red-50"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
