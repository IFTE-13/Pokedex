"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, TrendingUp, Package, MapPin, Moon, Sun, CloudRain, Repeat, Gift, Zap, Heart, Award, ArrowUp, Users, Clock, Diamond } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { EvolutionDetail } from '@/lib/types/evolution'
import { Button } from './ui/button'

interface EvolutionNode {
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionNode[]
  evolution_details: EvolutionDetail[]
}

interface EvolutionChainProps {
  speciesName: string
  evolutionChainUrl: string
}

export function EvolutionChain({ speciesName, evolutionChainUrl }: EvolutionChainProps) {
  const [evolutionData, setEvolutionData] = useState<EvolutionNode | null>(null)
  const [pokemonImages, setPokemonImages] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [selectedPokemon, setSelectedPokemon] = useState<{ name: string; details: EvolutionDetail } | null>(null)

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      if (!evolutionChainUrl) return
      
      try {
        const evolutionRes = await fetch(evolutionChainUrl)
        const evolutionData = await evolutionRes.json()
        setEvolutionData(evolutionData.chain)
        await fetchImagesForChain(evolutionData.chain)
      } catch (error) {
        console.error('Error fetching evolution:', error)
      } finally {
        setLoading(false)
      }
    }
    
    const fetchImagesForChain = async (node: EvolutionNode) => {
      const name = node.species.name
      
      try {
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        const pokemonData = await pokemonRes.json()
        const image = pokemonData.sprites.other['official-artwork']?.front_default || 
                     pokemonData.sprites.front_default
        
        setPokemonImages(prev => ({ ...prev, [name]: image }))
      } catch (error) {
        console.error(`Error fetching image for ${name}:`, error)
      }
      
      for (const evo of node.evolves_to) {
        await fetchImagesForChain(evo)
      }
    }
    
    if (evolutionChainUrl) {
      fetchEvolutionChain()
    }
  }, [evolutionChainUrl])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!evolutionData || (!evolutionData.evolves_to.length && evolutionData.species.name === speciesName)) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground">
          <Zap className="h-4 w-4" />
          <span className="text-sm">This Pokémon does not evolve</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="py-8 border-t border-border">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Evolution Chain</h2>
          <div className="h-1 w-16 bg-linear-to-r from-blue-500 to-blue-300 rounded-full mx-auto mt-2" />
        </div>

        <div className="hidden md:flex md:justify-center md:items-start md:gap-8 overflow-x-auto pb-4">
          <EvolutionNodeDesktop 
            node={evolutionData}
            images={pokemonImages}
            onViewDetails={(name, details) => setSelectedPokemon({ name, details })}
          />
        </div>

        <div className="flex flex-col items-center gap-6 md:hidden">
          <EvolutionNodeMobile 
            node={evolutionData}
            images={pokemonImages}
            onViewDetails={(name, details) => setSelectedPokemon({ name, details })}
          />
        </div>
      </div>

      <Sheet open={!!selectedPokemon} onOpenChange={() => setSelectedPokemon(null)}>
        <SheetContent side="right" className="sm:max-w-lg mx-auto rounded-t-2xl h-[85vh] overflow-y-auto py-12">
          {selectedPokemon && (
            <>
              <SheetHeader>
                <SheetTitle className="capitalize text-2xl font-bold">
                  {selectedPokemon.name}
                </SheetTitle>
                <SheetDescription>
                  All the requirements to evolve {selectedPokemon.name}
                </SheetDescription>
              </SheetHeader>
              <EvolutionDetailsContent details={selectedPokemon.details} />
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function EvolutionNodeDesktop({ 
  node, 
  images, 
  onViewDetails 
}: { 
  node: EvolutionNode
  images: Record<string, string>
  onViewDetails: (name: string, details: EvolutionDetail) => void
}) {
  const name = node.species.name
  const image = images[name]
  const hasEvolutions = node.evolves_to.length > 0
  const id = node.species.url.split('/').filter(Boolean).pop() || '0'
  const evolutionDetail = node.evolution_details[0]

  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center" style={{ minWidth: '200px' }}>
        <Link href={`/pokemon/${name}`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer w-52 border border-border/50 hover:border-primary/50">
            <div className="aspect-square relative mb-4">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-mono">#{String(id).padStart(3, '0')}</p>
              <h2 className="font-semibold text-lg capitalize mt-1">{name}</h2>
            </div>
          </div>
        </Link>
        
        <div className="h-8 mt-2">
          {evolutionDetail && (
            <Button
              onClick={() => onViewDetails(name, evolutionDetail)}
              className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer bg-background hover:bg-background"
            >
              <TrendingUp className="h-3 w-3" />
              Evolution details
            </Button>
          )}
        </div>
      </div>

      {hasEvolutions && (
        <>
          <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0" />
          <div className="flex gap-6">
            {node.evolves_to.map((evo, idx) => (
              <EvolutionNodeDesktop 
                key={idx}
                node={evo}
                images={images}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function EvolutionNodeMobile({ 
  node, 
  images, 
  onViewDetails 
}: { 
  node: EvolutionNode
  images: Record<string, string>
  onViewDetails: (name: string, details: EvolutionDetail) => void
}) {
  const name = node.species.name
  const image = images[name]
  const hasEvolutions = node.evolves_to.length > 0
  const id = node.species.url.split('/').filter(Boolean).pop() || '0'
  const evolutionDetail = node.evolution_details[0]

  return (
    <div className="flex flex-col items-center">
      <Link href={`/pokemon/${name}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer w-64 border border-border/50 hover:border-primary/50">
          <div className="aspect-square relative mb-4">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-contain p-2"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-mono">#{String(id).padStart(3, '0')}</p>
            <h2 className="font-semibold text-xl capitalize mt-1">{name}</h2>
          </div>
        </div>
      </Link>
      <div className="h-8 mt-2">
        {evolutionDetail && (
          <Button
            onClick={() => onViewDetails(name, evolutionDetail)}
            className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 bg-background hover:bg-background cursor-pointer"
          >
            <TrendingUp className="h-3 w-3" />
            Evolution details
          </Button>
        )}
      </div>

      {hasEvolutions && (
        <div className="flex flex-col items-center mt-3">
          <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 my-2" />
          <div className="flex flex-col gap-6">
            {node.evolves_to.map((evo, idx) => (
              <EvolutionNodeMobile 
                key={idx}
                node={evo}
                images={images}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EvolutionDetailsContent({ details }: { details: EvolutionDetail }) {
  const hasConditions = details.min_level || details.min_happiness || details.min_beauty || 
                        details.min_affection || details.location || details.time_of_day ||
                        details.needs_overworld_rain || details.known_move || details.known_move_type ||
                        details.gender !== null

  return (
    <div className="mt-2 space-y-4 px-4">
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="h-5 w-5 text-blue-500" />
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Evolution Method</p>
        </div>
        <p className="text-lg font-semibold capitalize">
          {details.trigger.name.replace('-', ' ')}
        </p>
      </div>

      {details.min_level && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp className="h-4 w-4 text-green-500" />
            <p className="text-sm font-semibold text-muted-foreground">Required Level</p>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{details.min_level}</p>
        </div>
      )}

      {details.item && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-purple-500" />
            <p className="text-sm font-semibold text-muted-foreground">Required Item</p>
          </div>
          <p className="text-lg font-semibold capitalize">{details.item.name.replace('-', ' ')}</p>
        </div>
      )}

      {details.held_item && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Diamond className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-semibold text-muted-foreground">Held Item</p>
          </div>
          <p className="text-lg font-semibold capitalize">{details.held_item.name.replace('-', ' ')}</p>
        </div>
      )}

      {details.location && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <p className="text-sm font-semibold text-muted-foreground">Location</p>
          </div>
          <p className="text-lg font-semibold capitalize">{details.location.name.replace('-', ' ')}</p>
        </div>
      )}

      {details.time_of_day && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            {details.time_of_day === 'day' ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}
            <p className="text-sm font-semibold text-muted-foreground">Time of Day</p>
          </div>
          <p className="text-lg font-semibold capitalize">{details.time_of_day}</p>
        </div>
      )}

      {details.min_happiness && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-pink-500" />
            <p className="text-sm font-semibold text-muted-foreground">Minimum Happiness</p>
          </div>
          <p className="text-lg font-semibold">≥ {details.min_happiness}</p>
        </div>
      )}

      {details.min_beauty && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-cyan-500" />
            <p className="text-sm font-semibold text-muted-foreground">Minimum Beauty</p>
          </div>
          <p className="text-lg font-semibold">≥ {details.min_beauty}</p>
        </div>
      )}

      {details.min_affection && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-red-500" />
            <p className="text-sm font-semibold text-muted-foreground">Minimum Affection</p>
          </div>
          <p className="text-lg font-semibold">≥ {details.min_affection}</p>
        </div>
      )}

      {details.gender !== null && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-500" />
            <p className="text-sm font-semibold text-muted-foreground">Gender</p>
          </div>
          <p className="text-lg font-semibold capitalize">{details.gender === 1 ? 'Female Only' : 'Male Only'}</p>
        </div>
      )}

      {details.needs_overworld_rain && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CloudRain className="h-4 w-4 text-blue-500" />
            <p className="text-sm font-semibold text-muted-foreground">Weather Condition</p>
          </div>
          <p className="text-lg font-semibold">While Raining</p>
        </div>
      )}

      {details.known_move && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <p className="text-sm font-semibold text-muted-foreground">Required Move</p>
          </div>
          <p className="text-lg font-semibold capitalize">{details.known_move.name.replace('-', ' ')}</p>
        </div>
      )}

      {details.known_move_type && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <p className="text-sm font-semibold text-muted-foreground">Required Move Type</p>
          </div>
          <p className="text-lg font-semibold capitalize">{details.known_move_type.name}-type move</p>
        </div>
      )}

      {details.trade_species && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Repeat className="h-4 w-4 text-green-500" />
            <p className="text-sm font-semibold text-muted-foreground">Trade For</p>
          </div>
          <p className="text-lg font-semibold capitalize">{details.trade_species.name}</p>
        </div>
      )}

      {details.turn_upside_down && (
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <p className="text-sm font-semibold text-muted-foreground">Special Condition</p>
          </div>
          <p className="text-lg font-semibold">Turn device upside down</p>
        </div>
      )}

      {!hasConditions && !details.item && !details.held_item && (
        <div className="text-center py-8 text-muted-foreground">
          No additional conditions required for evolution.
        </div>
      )}
    </div>
  )
}