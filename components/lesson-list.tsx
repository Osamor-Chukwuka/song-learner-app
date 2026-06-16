'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Lesson, getLesson, deleteLesson } from '@/lib/lesson-store'
import { Trash2, Play, Music } from 'lucide-react'

export function LessonList() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const stored = getLesson()
    setLessons(stored)
    setIsLoading(false)
  }, [])

  const handleDelete = (id: string) => {
    deleteLesson(id)
    setLessons((prev) => prev.filter((l) => l.id !== id))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading lessons...</div>
      </div>
    )
  }

  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Music className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">No lessons yet</h3>
        <p className="mb-6 max-w-sm text-muted-foreground">
          Upload your first song to get started learning with real-time chord detection and interactive visualizers.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition hover:shadow-md hover:border-primary/50"
        >
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-semibold text-foreground truncate">{lesson.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{lesson.artist}</p>
          </div>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Chords</div>
              <div className="font-semibold text-foreground">{lesson.chords.length}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Sections</div>
              <div className="font-semibold text-foreground">{lesson.sections.length}</div>
            </div>
          </div>

          {/* Upload time */}
          <div className="mb-4 text-xs text-muted-foreground">
            Uploaded {new Date(lesson.uploadedAt).toLocaleDateString()}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link href={`/lesson/${lesson.id}`} className="flex-1">
              <Button size="sm" className="w-full">
                <Play className="h-4 w-4 mr-1" />
                Learn
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(lesson.id)}
              className="px-3"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
