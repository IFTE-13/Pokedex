"use client"

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { Howl } from 'howler'

interface AudioContextType {
  isMuted: boolean
  toggleMute: () => void
  playPokemonCry: (pokemonId: number) => void
  isLoading: boolean
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('pokemon-mute')
      return savedMute === 'true'
    }
    return false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const soundCache = useRef<Map<number, Howl>>(new Map())
  const currentSound = useRef<Howl | null>(null)

  useEffect(() => {
    localStorage.setItem('pokemon-mute', String(isMuted))
    
    if (isMuted && currentSound.current) {
      currentSound.current.stop()
    }
  }, [isMuted])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev)
  }, [])

  const playPokemonCry = useCallback(async (pokemonId: number) => {
    if (isMuted) return
    
    if (currentSound.current) {
      currentSound.current.stop()
    }
    
    if (soundCache.current.has(pokemonId)) {
      const sound = soundCache.current.get(pokemonId)
      if (sound) {
        currentSound.current = sound
        sound.play()
      }
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      const data = await response.json()
      
      const cryUrl = data.cries?.latest || data.cries?.legacy
      
      if (!cryUrl) {
        console.error('No cry found for this Pokemon')
        return
      }
      
      const sound = new Howl({
        src: [cryUrl],
        volume: 0.5,
        onend: () => {
          currentSound.current = null
        },
        onloaderror: (soundId, error) => {
          console.error('Error loading sound:', error)
          soundCache.current.delete(pokemonId)
        }
      })
      
      soundCache.current.set(pokemonId, sound)
      currentSound.current = sound
      sound.play()
      
    } catch (error) {
      console.error('Error playing Pokemon cry:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isMuted])

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playPokemonCry, isLoading }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}