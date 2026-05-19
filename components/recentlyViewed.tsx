"use client"

import { useRecentlyViewed } from '@/context/recentlyViewedContext'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function RecentlyViewed() {
  const { recentlyViewed, clearRecentlyViewed, removeFromRecentlyViewed } = useRecentlyViewed()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 relative"
          aria-label="Recently viewed"
        >
          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          {recentlyViewed.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 text-white text-[10px] sm:text-xs flex items-center justify-center">
              {recentlyViewed.length > 9 ? '9+' : recentlyViewed.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex justify-between items-center">
            <SheetTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recently Viewed
            </SheetTitle>
            {recentlyViewed.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearRecentlyViewed}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-2">
          {recentlyViewed.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Clock className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No recently viewed Pokemon</p>
              <p className="text-sm text-muted-foreground mt-1">
                Pokemon you view will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentlyViewed.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                >
                  <Link
                    href={`/pokemon/${pokemon.name}`}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="relative w-12 h-12 shrink-0 bg-muted/20 rounded-lg p-1">
                      <Image
                        src={pokemon.image}
                        alt={pokemon.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium capitalize text-base truncate">
                        {pokemon.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        #{String(pokemon.id).padStart(3, '0')}
                      </p>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromRecentlyViewed(pokemon.id)}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    aria-label={`Remove ${pokemon.name} from recently viewed`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {recentlyViewed.length > 0 && (
          <div className="p-3 border-t border-border text-center text-xs text-muted-foreground">
            Showing {recentlyViewed.length} of 10 recently viewed Pokemon
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}