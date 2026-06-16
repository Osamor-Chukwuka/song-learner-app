'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LessonPlayer } from '@/components/lesson-player'
import { Lesson, getLesson } from '@/lib/lesson-store'
import { Home, ChevronLeft, Volume2 } from 'lucide-react'

export default function LessonPage() {
  const params = useParams()
  const id = params.id as string
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const lessons = getLesson()
      const found = lessons.find((l) => l.id === id)
      if (found) {
        setLesson(found)
      } else {
        setError('Lesson not found')
      }
    } catch (err) {
      setError('Failed to load lesson')
      console.error('[v0] Failed to load lesson:', err)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading lesson...</div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block rounded-lg bg-muted p-3 mb-4">
              <Volume2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{error}</h1>
            <p className="text-muted-foreground mb-6">The lesson you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-foreground truncate">{lesson.title}</h1>
              <p className="text-xs text-muted-foreground truncate">{lesson.artist}</p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <LessonPlayer lesson={lesson} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 px-4 py-8 mt-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm text-muted-foreground">
            💡 Tip: Click on the timeline to jump to any chord, or use the skip buttons to navigate.
          </p>
        </div>
      </footer>
    </div>
  )
}
