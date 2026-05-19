"use client"

import { PokemonCard } from '@/components/pokemonCard'
import { ArrowUpFromDot, Loader2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState, useCallback } from 'react'

interface PokemonData {
  name: string
  originalName: string
  image: string
  id: number
  types: string[]
  stats: { name: string; value: number }[]
  height: number
  weight: number
}

interface PokemonType {
  type: {
    name: string
  }
}

interface PokemonStat {
  stat: {
    name: string
  }
  base_stat: number
}

interface PokemonDetailResponse {
  types: PokemonType[]
  stats: PokemonStat[]
  height: number
  weight: number
}

export default function HomePage() {
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const lastElementRef = useRef<HTMLDivElement>(null)
  const isLoadingRef = useRef(false)
  const initialLoadDone = useRef(false)

  const fetchPokemon = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    if (isLoadingRef.current && !isInitial) return
    
    isLoadingRef.current = true
    if (!isInitial) setLoading(true)
    
    try {
      const limit = 20
      const response = await fetch(`/api/pokemon?page=${pageNum}&limit=${limit}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch Pokemon')
      }
      
      const newItems = result.data.results
      const pagination = result.data.pagination
      
      // Fetch additional details for each Pokemon
      const detailedItems = await Promise.all(
        newItems.map(async (pokemon: PokemonData) => {
          const detailsResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.originalName}`)
          const details: PokemonDetailResponse = await detailsResponse.json()
          
          return {
            name: pokemon.name,
            originalName: pokemon.originalName,
            image: pokemon.image,
            id: pokemon.id,
            types: details.types.map((t: PokemonType) => t.type.name),
            stats: details.stats.map((s: PokemonStat) => ({ 
              name: s.stat.name, 
              value: s.base_stat 
            })),
            height: details.height,
            weight: details.weight
          }
        })
      )
      
      setPokemonList(prev => isInitial ? detailedItems : [...prev, ...detailedItems])
      setHasMore(pageNum < pagination.totalPages)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }, [])

  // Initial load - using a ref to ensure it only runs once
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true
      fetchPokemon(1, true)
    }
  }, [fetchPokemon])

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!lastElementRef.current || !hasMore || loading) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isLoadingRef.current) {
          const nextPage = page + 1
          setPage(nextPage)
          fetchPokemon(nextPage, false)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px 200px 0px' }
    )
    
    observer.observe(lastElementRef.current)
    
    return () => observer.disconnect()
  }, [hasMore, loading, page, fetchPokemon])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading Pokemon</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pokemonList.map((pokemon) => (
          <PokemonCard 
            key={pokemon.id}
            name={pokemon.name}
            image={pokemon.image}
            id={pokemon.id}
            originalName={pokemon.originalName}
            types={pokemon.types}
            stats={pokemon.stats}
            height={pokemon.height}
            weight={pokemon.weight}
          />
        ))}
      </div>

      <div ref={lastElementRef} className="flex justify-center py-8">
        {loading && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading more Pokemon...</p>
          </div>
        )}
        
        {!hasMore && pokemonList.length > 0 && (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span className="text-sm">You&apos;ve caught all Pokemon!</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {pokemonList.length} Pokemon
            </p>
          </div>
        )}

        {!loading && !hasMore && pokemonList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No Pokemon found</p>
          </div>
        )}
      </div>

      {pokemonList.length > 20 && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 h-12 w-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all z-50 cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUpFromDot className='animate-pulse' />
        </Button>
      )}
    </div>
  )
}