"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Sparkles } from 'lucide-react'
import { getPokemonOfTheDay, DailyPokemon } from '@/lib/services/dailyService'

export function PokemonOfTheDay() {
  const [pokemon, setPokemon] = useState<DailyPokemon | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPokemonOfTheDay().then(data => {
      setPokemon(data)
      setLoading(false)
    })
  }, [])

  if (loading) return null
  if (!pokemon) return null

  return (
    <div className="bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-5 w-5 text-purple-500" />
        <h3 className="font-semibold">Pokémon of the Day</h3>
        <Sparkles className="h-4 w-4 text-yellow-500" />
      </div>
      
      <Link href={`/pokemon/${pokemon.name}`}>
        <div className="flex items-center gap-4 cursor-pointer hover:bg-white/10 rounded-lg transition-colors p-2">
          <div className="relative w-20 h-20">
            <Image src={pokemon.image} alt={pokemon.name} fill className="object-contain" />
          </div>
          <div>
            <p className="font-bold capitalize text-lg">{pokemon.name}</p>
            <p className="text-sm text-muted-foreground">#{String(pokemon.id).padStart(3, '0')}</p>
            <p className="text-xs text-muted-foreground mt-1 italic">✨ {pokemon.fact}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}