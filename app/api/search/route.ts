import { NextRequest, NextResponse } from 'next/server'
import { pokemonService } from '@/lib/services/pokemonService'
import { ApiResponse, PokemonDetail } from '@/lib/types/pokemon'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Search query must be at least 2 characters',
      }, { status: 400 })
    }

    const pokemon = await pokemonService.getPokemonDetails(query)

    if (pokemon) {
      return NextResponse.json<ApiResponse<PokemonDetail>>({
        success: true,
        data: pokemon,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: `Pokemon "${query}" not found`,
    }, { status: 404 })
  } catch (error) {
    console.error('Search API Error:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}