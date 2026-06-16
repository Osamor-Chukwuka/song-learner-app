'use client'

import { useState, useEffect, useRef } from 'react'
import { Lesson } from '@/lib/lesson-store'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PianoVisualizer } from './piano-visualizer'
import { GuitarVisualizer } from './guitar-visualizer'
import { generateChordAudio } from '@/lib/audio-synthesis'

interface LessonPlayerProps {
  lesson: Lesson
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const songAudioRef = useRef<HTMLAudioElement>(null)
  const guideAudioRef = useRef<HTMLAudioElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentChord, setCurrentChord] = useState<string | null>(null)
  const [nextChord, setNextChord] = useState<string | null>(null)
  const [currentSection, setCurrentSection] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'piano' | 'guitar'>('piano')
  
  // Volume controls
  const [songVolume, setSongVolume] = useState(0.8)
  const [guideVolume, setGuideVolume] = useState(0.6)
  const [masterVolume, setMasterVolume] = useState(1)

  // Initialize audio elements with volumes
  useEffect(() => {
    if (songAudioRef.current) {
      songAudioRef.current.volume = songVolume * masterVolume
    }
  }, [songVolume, masterVolume])

  useEffect(() => {
    if (guideAudioRef.current) {
      guideAudioRef.current.volume = guideVolume * masterVolume
    }
  }, [guideVolume, masterVolume])

  // Set initial duration from lesson
  useEffect(() => {
    setDuration(lesson.duration || 30)
    if (currentSection === '') {
      const initialSection = lesson.sections[0]?.name || 'Intro'
      setCurrentSection(initialSection)
    }
  }, [lesson])

  // Update current chord and section based on playback time
  useEffect(() => {
    const chord = lesson.chords.find((c, i) => {
      const nextChord = lesson.chords[i + 1]
      return currentTime >= c.time && (!nextChord || currentTime < nextChord.time)
    })

    const next = lesson.chords.find((c) => c.time > currentTime)

    setCurrentChord(chord?.name || null)
    setNextChord(next?.name || null)

    // Update section
    const section = lesson.sections.find((s) => currentTime >= s.startTime && currentTime < s.endTime)
    if (section) {
      setCurrentSection(section.name)
    }
  }, [currentTime, lesson])

  // Generate guide audio for current chord
  useEffect(() => {
    if (currentChord && guideAudioRef.current && isPlaying) {
      // Generate new guide audio for current chord
      const audioBuffer = generateChordAudio(currentChord, 2)
      const blob = new Blob([audioBuffer], { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)
      guideAudioRef.current.src = url
      guideAudioRef.current.play().catch(() => {
        // Silent catch - may fail if guide is disabled
      })
    }
  }, [currentChord, isPlaying])

  // Sync guide audio to song playback
  useEffect(() => {
    if (songAudioRef.current && guideAudioRef.current) {
      if (isPlaying) {
        songAudioRef.current.play().catch(() => console.log('[v0] Play blocked'))
      } else {
        songAudioRef.current.pause()
        guideAudioRef.current.pause()
      }
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    if (!songAudioRef.current) return

    if (isPlaying) {
      songAudioRef.current.pause()
      if (guideAudioRef.current) guideAudioRef.current.pause()
      setIsPlaying(false)
    } else {
      songAudioRef.current.play().catch(() => console.log('[v0] Play blocked'))
      setIsPlaying(true)
    }
  }

  const handleTimeUpdate = () => {
    if (songAudioRef.current) {
      setCurrentTime(songAudioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (songAudioRef.current) {
      const actualDuration = songAudioRef.current.duration
      if (!isNaN(actualDuration)) {
        setDuration(actualDuration)
      }
    }
  }

  const handleSeek = (time: number) => {
    if (songAudioRef.current) {
      songAudioRef.current.currentTime = time
      setCurrentTime(time)
    }
    if (guideAudioRef.current) {
      guideAudioRef.current.currentTime = time
    }
  }

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    handleSeek(newTime)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Audio elements */}
      <audio
        ref={songAudioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        src={lesson.audioUrl}
        crossOrigin="anonymous"
      />
      <audio ref={guideAudioRef} crossOrigin="anonymous" />

      {/* Main Player Card */}
      <div className="rounded-lg border border-border bg-card p-8">
        {/* Song Info */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-1">{lesson.title}</h2>
          <p className="text-lg text-muted-foreground">{lesson.artist}</p>
        </div>

        {/* Current Chord Display */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Chord */}
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <div className="text-sm text-muted-foreground mb-2">Now Playing</div>
            {currentChord ? (
              <div className="text-5xl font-bold text-primary">{currentChord}</div>
            ) : (
              <div className="text-4xl font-bold text-muted-foreground">-</div>
            )}
          </div>

          {/* Section */}
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <div className="text-sm text-muted-foreground mb-2">Section</div>
            <div className="text-3xl font-bold text-foreground">{currentSection}</div>
          </div>

          {/* Next Chord */}
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <div className="text-sm text-muted-foreground mb-2">Next Chord</div>
            {nextChord ? (
              <div className="text-4xl font-bold text-accent">{nextChord}</div>
            ) : (
              <div className="text-4xl font-bold text-muted-foreground">-</div>
            )}
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Progress bar */}
          <div
            className="h-2 rounded-full bg-muted cursor-pointer hover:h-3 transition-all"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const percent = (e.clientX - rect.left) / rect.width
              handleSeek(percent * duration)
            }}
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="mb-8 rounded-lg bg-muted/30 p-6 space-y-4">
          <div className="text-sm font-semibold text-foreground mb-4">Audio Controls</div>
          
          {/* Master Volume */}
          <div className="flex items-center gap-4">
            <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-2">Master Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume * 100}
                onChange={(e) => setMasterVolume(parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(masterVolume * 100)}%</span>
          </div>

          {/* Song Volume */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-4 text-center">
              <span className="text-xs font-medium text-primary">🎵</span>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-2">Song Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={songVolume * 100}
                onChange={(e) => setSongVolume(parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(songVolume * 100)}%</span>
          </div>

          {/* Guide Volume */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-4 text-center">
              <span className="text-xs font-medium text-accent">🎹</span>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-muted-foreground mb-2">Guide Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={guideVolume * 100}
                onChange={(e) => setGuideVolume(parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>
            <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(guideVolume * 100)}%</span>
          </div>
        </div>

        {/* Chord Timeline */}
        <div className="mb-8 rounded-lg bg-muted/30 p-4">
          <div className="text-xs text-muted-foreground mb-3 font-semibold">Chord Timeline</div>
          <div className="space-y-2">
            {lesson.chords.map((chord, i) => {
              const isActive = currentTime >= chord.time && (!lesson.chords[i + 1] || currentTime < lesson.chords[i + 1].time)
              return (
                <div key={i} className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/30 p-2 rounded transition" onClick={() => handleSeek(chord.time)}>
                  <div className={`flex items-center gap-2 ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                    {chord.name}
                  </div>
                  <span className={isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}>{formatTime(chord.time)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleSkip(-5)}
            className="px-6"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            size="lg"
            onClick={handlePlayPause}
            className="h-16 w-16 rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => handleSkip(5)}
            className="px-6"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isPlaying ? 'Now playing with guide audio...' : 'Paused'}
        </div>
      </div>

      {/* Visualizers */}
      <div className="space-y-6">
        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('piano')}
            className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'piano'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Piano
          </button>
          <button
            onClick={() => setActiveTab('guitar')}
            className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'guitar'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Guitar
          </button>
        </div>

        {/* Visualizer Content */}
        {activeTab === 'piano' && <PianoVisualizer chordName={currentChord} nextChordName={nextChord} />}
        {activeTab === 'guitar' && <GuitarVisualizer chordName={currentChord} nextChordName={nextChord} />}
      </div>

      {/* Sections Overview */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Song Sections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lesson.sections.map((section, i) => {
            const isActive = currentTime >= section.startTime && currentTime < section.endTime
            return (
              <div
                key={i}
                className={`rounded-lg p-4 cursor-pointer transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/50'
                    : 'bg-muted/50 text-foreground hover:bg-muted'
                }`}
                onClick={() => handleSeek(section.startTime)}
              >
                <div className="font-semibold">{section.name}</div>
                <div className={isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                  {formatTime(section.startTime)} - {formatTime(section.endTime)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
