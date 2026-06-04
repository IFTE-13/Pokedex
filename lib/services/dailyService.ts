export interface DailyPokemon {
  id: number
  name: string
  image: string
  fact: string
}

const funFacts = [
  "Pikachu's original design had a smaller, rounder body and a different color scheme.",
  "Bulbasaur is the only starter that has a dual typing from its first form.",
  "Magikarp can jump over mountains using Splash, though the move has no effect in battle.",
  "Ditto can transform into any Pokemon, including legendary ones.",
  "Eevee has the most evolved forms of any Pokemon with 8 evolutions.",
  "Mew contains the DNA of every Pokemon, which is why it can learn any move.",
  "Charizard was originally designed to be a fire-breathing lizard based on Godzilla.",
  "Snorlax sleeps for 18 hours a day and can eat up to 900 pounds of food daily."
]

export async function getPokemonOfTheDay(): Promise<DailyPokemon | null> {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const pokemonId = (dayOfYear % 1025) + 1
  
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    const data = await response.json()

    
    return {
      id: pokemonId,
      name: data.name,
      image: data.sprites.other['official-artwork']?.front_default || data.sprites.front_default,
      fact: funFacts[Math.floor(Math.random() * funFacts.length)]
    }
  } catch {
    return null
  }
}