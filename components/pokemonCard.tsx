"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { getValidImageUrl, FALLBACK_IMAGES } from '@/lib/utils/imageUtils'

interface PokemonCardProps {
  name: string
  image: string
  id: number
  originalName: string
}

export function PokemonCard({ name, image, id, originalName }: PokemonCardProps) {
  const [imgError, setImgError] = useState(false)
  
  const imageSrc = imgError ? FALLBACK_IMAGES.official : getValidImageUrl(image)

  return (
    <Link href={`/pokemon/${originalName}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square relative mb-3">
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-contain"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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