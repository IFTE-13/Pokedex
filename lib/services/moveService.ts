// lib/services/moveService.ts
export interface Move {
  name: string
  level: number
  power: number | null
  accuracy: number | null
  pp: number
  type: string
  category: 'physical' | 'special' | 'status'
}

interface MoveApiResponse {
  move: {
    name: string
    url: string
  }
  version_group_details: {
    level_learned_at: number
  }[]
}

interface MoveDetailApiResponse {
  power: number | null
  accuracy: number | null
  pp: number
  type: {
    name: string
  }
  damage_class: {
    name: 'physical' | 'special' | 'status'
  }
}

export async function getMoves(pokemonName: string): Promise<Move[]> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    const data = await response.json()
    
    const moves = await Promise.all(
      data.moves.map(async (move: MoveApiResponse) => {
        const moveRes = await fetch(move.move.url)
        const moveData: MoveDetailApiResponse = await moveRes.json()
        
        return {
          name: move.move.name,
          level: move.version_group_details[0]?.level_learned_at || 0,
          power: moveData.power,
          accuracy: moveData.accuracy,
          pp: moveData.pp,
          type: moveData.type.name,
          category: moveData.damage_class.name
        }
      })
    )
    
    return moves.filter(m => m.level > 0).sort((a, b) => a.level - b.level)
  } catch {
    return []
  }
}