"use client"

import { useState, useEffect } from 'react'
import { Trees, AlertCircle, Loader2 } from 'lucide-react'
import { getPokemonHabitat, habitatNames } from '@/lib/services/habitatService'
import { PokemonHabitat } from '@/lib/types/pokemon'

interface LocationDataProps {
  pokemonName: string
}

export function LocationData({ pokemonName }: LocationDataProps) {
  const [habitat, setHabitat] = useState<PokemonHabitat | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHabitat = async () => {
      setLoading(true)
      const habitatData = await getPokemonHabitat(pokemonName)
      setHabitat(habitatData)
      setLoading(false)
    }
    
    fetchHabitat()
  }, [pokemonName])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
        <h3 className="font-semibold mb-3">Habitat</h3>

      {habitat ? (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center">
            <Trees className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium capitalize">{habitatNames[habitat.name] || habitat.name}</p>
            <p className="text-xs text-muted-foreground">
              Found in {habitatNames[habitat.name]?.toLowerCase() || habitat.name} areas
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">No habitat information available</p>
        </div>
      )}
    </div>
  )
}