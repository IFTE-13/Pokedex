"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

interface PokemonFavorite {
  id: number
  name: string
  image: string
  types: string[]
}

interface FavoritesContextType {
  favorites: PokemonFavorite[]
  addFavorite: (pokemon: PokemonFavorite) => void
  removeFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
  favoriteCount: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  // Fix: Check if window is defined before accessing localStorage
  const [favorites, setFavorites] = useState<PokemonFavorite[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pokemon-favorites')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          console.error('Failed to parse favorites')
        }
      }
    }
    return []
  })

  const isMounted = useRef(false)

  // Save to localStorage whenever favorites changes
  useEffect(() => {
    if (isMounted.current && typeof window !== 'undefined') {
      localStorage.setItem('pokemon-favorites', JSON.stringify(favorites))
    }
  }, [favorites])

  // Mark as mounted after initial render
  useEffect(() => {
    isMounted.current = true
  }, [])

  const addFavorite = useCallback((pokemon: PokemonFavorite) => {
    setFavorites(prev => {
      if (prev.some(p => p.id === pokemon.id)) return prev
      return [...prev, pokemon]
    })
  }, [])

  const removeFavorite = useCallback((id: number) => {
    setFavorites(prev => prev.filter(p => p.id !== id))
  }, [])

  const isFavorite = useCallback((id: number) => {
    return favorites.some(p => p.id === id)
  }, [favorites])

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      favoriteCount: favorites.length
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}