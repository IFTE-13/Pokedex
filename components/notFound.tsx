"use client"

import Link from 'next/link'
import { ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFoundComp() {
  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="relative inline-block mb-4">
          <h1 className="text-8xl font-bold text-gray-800 dark:text-gray-200 animate-pulse">
            4
            <span className="inline-block animate-bounce-inline">0</span>
            4
          </h1>
        </div>
        
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2 animate-fade-in">
          Pokemon Not Found!
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-8 animate-fade-in-up delay-100">
          The Pokemon you&apos;re looking for doesn&apos;t exist or has evolved into something else.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all hover:scale-105 active:scale-95"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
          >
            <Search className="h-4 w-4" />
            Search Pokemon
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}