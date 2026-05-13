// components/AudioControls.tsx
"use client"

import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAudio } from '@/context/audioContext'

export function AudioControls() {
  const { isMuted, toggleMute } = useAudio()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMute}
      className="relative"
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Button>
  )
}