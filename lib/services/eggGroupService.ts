export interface EggGroup {
  id: number
  name: string
}

interface EggGroupApiResponse {
  id: number
  name: string
  url: string
}

export interface BreedingData {
  eggGroups: EggGroup[]
  eggCycles: number
  genderRate: string
  hatchSteps: number
}

export async function getBreedingData(pokemonName: string): Promise<BreedingData | null> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
    const data = await response.json()
    
    const eggGroups = await Promise.all(
      data.egg_groups.map(async (group: EggGroupApiResponse) => {
        const groupRes = await fetch(group.url)
        return await groupRes.json()
      })
    )
    
    const genderRate = data['gender_rate']
    let genderText = 'Genderless'
    if (genderRate >= 0) {
      const femaleChance = (genderRate / 8) * 100
      const maleChance = 100 - femaleChance
      genderText = `${maleChance}% Male / ${femaleChance}% Female`
    }
    
    return {
      eggGroups: eggGroups.map(g => ({ id: g.id, name: g.name })),
      eggCycles: data.hatch_counter,
      genderRate: genderText,
      hatchSteps: data.hatch_counter * 255
    }
  } catch {
    return null
  }
}

export function areCompatible(group1: string, group2: string): boolean {
  const compatible = group1 === group2 || group1 === 'ditto' || group2 === 'ditto'
  return compatible
}