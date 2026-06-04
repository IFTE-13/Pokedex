"use client"

import { useState, useEffect } from 'react'
import { Sword, Loader2 } from 'lucide-react'
import { getMoves, Move } from '@/lib/services/moveService'
import { typeColors } from '@/lib/constants/pokemon'

interface MoveListProps {
  pokemonName: string
}

export function MoveList({ pokemonName }: MoveListProps) {
  const [moves, setMoves] = useState<Move[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    getMoves(pokemonName).then(setMoves).finally(() => setLoading(false))
  }, [pokemonName])

  const filteredMoves = moves.filter(m => filter === 'all' || m.category === filter)
  const categories = ['all', 'physical', 'special', 'status']

  if (loading) return <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
  if (moves.length === 0) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <Sword className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Level Up Moves</h3>
      </div>
      
      <div className="flex gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs capitalize ${filter === cat ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredMoves.slice(0, 30).map((move, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <p className="font-medium capitalize text-sm">{move.name.replace(/-/g, ' ')}</p>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>Lv.{move.level}</span>
                <span className={`px-1 rounded ${typeColors[move.type] || 'bg-gray-500'} text-white`}>{move.type}</span>
                <span className="capitalize">{move.category}</span>
              </div>
            </div>
            <div className="text-right text-xs">
              <div>Power: {move.power || '—'}</div>
              <div>PP: {move.pp}</div>
              <div>Acc: {move.accuracy || '—'}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}