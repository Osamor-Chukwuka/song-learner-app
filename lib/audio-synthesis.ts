// Web Audio API based audio synthesis for chord playback

// Note frequencies in Hz (A4 = 440 Hz standard)
const noteFrequencies: Record<string, number> = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.0,
  'G#': 415.3,
  'A': 440.0,
  'A#': 466.16,
  'B': 493.88,
}

// Chord note mappings
const chordNotes: Record<string, string[]> = {
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

export class AudioSynthesizer {
  private audioContext: AudioContext
  private masterGain: GainNode

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.masterGain = this.audioContext.createGain()
    this.masterGain.gain.value = 0.3 // Keep volume modest
    this.masterGain.connect(this.audioContext.destination)
  }

  /**
   * Play a single note for a specified duration
   */
  playNote(noteName: string, duration: number = 0.5) {
    const frequency = noteFrequencies[noteName]
    if (!frequency) return

    const oscillator = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    // Simple amplitude envelope for smoother sound
    gain.gain.setValueAtTime(0, this.audioContext.currentTime)
    gain.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.connect(gain)
    gain.connect(this.masterGain)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  /**
   * Play a chord (all notes simultaneously)
   */
  playChord(chordName: string, duration: number = 1.0) {
    const notes = chordNotes[chordName]
    if (!notes) return

    notes.forEach((note) => {
      this.playNote(note, duration)
    })
  }

  /**
   * Play chord progression with timing
   */
  async playProgression(
    chords: Array<{ name: string; duration: number }>,
    onChordChange?: (chordName: string, index: number) => void
  ) {
    let currentTime = this.audioContext.currentTime

    for (let i = 0; i < chords.length; i++) {
      const chord = chords[i]

      // Schedule the chord to play
      setTimeout(() => {
        this.playChord(chord.name, chord.duration)
        onChordChange?.(chord.name, i)
      }, (currentTime - this.audioContext.currentTime + (i > 0 ? chords[i - 1].duration : 0)) * 1000)

      currentTime += chord.duration
    }
  }

  /**
   * Stop all currently playing sounds
   */
  stop() {
    this.audioContext.suspend()
  }

  /**
   * Resume audio context (required after user interaction)
   */
  resume() {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number) {
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume * 0.3))
  }
}

// Create a singleton instance
let synthesizer: AudioSynthesizer | null = null

export function getSynthesizer(): AudioSynthesizer {
  if (!synthesizer) {
    synthesizer = new AudioSynthesizer()
  }
  return synthesizer
}

/**
 * Generate a demo audio URL for testing
 * Returns a data URL with a simple tone
 */
export function generateDemoAudioUrl(): string {
  // Generate a simple sine wave using Web Audio API
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const sampleRate = audioContext.sampleRate
  const duration = 30 // 30 seconds
  const channels = 1
  const frameCount = audioContext.sampleRate * duration

  const audioBuffer = audioContext.createAudioBuffer(channels, frameCount, sampleRate)
  const audioData = audioBuffer.getChannelData(0)

  // Generate a simple tone
  const frequency = 440 // A4
  for (let i = 0; i < frameCount; i++) {
    audioData[i] = Math.sin((i / sampleRate) * frequency * 2 * Math.PI) * 0.3
  }

  return ''
}
