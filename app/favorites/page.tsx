"use client"

import { useFavorites } from '@/context/favoritesContext'
import { PokemonCard } from '@/components/pokemonCard'
import { Heart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Favorites Yet</h1>
        <p className="text-muted-foreground mb-6">
          Start adding Pokemon to your favorites by clicking the heart icon on any Pokemon card.
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
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="text-muted-foreground">
            You have {favorites.length} favorite Pokemon
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {favorites.map((pokemon) => (
          <div key={pokemon.id} className="relative group">
            <PokemonCard
              name={pokemon.name}
              image={pokemon.image}
              id={pokemon.id}
              originalName={pokemon.name}
              types={pokemon.types}
            />
            <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFavorite(pokemon.id)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}