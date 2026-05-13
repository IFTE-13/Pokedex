"use client"

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Ruler, Weight, Activity, Heart, Zap, Shield, TrendingUp, Wind, LucideIcon } from 'lucide-react'
import { usePokemonDetails } from '@/hooks/usePokemon'
import { typeColors, statNames } from '@/lib/constants/pokemon'
import Image from 'next/image'
import NotFound from '@/app/not-found'
import { EvolutionChain } from '@/components/evolutionChain'
import { useEffect, useState } from 'react'

const statIcons: Record<string, LucideIcon> = {
  hp: Heart,
  attack: Zap,
  defense: Shield,
  'special-attack': TrendingUp,
  'special-defense': Shield,
  speed: Wind,
}

export default function PokemonPage() {
  const params = useParams()
  const name = params.name as string
  const { pokemon, loading, error } = usePokemonDetails(name)
  const [speciesUrl, setSpeciesUrl] = useState<string>('')

  useEffect(() => {
    const fetchSpecies = async () => {
      if (pokemon) {
        try {
          // The species API endpoint is predictable
          const speciesEndpoint = `https://pokeapi.co/api/v2/pokemon-species/${name}`
          console.log('Fetching species from:', speciesEndpoint)
          
          const response = await fetch(speciesEndpoint)
          const data = await response.json()
          
          // The evolution chain URL is directly in the response
          console.log('Evolution chain URL:', data.evolution_chain?.url)
          
          // Store the evolution chain URL directly, not the species URL
          if (data.evolution_chain?.url) {
            setSpeciesUrl(data.evolution_chain.url)
          }
        } catch (error) {
          console.error('Error fetching species:', error)
        }
      }
    }
    fetchSpecies()
  }, [pokemon, name])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (error || !pokemon) {
    return (
      <NotFound />
    )
  }

  const imageUrl = pokemon.sprites.other['official-artwork']?.front_default || 
                   pokemon.sprites.front_default

  return (
    <div className=" overflow-hidden">
      <div className="container mx-auto px-4 h-full">
        <Link 
          href="/" 
          className="inline-flex items-center py-4 gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-center py-12 md:py-0">
          <div className="flex justify-center">
            <div className="relative w-96 h-96">
              <Image
                src={imageUrl}
                alt={pokemon.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className='space-y-3'>
              <p className="text-muted-foreground">#{String(pokemon.id).padStart(3, '0')}</p>
              <div className="flex gap-2 flex-wrap">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`text-sm px-3 py-1 rounded-full capitalize font-medium ${typeColors[type.type.name]}`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
              <h1 className="text-7xl font-bold capitalize">
                {pokemon.name}
              </h1>
              
            </div>

            <div className="flex gap-8 border-y border-border py-4">
              <div className="flex items-center gap-3">
                <Ruler className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="text-xl font-semibold">{pokemon.height / 10} <span className="text-base font-normal">m</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Weight className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="text-xl font-semibold">{pokemon.weight / 10} <span className="text-base font-normal">kg</span></p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5" />
                Base Stats
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pokemon.stats.map((stat) => {
                  const Icon = statIcons[stat.stat.name] || Activity
                  const statBgColors: Record<string, string> = {
                    hp: 'bg-red-50 dark:bg-red-950/20',
                    attack: 'bg-orange-50 dark:bg-orange-950/20',
                    defense: 'bg-yellow-50 dark:bg-yellow-950/20',
                    'special-attack': 'bg-blue-50 dark:bg-blue-950/20',
                    'special-defense': 'bg-green-50 dark:bg-green-950/20',
                    speed: 'bg-purple-50 dark:bg-purple-950/20',
                  }
                  const bgColor = statBgColors[stat.stat.name] || 'bg-gray-50 dark:bg-gray-950/20'
                  
                  return (
                    <div key={stat.stat.name} className={`flex items-center gap-3 p-3 rounded-lg ${bgColor}`}>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium w-24">{statNames[stat.stat.name]}</span>
                      <span className="font-mono text-lg font-bold ml-auto">{stat.base_stat}</span>
                      <span className="text-xs text-muted-foreground">/ 255</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Abilities</h2>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability) => (
                  <div key={ability.ability.name} className="px-3 py-1 rounded-md bg-black/5 dark:bg-white/10">
                    <span className="text-sm capitalize">{ability.ability.name.replace('-', ' ')}</span>
                    {ability.is_hidden && (
                      <span className="text-xs ml-1 text-muted-foreground">(Hidden)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
        {speciesUrl && (
          <section className="pb-8 border-t border-border">
            <EvolutionChain 
              speciesName={name}
              evolutionChainUrl={speciesUrl}
            />
          </section>
        )}
      </div>
      </div>
    </div>
  )
}