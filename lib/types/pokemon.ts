export interface PokemonBasic {
  name: string
  url: string
}

export interface PokemonCardData {
  name: string
  originalName: string
  image: string
  id: number
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  types: { type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  abilities: { ability: { name: string }; is_hidden: boolean }[]
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
    }
    front_default: string
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export interface PokemonListResponse {
  results: PokemonCardData[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    itemsPerPage: number
  }
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  itemsPerPage: number
}

export interface PokemonListData {
  results: PokemonCardData[]
  pagination: PaginationInfo
}