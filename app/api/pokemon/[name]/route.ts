import { NextRequest, NextResponse } from 'next/server'
import { pokemonService } from '@/lib/services/pokemonService'
import { ApiResponse, PokemonDetail } from '@/lib/types/pokemon'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params

    if (!name) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Pokemon name is required',
      }, { status: 400 })
    }

    const pokemon = await pokemonService.getPokemonDetails(name)

    if (!pokemon) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: `Pokemon "${name}" not found`,
      }, { status: 404 })
    }

    return NextResponse.json<ApiResponse<PokemonDetail>>({
      success: true,
      data: pokemon,
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