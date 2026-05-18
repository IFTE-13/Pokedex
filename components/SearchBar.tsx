"use client"

import * as React from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()
    
    if (!trimmedQuery) {
      toast("Please type a Pokemon name to search", {
        duration: 3000,
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${trimmedQuery.toLowerCase()}`)
      
      if (response.ok) {
        router.push(`/pokemon/${trimmedQuery.toLowerCase()}`)
        setSearchQuery("")
      } else {
        toast(`"${trimmedQuery}" not found`, {
          description: "Check the spelling or try another Pokemon name",
          duration: 3000,
        })
      }
    } catch {
      toast.error("Search failed", {
        description: "Network error. Please try again.",
        duration: 4000,
      })
    } finally {
      setIsLoading(false)
    }
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
        disabled={isLoading}
      />
      {isLoading && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}
    </form>
  )
}