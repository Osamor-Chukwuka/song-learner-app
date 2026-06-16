import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Music, Zap, Target, Radio, GitBranch, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Music className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-foreground">Song Learner</span>
            </div>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Learn music faster with AI-powered analysis
          </div>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            Learn any song in minutes, not months
          </h1>
          
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto text-balance">
            Upload your favorite songs and get real-time chord detection, interactive piano and guitar visualizers, and step-by-step guided lessons. Perfect for musicians of all levels.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Start Learning Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Hero Image Area */}
        <div className="mt-16 mx-auto max-w-4xl px-4">
          <div className="relative rounded-xl border border-border bg-card p-8 shadow-lg">
            <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Music className="h-16 w-16 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Interactive lesson player preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Everything you need to master any song
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Powerful features designed to accelerate your musical learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group rounded-lg border border-border bg-card p-8 transition hover:shadow-lg hover:border-primary/50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Radio className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Real Audio Analysis</h3>
              <p className="text-muted-foreground">Upload any MP3 and we&apos;ll automatically detect chords using advanced audio processing</p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-lg border border-border bg-card p-8 transition hover:shadow-lg hover:border-primary/50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Interactive Visualizers</h3>
              <p className="text-muted-foreground">See exactly which notes to play on piano or guitar with synchronized visual feedback</p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-lg border border-border bg-card p-8 transition hover:shadow-lg hover:border-primary/50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Guided Lessons</h3>
              <p className="text-muted-foreground">Step-by-step breakdown of each section with playback controls and progress tracking</p>
            </div>

            {/* Feature 4 */}
            <div className="group rounded-lg border border-border bg-card p-8 transition hover:shadow-lg hover:border-primary/50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GitBranch className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Multiple Instruments</h3>
              <p className="text-muted-foreground">Learn the same song on different instruments with custom fingering and positions</p>
            </div>

            {/* Feature 5 */}
            <div className="group rounded-lg border border-border bg-card p-8 transition hover:shadow-lg hover:border-primary/50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Progress Tracking</h3>
              <p className="text-muted-foreground">Monitor your improvement with detailed statistics and performance analytics</p>
            </div>

            {/* Feature 6 */}
            <div className="group rounded-lg border border-border bg-card p-8 transition hover:shadow-lg hover:border-primary/50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Music className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Unlimited Songs</h3>
              <p className="text-muted-foreground">Build your personal library of songs with unlimited uploads and no restrictions</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 lg:py-28 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-foreground text-center mb-16 text-balance">
            How it works in 3 simple steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {/* Step 1 */}
            <div className="relative">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                1
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Upload Your Song</h3>
              <p className="text-muted-foreground mb-4">
                Choose an MP3 file from your computer and upload it to our platform.
              </p>
              
              {/* Connector Line */}
              <div className="hidden md:block absolute top-7 -right-12 w-12 h-1 bg-gradient-to-r from-primary to-transparent"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                2
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Get Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Our AI instantly analyzes the audio and detects all the chords and sections.
              </p>
              
              {/* Connector Line */}
              <div className="hidden md:block absolute top-7 -right-12 w-12 h-1 bg-gradient-to-r from-primary to-transparent"></div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                3
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">Start Learning</h3>
              <p className="text-muted-foreground mb-4">
                Use interactive lessons with visual guides to master the song at your pace.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/dashboard">
              <Button size="lg">Begin Your Musical Journey</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-foreground text-balance">
            Ready to transform how you learn music?
          </h2>
          <p className="mb-8 text-xl text-muted-foreground text-balance">
            Start with any song. No experience needed. Join musicians who are learning faster.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Music className="h-5 w-5" />
              </div>
              <span className="font-semibold text-foreground">Song Learner</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Song Learner. Learn any song. Master any instrument.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
