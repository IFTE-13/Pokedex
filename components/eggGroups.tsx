"use client"

import { useState, useEffect } from 'react'
import { Egg, Loader2 } from 'lucide-react'
import { getBreedingData, EggGroup } from '@/lib/services/eggGroupService'

interface EggGroupsProps {
  pokemonName: string
}

interface BreedingData {
  eggGroups: EggGroup[]
  genderRate: string
  hatchSteps: number
  eggCycles: number
}

export function EggGroups({ pokemonName }: EggGroupsProps) {
  const [data, setData] = useState<BreedingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBreedingData(pokemonName).then(setData).finally(() => setLoading(false))
  }, [pokemonName])

  if (loading) return <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
  if (!data) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <Egg className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Breeding</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Egg Groups</p>
          <div className="flex gap-2 mt-1">
            {data.eggGroups.map((g: EggGroup) => (
              <span key={g.id} className="px-2 py-1 bg-muted rounded-md text-xs capitalize">{g.name}</span>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground">Gender Ratio</p>
          <p className="text-sm">{data.genderRate}</p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground">Hatch Steps</p>
          <p className="text-sm">{data.hatchSteps.toLocaleString()} steps ({data.eggCycles} cycles)</p>
        </div>
      </div>
    </div>
  )
}