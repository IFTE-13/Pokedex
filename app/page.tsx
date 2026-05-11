"use client"

import { useState, useEffect } from 'react'
import { PokemonCard } from '@/components/pokemonCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { PokemonCardData } from '@/lib/pokemon'

interface PokemonBasic {
  name: string
  url: string
}

export default function HomePage() {
  const [pokemonList, setPokemonList] = useState<PokemonCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const itemsPerPage = 20

  useEffect(() => {
    const loadPokemon = async () => {
      setLoading(true)
      try {
        const offset = (currentPage - 1) * itemsPerPage
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`)
        const data = await response.json()
        setTotalPages(Math.ceil(data.count / itemsPerPage))
        
        // Fetch details for each Pokemon to get images
        const details = await Promise.all(
          data.results.map(async (pokemon: PokemonBasic) => {
            const res = await fetch(pokemon.url)
            const details = await res.json()
            return {
              name: pokemon.name,
              image: details.sprites.other['official-artwork']?.front_default || details.sprites.front_default,
              id: details.id
            }
          })
        )
        setPokemonList(details)
      } catch (error) {
        console.error('Error loading Pokemon:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPokemon()
  }, [currentPage])

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pokemonList.map((pokemon) => (
              <PokemonCard 
                key={pokemon.id}
                name={pokemon.name}
                image={pokemon.image}
                id={pokemon.id}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}