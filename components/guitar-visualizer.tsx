'use client'

import { useMemo } from 'react'
import { ChordAudioPlayer } from './chord-audio-player'

interface GuitarVisualizerProps {
  chordName: string | null
  nextChordName: string | null
}

// Standard guitar tuning: E A D G B E (from low to high)
// Chord finger positions for common open chords
const guitarChords: Record<string, Record<string, number[]>> = {
  'C': {
    E: [3], // 3rd fret
    A: [3],
    D: [2],
    G: [],  // open
    B: [1],
    e: [0], // open
  },
  'G': {
    E: [3],
    A: [0],
    D: [0],
    G: [0],
    B: [3],
    e: [3],
  },
  'D': {
    E: [0],
    A: [0],
    D: [0],
    G: [2],
    B: [3],
    e: [2],
  },
  'A': {
    E: [0],
    A: [0],
    D: [2],
    G: [2],
    B: [2],
    e: [0],
  },
  'E': {
    E: [0],
    A: [0],
    D: [1],
    G: [2],
    B: [2],
    e: [0],
  },
  'Am': {
    E: [0],
    A: [0],
    D: [2],
    G: [2],
    B: [1],
    e: [0],
  },
  'Em': {
    E: [0],
    A: [0],
    D: [2],
    G: [2],
    B: [0],
    e: [0],
  },
  'Dm': {
    E: [0],
    A: [0],
    D: [0],
    G: [2],
    B: [3],
    e: [1],
  },
}

const strings = [
  { name: 'E (Low)', tuning: 'E', color: 'from-yellow-600 to-yellow-500' },
  { name: 'A', tuning: 'A', color: 'from-green-600 to-green-500' },
  { name: 'D', tuning: 'D', color: 'from-blue-600 to-blue-500' },
  { name: 'G', tuning: 'G', color: 'from-purple-600 to-purple-500' },
  { name: 'B', tuning: 'B', color: 'from-pink-600 to-pink-500' },
  { name: 'E (High)', tuning: 'e', color: 'from-red-600 to-red-500' },
]

export function GuitarVisualizer({ chordName, nextChordName }: GuitarVisualizerProps) {
  const positions = useMemo(() => {
    if (!chordName) return null
    const baseNote = chordName.replace(/[m7add9].*$/, '')
    return guitarChords[baseNote] || null
  }, [chordName])

  const nextPositions = useMemo(() => {
    if (!nextChordName) return null
    const baseNote = nextChordName.replace(/[m7add9].*$/, '')
    return guitarChords[baseNote] || null
  }, [nextChordName])

  return (
    <div className="space-y-6">
      {/* Current Chord Guitar Neck */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">NOW PLAYING</h3>
          {chordName ? (
            <p className="text-2xl font-bold text-foreground">{chordName}</p>
          ) : (
            <p className="text-lg text-muted-foreground">No chord playing</p>
          )}
        </div>

        {chordName && positions ? (
          <div className="space-y-3">
            {/* Guitar neck visualization */}
            {strings.map((string) => {
              const frets = positions[string.tuning as keyof typeof positions] || []
              return (
                <div key={string.tuning} className="space-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{string.name}</span>
                  </div>

                  {/* String with frets */}
                  <div className="flex items-center gap-1">
                    {/* Open or muted indicator */}
                    <div className="w-12">
                      {frets.length === 0 ? (
                        <div className="text-xs font-bold text-green-600 dark:text-green-400">OPEN</div>
                      ) : (
                        <div className="text-xs font-bold text-muted-foreground">-</div>
                      )}
                    </div>

                    {/* Fret positions (show up to 7th fret) */}
                    {[1, 2, 3, 4, 5, 6, 7].map((fret) => {
                      const hasNote = frets.includes(fret)
                      return (
                        <div
                          key={fret}
                          className={`flex-1 h-12 rounded flex items-center justify-center font-bold text-sm transition-all ${
                            hasNote
                              ? `bg-gradient-to-b ${string.color} text-white shadow-lg`
                              : 'bg-muted border border-border hover:bg-muted/80'
                          }`}
                        >
                          {hasNote && '●'}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* Fret numbers */}
            <div className="mt-6 flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-12" />
              {[1, 2, 3, 4, 5, 6, 7].map((fret) => (
                <div key={fret} className="flex-1 text-center">
                  {fret}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-48 rounded-lg bg-muted/30 flex items-center justify-center">
            <p className="text-muted-foreground">Select a chord to see the fingering</p>
          </div>
        )}
      </div>

      {/* Next Chord Preview */}
      {nextChordName && nextPositions && (
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-muted-foreground">NEXT CHORD</h4>
            <p className="text-lg font-semibold text-accent">{nextChordName}</p>
          </div>

          <div className="space-y-2">
            {strings.map((string) => {
              const frets = nextPositions[string.tuning as keyof typeof nextPositions] || []
              return (
                <div key={string.tuning} className="flex items-center gap-1">
                  <div className="w-12 text-xs font-medium text-muted-foreground">{string.name.split(' ')[0]}</div>
                  {[1, 2, 3, 4, 5, 6, 7].map((fret) => (
                    <div
                      key={fret}
                      className={`flex-1 aspect-square rounded transition-all ${
                        frets.includes(fret)
                          ? `bg-gradient-to-b ${string.color}`
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Audio Player */}
      <ChordAudioPlayer chordName={chordName} nextChordName={nextChordName} />

      {/* Info */}
      <div className="rounded-lg bg-muted/30 p-4">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 The circles show which frets to press. &quot;OPEN&quot; means play the string without pressing.</p>
          <p>Practice switching between chords smoothly for better results.</p>
        </div>
      </div>
    </div>
  )
}
