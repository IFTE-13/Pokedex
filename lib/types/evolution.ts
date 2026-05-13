export interface EvolutionChain {
  id: number
  chain: EvolutionChainLink
}

export interface EvolutionChainLink {
  species: {
    name: string
    url: string
  }
  evolves_to: EvolutionChainLink[]
  evolution_details: EvolutionDetail[]
}

export interface EvolutionDetail {
  min_level: number | null
  min_happiness: number | null
  min_beauty: number | null
  min_affection: number | null
  needs_overworld_rain: boolean
  time_of_day: string
  gender: number | null
  held_item: { name: string } | null
  known_move: { name: string } | null
  known_move_type: { name: string } | null
  location: { name: string } | null
  trigger: { name: string }
  turn_upside_down: boolean
  item: { name: string } | null
  trade_species: { name: string } | null
}

export interface EvolutionData {
  id: number
  name: string
  image: string
  evolutionDetails?: EvolutionDetail
}

export interface EvolutionTree {
  current: EvolutionData
  evolvesTo: EvolutionTree[]
  evolvesFrom?: EvolutionData
}