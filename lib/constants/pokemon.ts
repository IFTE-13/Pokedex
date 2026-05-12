export const typeColors: Record<string, string> = {
  normal: 'bg-gray-400 text-white',
  fire: 'bg-orange-500 text-white',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-gray-900',
  grass: 'bg-green-500 text-white',
  ice: 'bg-cyan-400 text-gray-900',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-purple-500 text-white',
  ground: 'bg-amber-600 text-white',
  flying: 'bg-indigo-400 text-white',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-white',
  rock: 'bg-stone-500 text-white',
  ghost: 'bg-purple-700 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-gray-700 text-white',
  steel: 'bg-gray-500 text-white',
  fairy: 'bg-pink-300 text-gray-900',
}

export const statNames: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

export const POKEMON_API = {
  BASE_URL: process.env.POKEMON_API_BASE_URL || 'https://pokeapi.co/api/v2',
  ENDPOINTS: {
    POKEMON: '/pokemon',
    SPECIES: '/pokemon-species',
  },
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
}