"use client"

import { useState, useCallback } from 'react'
import QRCode from 'qrcode'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { QrCode, Download, Share2, Check } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface PokemonQRCodeProps {
  pokemonName: string
  pokemonId: number
}

export function PokemonQRCode({ pokemonName, pokemonId }: PokemonQRCodeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const pokemonUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/pokemon/${pokemonName}`
    : ''

  const generateQRCode = useCallback(async () => {
    setIsGenerating(true)
    try {
      const url = await QRCode.toDataURL(pokemonUrl, {
        width: 250,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      })
      setQrDataUrl(url)
    } catch {
      toast.error('Failed to generate QR code')
    } finally {
      setIsGenerating(false)
    }
  }, [pokemonUrl])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && pokemonUrl && !qrDataUrl && !isGenerating) {
      generateQRCode()
    }
  }

  const handleDownloadQR = () => {
    if (qrDataUrl) {
      const link = document.createElement('a')
      link.download = `${pokemonName}-qr-code.png`
      link.href = qrDataUrl
      link.click()
      toast.success(`QR Code for ${pokemonName} downloaded!`)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pokemonUrl)
      setCopied(true)
      toast.success(`Link copied to clipboard!`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pokemonName} - Pokédex`,
          text: `Check out ${pokemonName} on my Pokédex!`,
          url: pokemonUrl,
        })
        toast.success(`Shared ${pokemonName}!`)
      } catch {
        toast.error('Failed to share')
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleOpenChange(true)}
        className="gap-2"
      >
        <QrCode className="h-4 w-4" />
        QR Code
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center capitalize mt-4 text-xl">
              {pokemonName}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className='text-center'>Scan to view the details about the Pokemon</DialogDescription>
          
          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              {qrDataUrl ? (
                <Image
                  src={qrDataUrl}
                  alt={`QR Code for ${pokemonName}`}
                  width={250}
                  height={250}
                  className="w-62.5 h-62.5"
                  unoptimized
                />
              ) : (
                <div className="w-62.5 h-62.5 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                  <QrCode className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">
                Scan to view {pokemonName}
              </p>
              <p className="text-xs text-muted-foreground">
                ID: #{String(pokemonId).padStart(3, '0')}
              </p>
            </div>

            <div className="flex gap-2 w-full">
              <Button
                onClick={handleDownloadQR}
                variant="outline"
                className="flex-1 gap-2"
                disabled={!qrDataUrl}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 gap-2"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {copied ? 'Copied!' : 'Share'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}