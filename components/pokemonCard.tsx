"use client"

import Image from 'next/image'
import Link from 'next/link'

interface PokemonCardProps {
  name: string
  image: string
  id: number
  originalName: string
}

export function PokemonCard({ name, image, id, originalName }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${originalName}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border border-border/50 hover:border-primary/50">
        <div className="aspect-square relative mb-3">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            loading="eager"
          />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">#{String(id).padStart(3, '0')}</p>
          <h2 className="font-medium capitalize">{name}</h2>
        </div>
      </div>
    </Link>
  )
}