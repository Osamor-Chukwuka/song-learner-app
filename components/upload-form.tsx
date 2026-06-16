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
      // Simulate analysis delay (in real app, this would call the Python backend)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo: generate mock chord data
      const mockChords = [
        { name: 'C', time: 0 },
        { name: 'F', time: 4 },
        { name: 'G', time: 8 },
        { name: 'C', time: 12 },
        { name: 'Am', time: 16 },
        { name: 'F', time: 20 },
        { name: 'G', time: 24 },
      ]

      const mockSections = [
        { name: 'Intro', startTime: 0, endTime: 4 },
        { name: 'Verse', startTime: 4, endTime: 16 },
        { name: 'Chorus', startTime: 16, endTime: 28 },
      ]

      // Store in localStorage
      const lesson = {
        id: Date.now().toString(),
        title: title.trim(),
        artist: artist.trim() || 'Unknown Artist',
        chords: mockChords,
        sections: mockSections,
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
