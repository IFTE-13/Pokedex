import Link from 'next/link'
import { ArrowLeft, Ruler, Weight, Activity, Heart, Zap, Shield, TrendingUp, Wind } from 'lucide-react'
import { PokemonDetail, typeColors } from '@/lib/pokemon'
import NotFound from '@/app/not-found'
import Image from 'next/image'
import { LucideIcon } from 'lucide-react'


const statIcons: { [key: string]: LucideIcon } = {
  hp: Heart,
  attack: Zap,
  defense: Shield,
  'special-attack': TrendingUp,
  'special-defense': Shield,
  speed: Wind,
}

const statNames: { [key: string]: string } = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

async function getPokemon(name: string): Promise<PokemonDetail | null> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`, {
      next: { revalidate: 3600 }
    })
    
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export default async function PokemonPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const pokemon = await getPokemon(name)
  
  if (!pokemon) {
    return (
      <NotFound />
    )
  }

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden">
      <div className="container mx-auto px-4 h-full">
        <div className="py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

          <div className="grid grid-cols-2 gap-12 h-full py-12">
            <div className="flex justify-center items-center h-full">
              <Image
                src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                width={400}
                height={400}
                className="w-full max-w-100 h-auto object-contain"
                priority
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-lg text-muted-foreground">#{String(pokemon.id).padStart(3, '0')}</p>
                <h1 className="text-6xl font-bold capitalize">
                  {pokemon.name}
                </h1>
                <div className="flex gap-2 flex-wrap">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`text-sm px-3 py-1 rounded-full capitalize font-medium ${typeColors[type.type.name]}`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-8 border-y border-border py-4">
                <div className="flex items-center gap-3">
                  <Ruler className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="text-xl font-semibold">{pokemon.height / 10} <span className="text-base font-normal">m</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Weight className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-xl font-semibold">{pokemon.weight / 10} <span className="text-base font-normal">kg</span></p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Base Stats
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pokemon.stats.map((stat) => {
                    const Icon = statIcons[stat.stat.name] || Activity
                    
                    const statBgColors: { [key: string]: string } = {
                        hp: 'bg-red-50 dark:bg-red-950/20',
                        attack: 'bg-orange-50 dark:bg-orange-950/20',
                        defense: 'bg-yellow-50 dark:bg-yellow-950/20',
                        'special-attack': 'bg-blue-50 dark:bg-blue-950/20',
                        'special-defense': 'bg-green-50 dark:bg-green-950/20',
                        speed: 'bg-purple-50 dark:bg-purple-950/20',
                    }
                    
                    const bgColor = statBgColors[stat.stat.name] || 'bg-gray-50 dark:bg-gray-950/20'
                    
                    return (
                        <div 
                        key={stat.stat.name} 
                        className={`flex items-center gap-3 p-3 rounded-lg ${bgColor}`}
                        >
                        <div className="w-7 shrink-0">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="w-20 sm:w-24 text-sm font-medium shrink-0">
                            {statNames[stat.stat.name] || stat.stat.name}
                        </div>
                        <div className="flex-1 text-right font-mono text-lg font-bold">
                            {stat.base_stat}
                        </div>
                        <div className="text-xs text-muted-foreground shrink-0">
                            / 255
                        </div>
                        </div>
                    )
                    })}
                </div>
             </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Abilities</h2>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((ability) => (
                    <div
                      key={ability.ability.name}
                      className="px-3 py-1 rounded-md bg-black/5 dark:bg-white/10"
                    >
                      <span className="text-sm capitalize">
                        {ability.ability.name.replace('-', ' ')}
                      </span>
                      {ability.is_hidden && (
                        <span className="text-xs ml-1 text-muted-foreground">(Hidden)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}