"use client"

import { PokemonCard } from '@/components/pokemonCard'
import { ArrowUpFromDot, Loader2, Zap } from 'lucide-react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { items: pokemonList, loading, hasMore, error, lastElementRef } = useInfiniteScroll({
    initialPage: 1,
    limit: 20,
    threshold: 200
  })

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
        {pokemonList.map((pokemon, index) => (
          <PokemonCard 
            key={`${pokemon.id}-${index}`}
            name={pokemon.name}
            image={pokemon.image}
            id={pokemon.id}
            originalName={pokemon.originalName}
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