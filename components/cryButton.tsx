// components/CryButton.tsx
"use client"

import { Volume2, VolumeX, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAudio } from '@/context/audioContext'
import { useState } from 'react'

interface CryButtonProps {
  pokemonId: number
  pokemonName: string
}

export function CryButton({ pokemonId, pokemonName }: CryButtonProps) {
  const { playPokemonCry, isMuted, isLoading: audioLoading } = useAudio()
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayCry = async () => {
    if (isMuted || isPlaying) return
    
    setIsPlaying(true)
    await playPokemonCry(pokemonId)
    
    // Reset playing state after sound duration (approx 2-3 seconds)
    setTimeout(() => {
      setIsPlaying(false)
    }, 3000)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePlayCry}
      disabled={isMuted || isPlaying || audioLoading}
      className="gap-2"
      title={isMuted ? "Sound is muted" : `Play ${pokemonName}'s cry`}
    >
      {isPlaying || audioLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isMuted ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      <span className="text-sm">Cry</span>
    </Button>
  )
}