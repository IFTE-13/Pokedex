// components/favoriteButton.tsx
"use client"

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/context/favoritesContext'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FavoriteButtonProps {
  pokemonId: number
  pokemonName: string
  pokemonImage: string
  pokemonTypes: string[]
  size?: 'sm' | 'default' | 'lg'
}

export function FavoriteButton({ 
  pokemonId, 
  pokemonName, 
  pokemonImage, 
  pokemonTypes,
  size = 'default'
}: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const favorited = isFavorite(pokemonId)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent any default action
    e.stopPropagation() // Stop the click from bubbling to parent
    
    if (favorited) {
      removeFavorite(pokemonId)
      toast.info(`Removed ${pokemonName} from favorites`)
    } else {
      addFavorite({
        id: pokemonId,
        name: pokemonName,
        image: pokemonImage,
        types: pokemonTypes
      })
      toast.success(`Added ${pokemonName} to favorites`)
    }
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggle}
      className="gap-2 button-action"
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={cn(
          "h-5 w-5 transition-all",
          favorited && "fill-red-500 text-red-500"
        )} 
      />
    </Button>
  )
}