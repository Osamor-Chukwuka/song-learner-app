// Simple in-memory lesson store that syncs to localStorage
export interface Lesson {
  id: string
  title: string
  artist: string
  chords: Array<{ name: string; time: number }>
  sections: Array<{ name: string; startTime: number; endTime: number }>
  audioUrl?: string
  uploadedAt: string
}

const STORAGE_KEY = 'song_learner_lessons'

export function getLesson(): Lesson[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addLesson(lesson: Lesson): void {
  if (typeof window === 'undefined') return
  try {
    const lessons = getLesson()
    lessons.push(lesson)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons))
  } catch (error) {
    console.error('[v0] Failed to save lesson:', error)
  }
}

export function deleteLesson(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const lessons = getLesson()
    const filtered = lessons.filter((l) => l.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('[v0] Failed to delete lesson:', error)
  }
}
