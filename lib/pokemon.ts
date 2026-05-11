export interface PokemonBasic {
  name: string
  url: string
}

export interface PokemonCardData {
  name: string
  image: string
  id: number
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  types: { type: { name: string } }[]
  stats: { base_stat: number, stat: { name: string } }[]
  abilities: { ability: { name: string }, is_hidden: boolean }[]
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
    }
    front_default: string
  }
}

export interface PokemonListResponse {
  results: PokemonBasic[]
  count: number
  next: string | null
  previous: string | null
}

export async function fetchPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
  return response.json()
}

export async function fetchPokemonDetails(url: string): Promise<PokemonDetail> {
  const response = await fetch(url)
  return response.json()
}

export async function searchPokemon(name: string): Promise<PokemonDetail | null> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export const typeColors: { [key: string]: string } = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-stone-500',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
}