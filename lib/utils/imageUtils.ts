

export const FALLBACK_IMAGES = {
  official: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/0.png",

  default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png",

  local: "/placeholder-pokemon.png"
}

export function getValidImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return FALLBACK_IMAGES.official
  }
  return imageUrl
}

export function hasValidImage(imageUrl: string | null | undefined): boolean {
  return !!imageUrl && imageUrl.trim() !== ''
}