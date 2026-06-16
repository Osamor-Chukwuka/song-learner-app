'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UploadForm } from '@/components/upload-form'
import { LessonList } from '@/components/lesson-list'
import { Music, Home } from 'lucide-react'

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [showUploadSuccess, setShowUploadSuccess] = useState(false)

  const handleUploadSuccess = () => {
    setShowUploadSuccess(true)
    setRefreshKey((prev) => prev + 1)
    setTimeout(() => setShowUploadSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Music className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-foreground hidden sm:inline">Song Learner</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        {showUploadSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
            <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></div>
            Song uploaded and analyzed successfully! Start learning now.
          </div>
        )}

        {/* Page Title */}
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold text-foreground">My Learning Hub</h1>
          <p className="text-lg text-muted-foreground">Upload songs and learn with interactive chord visualizers</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <UploadForm onSuccess={handleUploadSuccess} />
            </div>
          </div>

          {/* Lessons Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Lessons</h2>
              <p className="text-muted-foreground">
                Click on a lesson to open the interactive player and start learning
              </p>
            </div>

            <LessonList key={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  )
}
