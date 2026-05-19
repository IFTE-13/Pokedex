"use client"

import { useComparison } from '@/context/comparisonContext'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Link from 'next/link'
import { typeColors } from '@/lib/constants/pokemon'

export default function ComparePage() {
  const { comparisonList, removeFromComparison, clearComparison, maxCompare } = useComparison()

  const allStatNames = comparisonList.length > 0 
    ? comparisonList[0].stats.map(s => s.name)
    : []

  const getMaxStat = (statName: string) => {
    return Math.max(...comparisonList.map(p => 
      p.stats.find(s => s.name === statName)?.value || 0
    ))
  }

  if (comparisonList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">No Pokemon to Compare</h1>
        <p className="text-muted-foreground mb-6">
          Add Pokemon to comparison by clicking the compare button on any Pokemon card.
          You can compare up to {maxCompare} Pokemon at once.
        </p>
        <Link href="/">
          <Button>Browse Pokemon</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Compare Pokemon</h1>
          <p className="text-muted-foreground">
            Comparing {comparisonList.length} of {maxCompare} Pokemon
          </p>
        </div>
        <Button variant="destructive" onClick={clearComparison}>
          Clear All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 bg-muted/50 border border-border min-w-37.5"></th>
              {comparisonList.map((pokemon) => (
                <th key={pokemon.id} className="p-3 bg-muted/50 border border-border min-w-50">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={() => removeFromComparison(pokemon.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="relative w-24 h-24 mx-auto mb-2">
                      <Image
                        src={pokemon.image}
                        alt={pokemon.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Link href={`/pokemon/${pokemon.name}`}>
                      <h3 className="font-bold text-lg capitalize hover:text-primary transition-colors">
                        {pokemon.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">#{String(pokemon.id).padStart(3, '0')}</p>
                    <div className="flex gap-1 justify-center mt-2">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className={`text-xs px-2 py-0.5 rounded-full text-white capitalize ${typeColors[type] || 'bg-gray-500'}`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-muted/20">
              <td className="p-3 border border-border font-semibold">Height</td>
              {comparisonList.map((pokemon) => (
                <td key={pokemon.id} className="p-3 border border-border text-center">
                  {pokemon.height / 10} m
                </td>
              ))}
            </tr>
            <tr className="bg-muted/20">
              <td className="p-3 border border-border font-semibold">Weight</td>
              {comparisonList.map((pokemon) => (
                <td key={pokemon.id} className="p-3 border border-border text-center">
                  {pokemon.weight / 10} kg
                </td>
              ))}
            </tr>
            {allStatNames.map((statName) => {
              const maxStat = getMaxStat(statName)
              return (
                <tr key={statName}>
                  <td className="p-3 border border-border font-semibold capitalize">
                    {statName.replace('-', ' ')}
                  </td>
                  {comparisonList.map((pokemon) => {
                    const stat = pokemon.stats.find(s => s.name === statName)
                    const value = stat?.value || 0
                    const isBest = value === maxStat && maxStat > 0
                    const isWorst = value === Math.min(...comparisonList.map(p => 
                      p.stats.find(s => s.name === statName)?.value || 0
                    )) && comparisonList.length > 1
                    
                    return (
                      <td 
                        key={pokemon.id} 
                        className={`p-3 border border-border text-center font-semibold
                          ${isBest ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''}
                          ${isWorst ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : ''}
                        `}
                      >
                        {value}
                        {isBest && <span className="ml-1 text-xs">👑</span>}
                        {isWorst && <span className="ml-1 text-xs">📉</span>}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}