"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface PokemonForComparison {
  id: number
  name: string
  image: string
  types: string[]
  stats: { name: string; value: number }[]
  height: number
  weight: number
}

interface ComparisonContextType {
  comparisonList: PokemonForComparison[]
  addToComparison: (pokemon: PokemonForComparison) => void
  removeFromComparison: (id: number) => void
  clearComparison: () => void
  isInComparison: (id: number) => boolean
  comparisonCount: number
  maxCompare: number
}

const MAX_COMPARE = 4

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [comparisonList, setComparisonList] = useState<PokemonForComparison[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pokemon-comparison')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          console.error('Failed to parse comparison list')
          return []
        }
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('pokemon-comparison', JSON.stringify(comparisonList))
  }, [comparisonList])

  const addToComparison = useCallback((pokemon: PokemonForComparison) => {
    setComparisonList(prev => {
      if (prev.some(p => p.id === pokemon.id)) return prev
      if (prev.length >= MAX_COMPARE) {
        return prev
      }
      return [...prev, pokemon]
    })
  }, [])

  const removeFromComparison = useCallback((id: number) => {
    setComparisonList(prev => prev.filter(p => p.id !== id))
  }, [])

  const clearComparison = useCallback(() => {
    setComparisonList([])
  }, [])

  const isInComparison = useCallback((id: number) => {
    return comparisonList.some(p => p.id === id)
  }, [comparisonList])

  return (
    <ComparisonContext.Provider value={{
      comparisonList,
      addToComparison,
      removeFromComparison,
      clearComparison,
      isInComparison,
      comparisonCount: comparisonList.length,
      maxCompare: MAX_COMPARE
    }}>
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}