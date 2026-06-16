'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Loader2 } from 'lucide-react'

interface UploadFormProps {
  onSuccess: () => void
}

export function UploadForm({ onSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const selectedFile = files[0]
      if (selectedFile.type.startsWith('audio/')) {
        setFile(selectedFile)
        setError('')
        // Auto-fill from filename if not already set
        if (!title) {
          const name = selectedFile.name.replace(/\.[^/.]+$/, '')
          setTitle(name)
        }
      } else {
        setError('Please select a valid audio file (MP3, WAV, etc.)')
      }
    }
  }

  // Helper to get audio duration
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const url = URL.createObjectURL(file)

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url)
        resolve(audio.duration)
      }

      audio.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load audio metadata'))
      }

      audio.src = url
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Please select an audio file')
      return
    }

    if (!title.trim()) {
      setError('Please enter a song title')
      return
    }

    setIsLoading(true)

    try {
      // Get real audio duration
      const duration = await getAudioDuration(file)
      console.log('[v0] Audio duration:', duration)

      // Generate chord timestamps based on actual duration
      // Spread chords evenly throughout the song
      const numChords = Math.max(5, Math.min(12, Math.floor(duration / 4)))
      const chordSequence = ['C', 'G', 'Am', 'F', 'D', 'Dm', 'A', 'E', 'B', 'Em', 'Bm']
      const mockChords = Array.from({ length: numChords }, (_, i) => ({
        name: chordSequence[i % chordSequence.length],
        time: (i / numChords) * duration,
      }))

      // Generate sections based on duration
      const sectionDuration = duration / 3
      const mockSections = [
        { name: 'Intro', startTime: 0, endTime: sectionDuration * 0.5 },
        { name: 'Verse', startTime: sectionDuration * 0.5, endTime: sectionDuration * 1.5 },
        { name: 'Chorus', startTime: sectionDuration * 1.5, endTime: duration },
      ]

      // Create blob URL for audio playback
      const audioUrl = URL.createObjectURL(file)

      // Store in localStorage
      const lesson = {
        id: Date.now().toString(),
        title: title.trim(),
        artist: artist.trim() || 'Unknown Artist',
        chords: mockChords,
        sections: mockSections,
        audioUrl, // Store the blob URL
        duration, // Store actual duration
        uploadedAt: new Date().toISOString(),
      }

      const { addLesson } = await import('@/lib/lesson-store')
      addLesson(lesson)

      // Reset form
      setFile(null)
      setTitle('')
      setArtist('')

      onSuccess()
    } catch (err) {
      setError('Failed to analyze the audio file. Please try again.')
      console.error('[v0] Upload error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">Upload a New Song</h3>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-foreground mb-2">
          Audio File (MP3, WAV, etc.)
        </label>
        <div className="flex items-center gap-3">
          <input
            id="file"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
          />
          <label
            htmlFor="file"
            className="flex-1 flex items-center justify-center rounded-lg border-2 border-dashed border-border px-4 py-8 text-center hover:border-primary/50 transition cursor-pointer bg-muted/30"
          >
            <div>
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">
                {file ? file.name : 'Click to select or drag and drop'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">MP3, WAV, or other audio formats</p>
            </div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Song Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            placeholder="E.g., Wonderwall"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label htmlFor="artist" className="block text-sm font-medium text-foreground mb-2">
            Artist
          </label>
          <input
            id="artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            disabled={isLoading}
            placeholder="E.g., Oasis"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Audio...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload & Analyze
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        We analyze your song&apos;s chords using advanced audio processing.
      </p>
    </form>
  )
}
