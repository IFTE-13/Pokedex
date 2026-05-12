import { useState, useEffect } from 'react'
import { PokemonCardData, PokemonDetail, ApiResponse, PokemonListData } from '@/lib/types/pokemon'

interface UsePokemonListOptions {
  page?: number
  limit?: number
}

export function usePokemonList(options: UsePokemonListOptions = {}) {
  const { page = 1, limit = 20 } = options
  const [pokemonList, setPokemonList] = useState<PokemonCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/pokemon?page=${page}&limit=${limit}`)
        const result: ApiResponse<PokemonListData> = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch Pokemon')
        }
        
        setPokemonList(result.data?.results || [])
        setTotalPages(result.data?.pagination.totalPages || 0)
        setTotalCount(result.data?.pagination.totalCount || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPokemon()
  }, [page, limit])

  const refetch = () => {
    // Trigger a re-fetch by forcing the effect to re-run
    // You can do this by adding a state variable or just call the fetch directly
    const doRefetch = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/pokemon?page=${page}&limit=${limit}`)
        const result: ApiResponse<PokemonListData> = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch Pokemon')
        }
        
        setPokemonList(result.data?.results || [])
        setTotalPages(result.data?.pagination.totalPages || 0)
        setTotalCount(result.data?.pagination.totalCount || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    doRefetch()
  }

  return { pokemonList, loading, error, totalPages, totalCount, refetch }
}

export function usePokemonDetails(name: string) {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!name) return
      
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/pokemon/${name}`)
        const result: ApiResponse<PokemonDetail> = await response.json()
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch Pokemon details')
        }
        
        setPokemon(result.data || null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPokemon()
  }, [name])

  return { pokemon, loading, error }
}