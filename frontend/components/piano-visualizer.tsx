'use client'

import { useMemo } from 'react'
import { ChordAudioPlayer } from './chord-audio-player'

interface PianoVisualizerProps {
  chordName: string | null
  nextChordName: string | null
}

// Chord to note mappings for piano visualization
const chordToNotes: Record<string, string[]> = {
  'C': ['C', 'E', 'G'],
  'C#': ['C#', 'F', 'G#'],
  'D': ['D', 'F#', 'A'],
  'D#': ['D#', 'G', 'A#'],
  'E': ['E', 'G#', 'B'],
  'F': ['F', 'A', 'C'],
  'F#': ['F#', 'A#', 'C#'],
  'G': ['G', 'B', 'D'],
  'G#': ['G#', 'C#', 'D#'],
  'A': ['A', 'C#', 'E'],
  'A#': ['A#', 'D', 'F'],
  'B': ['B', 'D#', 'F#'],
  'Cm': ['C', 'D#', 'G'],
  'Dm': ['D', 'F', 'A'],
  'Em': ['E', 'G', 'B'],
  'Fm': ['F', 'G#', 'C'],
  'Gm': ['G', 'A#', 'D'],
  'Am': ['A', 'C', 'E'],
}

const pianoKeys = [
  { note: 'C', isBlack: false },
  { note: 'C#', isBlack: true },
  { note: 'D', isBlack: false },
  { note: 'D#', isBlack: true },
  { note: 'E', isBlack: false },
  { note: 'F', isBlack: false },
  { note: 'F#', isBlack: true },
  { note: 'G', isBlack: false },
  { note: 'G#', isBlack: true },
  { note: 'A', isBlack: false },
  { note: 'A#', isBlack: true },
  { note: 'B', isBlack: false },
]

export function PianoVisualizer({ chordName, nextChordName }: PianoVisualizerProps) {
  const currentNotes = useMemo(() => {
    if (!chordName) return []
    // Extract base note (e.g., "Am" -> "A", "C#" -> "C#")
    const baseNote = chordName.replace(/[m7add9].*$/, '')
    return chordToNotes[baseNote] || []
  }, [chordName])

  const nextNotes = useMemo(() => {
    if (!nextChordName) return []
    const baseNote = nextChordName.replace(/[m7add9].*$/, '')
    return chordToNotes[baseNote] || []
  }, [nextChordName])

  return (
    <div className="space-y-6">
      {/* Current Chord Piano */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">NOW PLAYING</h3>
          {chordName ? (
            <p className="text-2xl font-bold text-foreground">{chordName}</p>
          ) : (
            <p className="text-lg text-muted-foreground">No chord playing</p>
          )}
        </div>

        {chordName ? (
          <div className="overflow-x-auto">
            <div className="inline-flex gap-0 relative" style={{ minWidth: '100%' }}>
              {/* Piano Keys */}
              {pianoKeys.map((key, idx) => {
                const isActive = currentNotes.includes(key.note)
                return (
                  <div key={idx} className="relative">
                    {key.isBlack ? (
                      <div
                        className={`w-8 h-24 rounded-b transition-all ${
                          isActive
                            ? 'bg-primary shadow-lg shadow-primary/50'
                            : 'bg-foreground/80 hover:bg-foreground'
                        }`}
                        style={{ marginLeft: '-16px', marginRight: '-16px' }}
                      >
                        {isActive && (
                          <div className="absolute inset-0 flex items-end justify-center pb-2">
                            <div className="text-xs font-bold text-primary-foreground">{key.note}</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`w-12 h-32 border-2 rounded-b transition-all ${
                          isActive
                            ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30'
                            : 'bg-white border-border hover:bg-muted dark:bg-card dark:border-border'
                        }`}
                      >
                        {isActive && (
                          <div className="h-full flex items-end justify-center pb-3">
                            <div className="text-sm font-bold text-primary-foreground">{key.note}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="h-40 rounded-lg bg-muted/30 flex items-center justify-center">
            <p className="text-muted-foreground">Select a chord to see the keys</p>
          </div>
        )}
      </div>

      {/* Next Chord Preview */}
      {nextChordName && (
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-muted-foreground">NEXT CHORD</h4>
            <p className="text-lg font-semibold text-accent">{nextChordName}</p>
          </div>

          <div className="flex gap-1">
            {pianoKeys.map((key, idx) => {
              const isActive = nextNotes.includes(key.note)
              return (
                <div key={idx} className="flex-1">
                  {key.isBlack ? (
                    <div
                      className={`w-full aspect-square rounded transition-all ${
                        isActive ? 'bg-accent' : 'bg-foreground/40'
                      }`}
                      style={{ maxWidth: '24px' }}
                    />
                  ) : (
                    <div
                      className={`w-full aspect-square rounded transition-all border ${
                        isActive
                          ? 'bg-accent border-accent'
                          : 'bg-muted border-border'
                      }`}
                    />
                  )}
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
          <p>💡 The keys highlighted above are the ones you need to play for this chord.</p>
          <p>Try playing them on a real piano or keyboard to practice the chord shapes.</p>
        </div>
      </div>
    </div>
  )
}
