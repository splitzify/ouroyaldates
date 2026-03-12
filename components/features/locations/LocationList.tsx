'use client'

import { useState } from 'react'
import type { Location } from '@/types'
import LocationCard from './LocationCard'
import EditLocationDialog from './EditLocationDialog'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin } from 'lucide-react'

interface Props {
  locations: Location[]
  onDelete:  (id: string) => void
  onUpdate:  (id: string, data: { name: string; url: string; notes?: string }) => Promise<void>
}

export default function LocationList({ locations, onDelete, onUpdate }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [editingLoc, setEditingLoc]       = useState<Location | null>(null)

  if (locations.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center space-y-2">
        <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
          <MapPin className="w-5 h-5 text-rose-300" />
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          No spots added yet.<br />
          Paste any Google Maps, Instagram, TikTok, or Yelp link!
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {locations.map((loc, index) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -8 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              onHoverStart={() => setSelectedIndex(index)}
              onHoverEnd={() => setSelectedIndex(-1)}
            >
              <LocationCard
                location={loc}
                onDelete={onDelete}
                onEdit={setEditingLoc}
                isSelected={selectedIndex === index}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <EditLocationDialog
        open={editingLoc !== null}
        location={editingLoc}
        onClose={() => setEditingLoc(null)}
        onSave={onUpdate}
      />
    </>
  )
}
