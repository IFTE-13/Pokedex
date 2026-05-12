import { NextRequest, NextResponse } from 'next/server'
import { pokemonService } from '@/lib/services/pokemonService'
import { ApiResponse, PokemonListData } from '@/lib/types/pokemon'
import { POKEMON_API } from '@/lib/constants/pokemon'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || POKEMON_API.DEFAULT_LIMIT.toString())
    const offset = (page - 1) * limit

    if (limit > POKEMON_API.MAX_LIMIT) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: `Limit cannot exceed ${POKEMON_API.MAX_LIMIT}`,
      }, { status: 400 })
    }

    const [pokemonList, totalData] = await Promise.all([
      pokemonService.getLocalizedPokemonList(limit, offset),
      pokemonService.getPokemonList(1, 0),
    ])

    const totalCount = totalData?.count || 0
    const totalPages = Math.ceil(totalCount / limit)

    const responseData: PokemonListData = {
      results: pokemonList,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        itemsPerPage: limit,
      },
    }

    return NextResponse.json<ApiResponse<PokemonListData>>({
      success: true,
      data: responseData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 })
  }
}