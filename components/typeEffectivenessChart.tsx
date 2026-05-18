"use client"

import { useState } from 'react'
import { 
  attackTypes,
  typeNames, 
  getEffectivenessMultiplier,
  calculatePokemonEffectiveness
} from '@/lib/services/typeEffectivenessService'
import { Shield, Swords, Info } from 'lucide-react'
import { typeColors } from '@/lib/constants/pokemon'

interface TypeEffectivenessChartProps {
  pokemonTypes: string[]
}

export function TypeEffectivenessChart({ pokemonTypes }: TypeEffectivenessChartProps) {
  const [view, setView] = useState<'defending' | 'attacking'>('defending')
  const effectiveness = calculatePokemonEffectiveness(pokemonTypes)
  const data = view === 'defending' ? effectiveness.defending : effectiveness.attacking
  
  const effectivenessMap = new Map(data.map(item => [item.type, item.multiplier]))
  
  const completeData = attackTypes.map(type => ({
    type,
    multiplier: effectivenessMap.get(type) || 1
  }))
  
  const sortedData = [...completeData].sort((a, b) => b.multiplier - a.multiplier)
  
  const weaknesses = sortedData.filter(t => t.multiplier > 1)
  const resistances = sortedData.filter(t => t.multiplier < 1 && t.multiplier > 0)
  const immunities = sortedData.filter(t => t.multiplier === 0)
  const neutral = sortedData.filter(t => t.multiplier === 1)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {view === 'defending' ? (
                <Shield className="h-5 w-5 text-blue-500" />
              ) : (
                <Swords className="h-5 w-5 text-red-500" />
              )}
              Type Effectiveness
            </h3>
            <p className="text-sm text-muted-foreground">
              {view === 'defending' 
                ? `How ${pokemonTypes.join('/').toUpperCase()} defends against attacks`
                : `How ${pokemonTypes.join('/').toUpperCase()} attacks other types`}
            </p>
          </div>
          
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setView('defending')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                view === 'defending' 
                  ? 'bg-background shadow-sm font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Defending
            </button>
            <button
              onClick={() => setView('attacking')}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                view === 'attacking' 
                  ? 'bg-background shadow-sm font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Attacking
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex flex-wrap gap-4 justify-around text-center">
          <div>
            <p className="text-2xl font-bold text-red-500">{weaknesses.length}</p>
            <p className="text-xs text-muted-foreground">Weaknesses (&gt;1x)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-500">{resistances.length}</p>
            <p className="text-xs text-muted-foreground">Resistances (&lt;1x)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-500">{immunities.length}</p>
            <p className="text-xs text-muted-foreground">Immunities (0x)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-500">{neutral.length}</p>
            <p className="text-xs text-muted-foreground">Neutral (1x)</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-3 mb-4 text-xs justify-center">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span>Weak (2x/4x)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span>Resist (½x/¼x)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gray-400" />
            <span>Immune (0x)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Neutral (1x)</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {sortedData.map(({ type, multiplier }) => {
            const { label, color, bgColor, icon } = getEffectivenessMultiplier(multiplier)
            const typeColor = typeColors[type] || 'bg-gray-500'
            
            return (
              <div
                key={type}
                className={`flex items-center justify-between p-2 rounded-lg ${bgColor} border border-border/50`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${typeColor}`} />
                  <span className="text-sm font-medium capitalize">{typeNames[type]}</span>
                </div>
                <div className={`flex items-center gap-1 font-semibold ${color}`}>
                  <span>{label}</span>
                  <span className="text-xs">{icon}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="p-3 border-t border-border bg-muted/10 text-xs text-muted-foreground flex items-start gap-2">
        <Info className="h-3 w-3 mt-0.5 shrink-0" />
        <span>
          {view === 'defending' 
            ? `Shows how ${pokemonTypes.join('/').toUpperCase()} Pokémon fare against each attack type. 
               This combines both types - a 4x weakness means both types are weak to that attack!` 
            : `Shows how ${pokemonTypes.join('/').toUpperCase()} type attacks affect each defending type. 
               STAB (Same-Type Attack Bonus) gives 1.5x damage but isn't shown here.`}
        </span>
      </div>
    </div>
  )
}