"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    // Optional: Check if Pokemon exists before navigating
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`)
      if (response.ok) {
        router.push(`/pokemon/${searchQuery.toLowerCase()}`)
      } else {
        // Show a toast or alert that Pokemon doesn't exist
        alert(`"${searchQuery}" is not a valid Pokemon name!`)
      }
    } catch {
      alert(`Could not find Pokemon "${searchQuery}"`)
    }
    
    setSearchQuery("")
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search Pokemon..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-50 md:w-62.5 pl-9"
      />
    </form>
  )
}