"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface RecentlyViewedPokemon {
  id: number
  name: string
  image: string
  types: string[]
  viewedAt: number
}

interface RecentlyViewedContextType {
  recentlyViewed: RecentlyViewedPokemon[]
  addRecentlyViewed: (pokemon: RecentlyViewedPokemon) => void
  removeFromRecentlyViewed: (id: number) => void
  clearRecentlyViewed: () => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined)

const MAX_RECENT = 10

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  // Initialize state directly from localStorage (lazy initialization)
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedPokemon[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pokemon-recently-viewed')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          console.error('Failed to parse recently viewed')
        }
      }
    }
    return []
  })

  // Save to localStorage whenever recentlyViewed changes
  useEffect(() => {
    localStorage.setItem('pokemon-recently-viewed', JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  const addRecentlyViewed = useCallback((pokemon: RecentlyViewedPokemon) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== pokemon.id)
      const newItem = { ...pokemon, viewedAt: Date.now() }
      return [newItem, ...filtered].slice(0, MAX_RECENT)
    })
  }, [])

  const removeFromRecentlyViewed = useCallback((id: number) => {
    setRecentlyViewed(prev => prev.filter(p => p.id !== id))
  }, [])

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([])
  }, [])

  return (
    <RecentlyViewedContext.Provider value={{
      recentlyViewed,
      addRecentlyViewed,
      removeFromRecentlyViewed,
      clearRecentlyViewed
    }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext)
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider')
  }
  return context
}