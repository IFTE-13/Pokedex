import { NextRequest, NextResponse } from 'next/server'

interface DetailedPokemon {
  id: number
  name: string
  originalName: string
  image: string
  types: string[]
  stats: { name: string; value: number }[]
  height: number
  weight: number
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    const data = await response.json()
    
    const detailedResults: DetailedPokemon[] = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const detailsRes = await fetch(pokemon.url)
        const details = await detailsRes.json()
        
        return {
          id: details.id as number,
          name: pokemon.name,
          originalName: pokemon.name,
          image: (details.sprites.other?.['official-artwork']?.front_default as string) || 
                 (details.sprites.front_default as string) || 
                 '',
          types: (details.types as Array<{ type: { name: string } }>).map(t => t.type.name),
          stats: (details.stats as Array<{ stat: { name: string }; base_stat: number }>).map(s => ({ 
            name: s.stat.name, 
            value: s.base_stat 
          })),
          height: details.height as number,
          weight: details.weight as number
        }
      })
    )

    const totalPages = Math.ceil(data.count / limit)

    return NextResponse.json({
      success: true,
      data: {
        results: detailedResults,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: data.count,
          itemsPerPage: limit
        }
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}