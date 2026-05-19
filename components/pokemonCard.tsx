"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FavoriteButton } from './favoriteButton'
import { CompareButton } from './compareButton'

interface PokemonCardProps {
  name: string
  image: string
  id: number
  originalName: string
  types: string[]
  stats?: { name: string; value: number }[]
  height?: number
  weight?: number
}

export function PokemonCard({ name, image, id, originalName, types, stats, height, weight }: PokemonCardProps) {
  const [imgError, setImgError] = useState(false)
  
  const fallbackImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/0.png"
  const imageSrc = (!image || imgError) ? fallbackImage : image

  const comparisonData = stats ? {
    id,
    name: originalName,
    image: imageSrc,
    types,
    stats: stats.map(s => ({ name: s.name, value: s.value })),
    height: height || 0,
    weight: weight || 0
  } : null

  // Get main type for gradient background
  const mainType = types[0]?.toLowerCase() || 'normal'
  const typeGradients: Record<string, string> = {
    normal: 'from-gray-400/20 to-gray-500/10',
    fire: 'from-orange-500/20 to-red-500/10',
    water: 'from-blue-500/20 to-cyan-500/10',
    electric: 'from-yellow-400/20 to-yellow-600/10',
    grass: 'from-green-500/20 to-emerald-500/10',
    ice: 'from-cyan-400/20 to-blue-400/10',
    fighting: 'from-red-700/20 to-red-800/10',
    poison: 'from-purple-500/20 to-purple-700/10',
    ground: 'from-amber-600/20 to-amber-700/10',
    flying: 'from-indigo-400/20 to-purple-400/10',
    psychic: 'from-pink-500/20 to-pink-600/10',
    bug: 'from-lime-500/20 to-green-500/10',
    rock: 'from-stone-500/20 to-stone-600/10',
    ghost: 'from-purple-700/20 to-purple-800/10',
    dragon: 'from-indigo-700/20 to-indigo-800/10',
    dark: 'from-gray-700/20 to-gray-800/10',
    steel: 'from-gray-500/20 to-gray-600/10',
    fairy: 'from-pink-300/20 to-pink-400/10',
  }

  const gradientClass = typeGradients[mainType] || 'from-gray-400/20 to-gray-500/10'

  return (
    <div className="group relative">
      <Link href={`/pokemon/${originalName}`}>
        <div className={`bg-linear-to-br ${gradientClass} bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden relative`}>
          
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20 dark:bg-white/5 blur-2xl group-hover:scale-150 transition-transform duration-500" />
          
          <div className="absolute top-2 left-3 z-10">
            <span className="text-xs font-mono font-bold text-muted-foreground/60">
              #{String(id).padStart(3, '0')}
            </span>
          </div>
          
          <div className="absolute top-2 right-2 z-20">
            <FavoriteButton 
              pokemonId={id}
              pokemonName={name}
              pokemonImage={imageSrc}
              pokemonTypes={types}
              size="sm"
            />
          </div>
          
          {comparisonData && (
            <div className="absolute bottom-2 right-2 z-20">
              <CompareButton 
                pokemon={comparisonData} 
                size="sm" 
              />
            </div>
          )}
          
          <div className="aspect-square relative mb-3 mt-4">
            <Image
              src={imageSrc}
              alt={name}
              fill
              className="object-contain drop-shadow-md group-hover:drop-shadow-xl transition-all duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="text-center mt-2">
            <h2 className="font-bold capitalize text-base sm:text-lg group-hover:text-primary transition-colors">
              {name}
            </h2>
            
            <div className="flex gap-1 justify-center mt-2 flex-wrap">
              {types.map((type) => (
                <span
                  key={type}
                  className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full capitalize font-medium text-white
                    ${type === 'normal' ? 'bg-gray-400' : ''}
                    ${type === 'fire' ? 'bg-orange-500' : ''}
                    ${type === 'water' ? 'bg-blue-500' : ''}
                    ${type === 'electric' ? 'bg-yellow-400 text-gray-800' : ''}
                    ${type === 'grass' ? 'bg-green-500' : ''}
                    ${type === 'ice' ? 'bg-cyan-400 text-gray-800' : ''}
                    ${type === 'fighting' ? 'bg-red-700' : ''}
                    ${type === 'poison' ? 'bg-purple-500' : ''}
                    ${type === 'ground' ? 'bg-amber-600' : ''}
                    ${type === 'flying' ? 'bg-indigo-400' : ''}
                    ${type === 'psychic' ? 'bg-pink-500' : ''}
                    ${type === 'bug' ? 'bg-lime-500' : ''}
                    ${type === 'rock' ? 'bg-stone-500' : ''}
                    ${type === 'ghost' ? 'bg-purple-700' : ''}
                    ${type === 'dragon' ? 'bg-indigo-700' : ''}
                    ${type === 'dark' ? 'bg-gray-700' : ''}
                    ${type === 'steel' ? 'bg-gray-500' : ''}
                    ${type === 'fairy' ? 'bg-pink-300 text-gray-800' : ''}
                  `}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}