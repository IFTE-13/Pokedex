"use client"

import Link from 'next/link'
import { ThemeToggler } from './themeToggler'
import { SearchBar } from './SearchBar'
import Image from 'next/image'
import { AudioControls } from './audioControls'

const Navbar = () => {
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
          
          <div className="flex items-center gap-2 shrink-0">
            <SearchBar />
            <AudioControls />
            <ThemeToggler variant={"circle"} fromCenter />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar