export interface TypeEffectiveness {
  attackingType: string
  defendingType: string
  multiplier: number
}

export interface TypeChartData {
  attackingType: string
  effectiveness: {
    type: string
    multiplier: number
  }[]
}

export const typeEffectivenessMatrix: Record<string, Record<string, number>> = {
  normal: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1,
    bug: 1, rock: 0.5, ghost: 0, dragon: 1, dark: 1, steel: 0.5, fairy: 1
  },
  fire: {
    normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 2,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1,
    bug: 2, rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 2, fairy: 1
  },
  water: {
    normal: 1, fire: 2, water: 0.5, electric: 1, grass: 0.5, ice: 1,
    fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1,
    bug: 1, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1
  },
  electric: {
    normal: 1, fire: 1, water: 2, electric: 0.5, grass: 0.5, ice: 1,
    fighting: 1, poison: 1, ground: 0, flying: 2, psychic: 1,
    bug: 1, rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1
  },
  grass: {
    normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 1,
    fighting: 1, poison: 0.5, ground: 2, flying: 0.5, psychic: 1,
    bug: 0.5, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 1
  },
  ice: {
    normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 0.5,
    fighting: 1, poison: 1, ground: 2, flying: 2, psychic: 1,
    bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 1
  },
  fighting: {
    normal: 2, fire: 1, water: 1, electric: 1, grass: 1, ice: 2,
    fighting: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5,
    bug: 0.5, rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2, fairy: 0.5
  },
  poison: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 2, ice: 1,
    fighting: 1, poison: 0.5, ground: 0.5, flying: 1, psychic: 1,
    bug: 1, rock: 0.5, ghost: 0.5, dragon: 1, dark: 1, steel: 0, fairy: 2
  },
  ground: {
    normal: 1, fire: 2, water: 1, electric: 2, grass: 0.5, ice: 1,
    fighting: 1, poison: 2, ground: 1, flying: 0, psychic: 1,
    bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1
  },
  flying: {
    normal: 1, fire: 1, water: 1, electric: 0.5, grass: 2, ice: 1,
    fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1,
    bug: 2, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1
  },
  psychic: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 2, poison: 2, ground: 1, flying: 1, psychic: 0.5,
    bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 0, steel: 0.5, fairy: 1
  },
  bug: {
    normal: 1, fire: 0.5, water: 1, electric: 1, grass: 2, ice: 1,
    fighting: 0.5, poison: 0.5, ground: 1, flying: 0.5, psychic: 2,
    bug: 1, rock: 1, ghost: 0.5, dragon: 1, dark: 2, steel: 0.5, fairy: 0.5
  },
  rock: {
    normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 2,
    fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1,
    bug: 2, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1
  },
  ghost: {
    normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 2,
    bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 1
  },
  dragon: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1,
    bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 0
  },
  dark: {
    normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 2,
    bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 0.5
  },
  steel: {
    normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 1, ice: 2,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1,
    bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 2
  },
  fairy: {
    normal: 1, fire: 0.5, water: 1, electric: 1, grass: 1, ice: 1,
    fighting: 2, poison: 0.5, ground: 1, flying: 1, psychic: 1,
    bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 2, steel: 0.5, fairy: 1
  }
}

export const typeNames: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fire',
  water: 'Water',
  electric: 'Electric',
  grass: 'Grass',
  ice: 'Ice',
  fighting: 'Fighting',
  poison: 'Poison',
  ground: 'Ground',
  flying: 'Flying',
  psychic: 'Psychic',
  bug: 'Bug',
  rock: 'Rock',
  ghost: 'Ghost',
  dragon: 'Dragon',
  dark: 'Dark',
  steel: 'Steel',
  fairy: 'Fairy'
}

export function getEffectivenessMultiplier(multiplier: number): {
  label: string
  color: string
  bgColor: string
  icon: string
} {
  if (multiplier === 0) {
    return { label: 'Immune', color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800', icon: '🛡️' }
  }
  if (multiplier === 0.25) {
    return { label: '¼x', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-950/30', icon: '🔷' }
  }
  if (multiplier === 0.5) {
    return { label: '½x', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-950/30', icon: '🟢' }
  }
  if (multiplier === 1) {
    return { label: '1x', color: 'text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-800/50', icon: '⚪' }
  }
  if (multiplier === 2) {
    return { label: '2x', color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/30', icon: '🟠' }
  }
  if (multiplier === 4) {
    return { label: '4x', color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-950/30', icon: '🔴' }
  }
  return { label: `${multiplier}x`, color: 'text-gray-500', bgColor: 'bg-gray-50', icon: '❓' }
}

export function calculatePokemonEffectiveness(types: string[]): {
  attacking: { type: string; multiplier: number }[]
  defending: { type: string; multiplier: number }[]
} {
  const defendingEffectiveness: Record<string, number> = {}
  Object.keys(typeEffectivenessMatrix).forEach(attackingType => {
    let multiplier = 1
    types.forEach(defendingType => {
      const effectiveness = typeEffectivenessMatrix[attackingType]?.[defendingType] || 1
      multiplier *= effectiveness
    })
    defendingEffectiveness[attackingType] = multiplier
  })
  
  const attackingEffectiveness: Record<string, number> = {}
  Object.keys(typeEffectivenessMatrix).forEach(defendingType => {
    let multiplier = 1
    types.forEach(attackingType => {
      const effectiveness = typeEffectivenessMatrix[attackingType]?.[defendingType] || 1
      multiplier *= effectiveness
    })
    attackingEffectiveness[defendingType] = multiplier
  })
  
  return {
    attacking: Object.entries(attackingEffectiveness).map(([type, multiplier]) => ({ type, multiplier })),
    defending: Object.entries(defendingEffectiveness).map(([type, multiplier]) => ({ type, multiplier }))
  }
}

export const attackTypes = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]