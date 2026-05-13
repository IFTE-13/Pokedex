import { EvolutionChain, EvolutionTree, EvolutionData, EvolutionDetail } from '@/lib/types/evolution'

const POKEMON_API_BASE = 'https://pokeapi.co/api/v2'

export async function getEvolutionChain(speciesUrl: string): Promise<EvolutionChain | null> {
  try {
    const fullUrl = speciesUrl.startsWith('http') 
      ? speciesUrl 
      : `https://pokeapi.co${speciesUrl}`
    
    const speciesResponse = await fetch(fullUrl)
    if (!speciesResponse.ok) {
      throw new Error(`Failed to fetch species: ${speciesResponse.status}`)
    }
    
    const speciesData = await speciesResponse.json()
    const evolutionUrl = speciesData.evolution_chain.url
    
    const evolutionResponse = await fetch(evolutionUrl)
    if (!evolutionResponse.ok) {
      throw new Error(`Failed to fetch evolution chain: ${evolutionResponse.status}`)
    }
    
    const evolutionData = await evolutionResponse.json()
    return evolutionData
  } catch (error) {
    console.error('Error fetching evolution chain:', error)
    return null
  }
}

export async function getPokemonImage(name: string): Promise<string> {
  try {
    const response = await fetch(`${POKEMON_API_BASE}/pokemon/${name}`)
    if (!response.ok) return ''
    const data = await response.json()
    return data.sprites.other['official-artwork']?.front_default || data.sprites.front_default
  } catch (error) {
    console.error('Error fetching Pokemon image:', error)
    return ''
  }
}

export async function buildEvolutionTree(
  speciesUrl: string
): Promise<EvolutionTree | null> {
  const evolutionChain = await getEvolutionChain(speciesUrl)
  if (!evolutionChain) return null

  async function buildNode(
    chainLink: EvolutionChain['chain']
  ): Promise<EvolutionTree> {
    const pokemonName = chainLink.species.name
    const image = await getPokemonImage(pokemonName)
    
    const evolutionData: EvolutionData = {
      id: await getPokemonId(pokemonName),
      name: pokemonName,
      image: image,
    }
    
    if (chainLink.evolution_details && chainLink.evolution_details.length > 0) {
      evolutionData.evolutionDetails = chainLink.evolution_details[0]
    }
    
    const evolvesTo = await Promise.all(
      chainLink.evolves_to.map(async (evo) => await buildNode(evo))
    )
    
    return {
      current: evolutionData,
      evolvesTo: evolvesTo,
    }
  }
  
  return await buildNode(evolutionChain.chain)
}

async function getPokemonId(name: string): Promise<number> {
  try {
    const response = await fetch(`${POKEMON_API_BASE}/pokemon/${name}`)
    const data = await response.json()
    return data.id
  } catch {
    return 0
  }
}

export function formatEvolutionCondition(detail: EvolutionDetail): string {
  const conditions: string[] = []
  
  if (detail.trigger.name === 'level-up') {
    if (detail.min_level) {
      conditions.push(`Level ${detail.min_level}`)
    }
    if (detail.min_happiness) {
      conditions.push(`Happiness ≥ ${detail.min_happiness}`)
    }
    if (detail.min_beauty) {
      conditions.push(`Beauty ≥ ${detail.min_beauty}`)
    }
    if (detail.min_affection) {
      conditions.push(`Affection ≥ ${detail.min_affection}`)
    }
    if (detail.time_of_day) {
      conditions.push(`${detail.time_of_day} time`)
    }
    if (detail.needs_overworld_rain) {
      conditions.push('While raining')
    }
    if (detail.turn_upside_down) {
      conditions.push('Device turned upside down')
    }
    if (detail.known_move) {
      conditions.push(`Knowing ${detail.known_move.name.replace('-', ' ')}`)
    }
    if (detail.known_move_type) {
      conditions.push(`Knowing ${detail.known_move_type.name}-type move`)
    }
    if (detail.location) {
      conditions.push(`At ${detail.location.name.replace('-', ' ')}`)
    }
  } else if (detail.trigger.name === 'trade') {
    if (detail.trade_species) {
      conditions.push(`Trade with ${detail.trade_species.name}`)
    } else if (detail.held_item) {
      conditions.push(`Trade holding ${detail.held_item.name.replace('-', ' ')}`)
    } else {
      conditions.push('Trade')
    }
  } else if (detail.trigger.name === 'use-item') {
    if (detail.item) {
      conditions.push(`Use ${detail.item.name.replace('-', ' ')}`)
    }
  } else if (detail.trigger.name === 'shed') {
    conditions.push('Have an empty party slot and a Poké Ball')
  } else if (detail.trigger.name === 'spin') {
    conditions.push('Spin around')
  }
  
  return conditions.join(' + ') || detail.trigger.name
}