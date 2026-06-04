"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { getShinySprites } from '@/lib/services/shinyService'

interface ShinyToggleProps {
  pokemonName: string
}

export function ShinyToggle({ pokemonName }: ShinyToggleProps) {
  const [isShiny, setIsShiny] = useState(false)
  const [sprites, setSprites] = useState({ normal: '', shiny: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getShinySprites(pokemonName).then(data => {
      setSprites(data)
      setLoading(false)
    })
  }, [pokemonName])

  if (loading) return null
  if (!sprites.shiny) return null

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-48 h-48">
        <Image
          src={isShiny ? sprites.shiny : sprites.normal}
          alt={pokemonName}
          fill
          className="object-contain"
        />
      </div>
      <button
        onClick={() => setIsShiny(!isShiny)}
        className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-yellow-500 to-yellow-600 rounded-lg text-white text-sm font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all"
      >
        <Sparkles className="h-4 w-4" />
        {isShiny ? 'Show Normal' : 'Show Shiny'} (1/4096 chance)
      </button>
    </div>
  )
}