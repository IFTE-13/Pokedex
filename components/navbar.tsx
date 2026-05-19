"use client"

import Link from 'next/link'
import { ThemeToggler } from './themeToggler'
import { SearchBar } from './SearchBar'
import Image from 'next/image'
import { AudioControls } from './audioControls'
import { useFavorites } from '@/context/favoritesContext'
import { Heart, GitCompare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RecentlyViewed } from './recentlyViewed'

const Navbar = () => {
  const { favoriteCount } = useFavorites()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image 
              src="/logo.png" 
              alt="logo" 
              className="h-auto w-auto" 
              height={100} 
              width={100}
              priority
            />
          </Link>
          
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <SearchBar />
            
            <Link href="/favorites">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 relative">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] sm:text-xs flex items-center justify-center">
                    {favoriteCount > 9 ? '9+' : favoriteCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <Link href="/compare">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <GitCompare className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            
            <RecentlyViewed />
            
            <AudioControls />
            
            <ThemeToggler variant="circle" fromCenter />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar