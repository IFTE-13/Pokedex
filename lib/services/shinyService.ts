export interface ShinyData {
  normal: string
  shiny: string
}

export async function getShinySprites(pokemonName: string): Promise<ShinyData> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    const data = await response.json()
    
    return {
      normal: data.sprites.other['official-artwork']?.front_default || data.sprites.front_default,
      shiny: data.sprites.other['official-artwork']?.front_shiny || data.sprites.front_shiny
    }
  } catch {
    return { normal: '', shiny: '' }
  }
}