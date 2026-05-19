// components/compareButton.tsx
"use client"

import { Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useComparison, PokemonForComparison } from '@/context/comparisonContext'
import { toast } from 'sonner'

interface CompareButtonProps {
  pokemon: PokemonForComparison
  size?: 'sm' | 'default' | 'lg'
}

export function CompareButton({ pokemon, size = 'default' }: CompareButtonProps) {
  const { isInComparison, addToComparison, removeFromComparison, comparisonCount, maxCompare } = useComparison()
  const inComparison = isInComparison(pokemon.id)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (inComparison) {
      removeFromComparison(pokemon.id)
      toast.info(`Removed ${pokemon.name} from comparison`)
    } else {
      if (comparisonCount >= maxCompare) {
        toast.error(`Can only compare up to ${maxCompare} Pokemon at once`)
        return
      }
      addToComparison(pokemon)
      toast.success(`Added ${pokemon.name} to comparison`)
    }
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleToggle}
      className={`gap-1 ${inComparison ? 'bg-green-500/10 text-green-600 dark:text-green-400' : ''}`}
      aria-label={inComparison ? 'Remove from comparison' : 'Add to comparison'}
    >
      {inComparison ? (
        <Check className="h-3 w-3 sm:h-4 sm:w-4" />
      ) : (
        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
      )}
    </Button>
  )
}