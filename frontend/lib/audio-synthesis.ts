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

/**
 * Generate chord audio as a WAV file (Uint8Array)
 * Returns raw WAV data that can be played as audio
 */
export function generateChordAudio(chordName: string, durationSeconds: number = 2): Uint8Array {
  const sampleRate = 44100
  const frameCount = sampleRate * durationSeconds
  const channels = 1
  const bitsPerSample = 16

  // Get the notes for this chord
  const notes = chordNotes[chordName] || ['C', 'E', 'G']

  // Create audio data
  const audioData = new Float32Array(frameCount)

  // Generate waveform by summing sine waves for each note
  for (let i = 0; i < frameCount; i++) {
    let sample = 0
    const t = i / sampleRate

    // Add each note with envelope
    notes.forEach((note) => {
      const freq = noteFrequencies[note] || 440
      const envelope = Math.exp(-t * 1.5) // Exponential decay
      sample += Math.sin(2 * Math.PI * freq * t) * envelope * 0.3
    })

    // Apply attack/release envelope
    const attackTime = 0.05
    const releaseTime = durationSeconds - 0.1
    let envValue = 1

    if (t < attackTime) {
      envValue = t / attackTime // Attack
    } else if (t > releaseTime) {
      envValue = Math.max(0, (durationSeconds - t) / 0.1) // Release
    }

    audioData[i] = (sample / notes.length) * envValue * 0.8
  }

  // Convert to PCM
  const pcm = encodeWAV(audioData, sampleRate, channels, bitsPerSample)
  return pcm
}

/**
 * Encode Float32 audio data to WAV format
 */
function encodeWAV(
  audioData: Float32Array,
  sampleRate: number,
  channels: number,
  bitsPerSample: number
): Uint8Array {
  const bytesPerSample = bitsPerSample / 8
  const blockAlign = channels * bytesPerSample
  const byteRate = sampleRate * blockAlign

  // Create the WAV file
  const WAV_HEADER_SIZE = 44
  const fileSize = audioData.length * bytesPerSample + WAV_HEADER_SIZE - 8

  const buffer = new ArrayBuffer(WAV_HEADER_SIZE + audioData.length * bytesPerSample)
  const view = new DataView(buffer)

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, fileSize, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true) // Subchunk1Size
  view.setUint16(20, 1, true) // AudioFormat (1 = PCM)
  view.setUint16(22, channels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)
  writeString(36, 'data')
  view.setUint32(40, audioData.length * bytesPerSample, true)

  // Write audio data
  let offset = WAV_HEADER_SIZE
  for (let i = 0; i < audioData.length; i++) {
    const s = Math.max(-1, Math.min(1, audioData[i])) // Clamp
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    offset += bytesPerSample
  }

  return new Uint8Array(buffer)
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
