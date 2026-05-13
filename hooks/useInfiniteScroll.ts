"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { PokemonCardData } from '@/lib/types/pokemon'

interface UseInfiniteScrollOptions {
  initialPage?: number
  limit?: number
  threshold?: number
}

interface UseInfiniteScrollReturn {
  items: PokemonCardData[]
  loading: boolean
  hasMore: boolean
  error: string | null
  loadMore: () => void
  lastElementRef: (node: HTMLDivElement | null) => void
}

export function useInfiniteScroll({
  initialPage = 1,
  limit = 20,
  threshold = 100
}: UseInfiniteScrollOptions = {}): UseInfiniteScrollReturn {
  const [items, setItems] = useState<PokemonCardData[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const pageRef = useRef(initialPage)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isLoadingRef = useRef(false)
  const initialLoadDoneRef = useRef(false)
  const isMountedRef = useRef(false)

  const fetchPokemon = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    if (isLoadingRef.current && !isInitial) return
    
    isLoadingRef.current = true
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/pokemon?page=${pageNum}&limit=${limit}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch Pokemon')
      }
      
      const newItems = result.data.results
      const pagination = result.data.pagination
      
      setItems(prev => isInitial ? newItems : [...prev, ...newItems])
      setHasMore(pageNum < pagination.totalPages)
      pageRef.current = pageNum
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
      isLoadingRef.current = false
      if (isInitial) initialLoadDoneRef.current = true
    }
  }, [limit])

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !isLoadingRef.current && initialLoadDoneRef.current) {
      const nextPage = pageRef.current + 1
      fetchPokemon(nextPage, false)
    }
  }, [loading, hasMore, fetchPokemon])

  // Initial load - using useEffect with a mounted ref
  useEffect(() => {
    if (!isMountedRef.current && !initialLoadDoneRef.current && items.length === 0) {
      isMountedRef.current = true
      fetchPokemon(initialPage, true)
    }
  }, [initialPage, fetchPokemon, items.length])

  // Callback ref for the last element
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && initialLoadDoneRef.current) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: `0px 0px ${threshold}px 0px` }
    )
    
    if (node) observerRef.current.observe(node)
  }, [loading, hasMore, loadMore, threshold])

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    lastElementRef
  }
}