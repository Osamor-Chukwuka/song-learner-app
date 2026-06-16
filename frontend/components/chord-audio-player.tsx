'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { getSynthesizer } from '@/lib/audio-synthesis'
import { Volume2, Play, Square } from 'lucide-react'

interface ChordAudioPlayerProps {
  chordName: string | null
  nextChordName: string | null
}

export function ChordAudioPlayer({ chordName, nextChordName }: ChordAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayChord = async () => {
    if (!chordName) return

    setIsPlaying(true)
    try {
      const synth = getSynthesizer()
      synth.resume()
      synth.playChord(chordName, 1.0)

      // Reset after sound finishes
      setTimeout(() => {
        setIsPlaying(false)
      }, 1100)
    } catch (error) {
      console.error('[v0] Error playing chord:', error)
      setIsPlaying(false)
    }
  }

  const handlePlayProgression = async () => {
    if (!chordName) return

    setIsPlaying(true)
    try {
      const synth = getSynthesizer()
      synth.resume()

      // Play current chord twice then next chord
      const progression = [
        { name: chordName, duration: 0.5 },
        { name: chordName, duration: 0.5 },
      ]

      if (nextChordName) {
        progression.push({ name: nextChordName, duration: 1.0 })
      }

      let index = 0
      let currentTime = 0

      for (const chord of progression) {
        setTimeout(() => {
          synth.playChord(chord.name, chord.duration)
        }, currentTime * 1000)

        currentTime += chord.duration
        index++
      }

      // Reset after sounds finish
      setTimeout(() => {
        setIsPlaying(false)
      }, currentTime * 1000)
    } catch (error) {
      console.error('[v0] Error playing progression:', error)
      setIsPlaying(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-semibold text-foreground">Listen to the Chord</h4>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant={isPlaying ? 'default' : 'outline'}
          onClick={handlePlayChord}
          disabled={!chordName}
          className="flex-1"
        >
          {isPlaying ? (
            <>
              <Square className="h-3 w-3 mr-1" />
              Playing...
            </>
          ) : (
            <>
              <Play className="h-3 w-3 mr-1" />
              Play Chord
            </>
          )}
        </Button>

        {nextChordName && (
          <Button
            size="sm"
            variant="outline"
            onClick={handlePlayProgression}
            disabled={!chordName || isPlaying}
          >
            Play Transition
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Click &quot;Play Chord&quot; to hear the current chord. Use &quot;Play Transition&quot; to practice switching.
      </p>
    </div>
  )
}
