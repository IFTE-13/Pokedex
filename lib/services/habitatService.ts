import { PokemonHabitat } from '@/lib/types/pokemon'

const POKEMON_API_BASE = 'https://pokeapi.co/api/v2'

export async function getPokemonHabitat(speciesName: string): Promise<PokemonHabitat | null> {
  try {
    const response = await fetch(`${POKEMON_API_BASE}/pokemon-species/${speciesName}`)
    const data = await response.json()
    
    if (data.habitat) {
      const habitatRes = await fetch(data.habitat.url)
      return await habitatRes.json()
    }
    return null
  } catch (error) {
    console.error('Error fetching habitat:', error)
    return null
  }
}

export const habitatNames: Record<string, string> = {
  cave: 'Cave',
  forest: 'Forest',
  grassland: 'Grassland',
  mountain: 'Mountain',
  rare: 'Rare',
  rough_terrain: 'Rough Terrain',
  sea: 'Sea',
  urban: 'Urban',
  waters_edge: "Water's Edge"
}