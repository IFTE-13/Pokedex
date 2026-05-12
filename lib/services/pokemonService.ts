import { PokemonDetail, PokemonCardData } from '@/lib/types/pokemon'
import { POKEMON_API } from '@/lib/constants/pokemon'

class PokemonService {
  private baseUrl: string

  constructor() {
    this.baseUrl = POKEMON_API.BASE_URL
  }

  private async fetchWithError<T>(url: string): Promise<T | null> {
    try {
      const response = await fetch(url, {
        next: { revalidate: 3600 },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        console.error(`API Error: ${response.status} - ${url}`)
        return null
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Fetch Error: ${url}`, error)
      return null
    }
  }

  async getPokemonList(limit: number = 20, offset: number = 0) {
    const url = `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
    return this.fetchWithError<{ results: { name: string; url: string }[]; count: number }>(url)
  }

  async getPokemonDetails(name: string): Promise<PokemonDetail | null> {
    const url = `${this.baseUrl}/pokemon/${name.toLowerCase()}`
    return this.fetchWithError<PokemonDetail>(url)
  }

  async getLocalizedPokemonList(
    limit: number,
    offset: number
  ): Promise<PokemonCardData[]> {
    const data = await this.getPokemonList(limit, offset)
    if (!data) return []

    const pokemonList = await Promise.all(
      data.results.map(async (pokemon) => {
        const pokemonData = await this.getPokemonDetails(pokemon.name)
        if (!pokemonData) return null

        return {
          name: pokemon.name,
          originalName: pokemon.name,
          image: pokemonData.sprites.other['official-artwork']?.front_default || 
                 pokemonData.sprites.front_default,
          id: pokemonData.id,
        }
      })
    )

    return pokemonList.filter((p): p is PokemonCardData => p !== null)
  }
}

export const pokemonService = new PokemonService()