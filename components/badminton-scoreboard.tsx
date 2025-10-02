"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface Match {
  id: string
  matchNumber: number
  player1: string
  player2: string
  category: "u9" | "u11" | "u13" | "13+"
  round: string
  status: "upcoming" | "live" | "completed"
  score?: string
  winner?: string
  startTime?: string
  endTime?: string
}

interface MediaItem {
  id: string
  type: "image" | "video"
  src: string
  title: string
  description?: string
}

interface ApiResponse {
  success: boolean
  data: Match[]
  total: number
  timestamp: string
}

const sampleMedia: MediaItem[] = [
  { id: "1", type: "image", src: "/badminton-championship-trophy-ceremony.jpg", title: "Championship Trophy Ceremony" },
  { id: "2", type: "image", src: "/badminton-players-celebrating-victory.jpg", title: "Victory Celebration" },
  { id: "3", type: "image", src: "/badminton-match-action-shot.jpg", title: "Intense Match Action" },
  { id: "4", type: "image", src: "/badminton-crowd-cheering.jpg", title: "Crowd Support" },
  { id: "5", type: "image", src: "/badminton-player-serving.jpg", title: "Perfect Serve" },
  { id: "6", type: "image", src: "/badminton-doubles-team-high-five.jpg", title: "Team Spirit" },
  { id: "7", type: "image", src: "/badminton-medal-ceremony.jpg", title: "Medal Ceremony" },
  { id: "8", type: "image", src: "/badminton-court-aerial-view.jpg", title: "Tournament Overview" },
  { id: "9", type: "image", src: "/badminton-player-jumping-smash.jpg", title: "Power Smash" },
  { id: "10", type: "image", src: "/badminton-referee-making-call.jpg", title: "Official Decision" },
  { id: "11", type: "image", src: "/badminton-warm-up-session.jpg", title: "Pre-Match Preparation" },
  { id: "12", type: "image", src: "/badminton-fans-with-flags.jpg", title: "Fan Support" },
  { id: "13", type: "image", src: "/badminton-player-interview.jpg", title: "Post-Match Interview" },
  { id: "14", type: "image", src: "/badminton-tournament-sponsors.jpg", title: "Tournament Sponsors" },
  { id: "15", type: "image", src: "/badminton-closing-ceremony.jpg", title: "Closing Ceremony" },
]

export default function BadmintonScoreboard() {
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [currentView, setCurrentView] = useState<"scoreboard" | "media">("scoreboard")
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [viewTimer, setViewTimer] = useState(0)

  const [recentMatches, setRecentMatches] = useState<Match[]>([])
  const [liveMatches, setLiveMatches] = useState<Match[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [animateRecent, setAnimateRecent] = useState(false)
  const [animateUpcoming, setAnimateUpcoming] = useState(false)
  const [recentLoaded, setRecentLoaded] = useState(false)
  const [liveLoaded, setLiveLoaded] = useState(false)
  const [upcomingLoaded, setUpcomingLoaded] = useState(false)

  const recentAnimTimeout = useRef<number | null>(null)
  const upcomingAnimTimeout = useRef<number | null>(null)

  const fetchMatches = async () => {
    try {
      setError(null)

      // Kick off requests in parallel and handle each as it resolves
      const recentPromise = fetch("/api/matches?status=completed&limit=10")
        .then((r) => r.json() as Promise<ApiResponse>)
        .then((recentData) => {
          if (recentData.success) {
            const recentChanged = JSON.stringify(recentMatches) !== JSON.stringify(recentData.data)
            if (recentChanged) {
              setRecentMatches(recentData.data)
              setAnimateRecent(true)
              if (recentAnimTimeout.current) window.clearTimeout(recentAnimTimeout.current)
              recentAnimTimeout.current = window.setTimeout(() => setAnimateRecent(false), 900)
            }
            setRecentLoaded(true)
          }
        })
        .catch((err) => {
          console.error("[v0] recent fetch error:", err)
          setError("Failed to fetch recent matches")
        })

      const livePromise = fetch("/api/matches?status=live")
        .then((r) => r.json() as Promise<ApiResponse>)
        .then((liveData) => {
          if (liveData.success) {
            const liveChanged = JSON.stringify(liveMatches) !== JSON.stringify(liveData.data)
            if (liveChanged) {
              setLiveMatches(liveData.data)
              // recent row includes live; trigger recent animation too
              setAnimateRecent(true)
              if (recentAnimTimeout.current) window.clearTimeout(recentAnimTimeout.current)
              recentAnimTimeout.current = window.setTimeout(() => setAnimateRecent(false), 900)
            }
            setLiveLoaded(true)
          }
        })
        .catch((err) => {
          console.error("[v0] live fetch error:", err)
          setError("Failed to fetch live matches")
        })

      const upcomingPromise = fetch("/api/matches?status=upcoming&limit=6")
        .then((r) => r.json() as Promise<ApiResponse>)
        .then((upcomingData) => {
          if (upcomingData.success) {
            const upcomingChanged = JSON.stringify(upcomingMatches) !== JSON.stringify(upcomingData.data)
            if (upcomingChanged) {
              setUpcomingMatches(upcomingData.data)
              setAnimateUpcoming(true)
              if (upcomingAnimTimeout.current) window.clearTimeout(upcomingAnimTimeout.current)
              upcomingAnimTimeout.current = window.setTimeout(() => setAnimateUpcoming(false), 900)
            }
            setUpcomingLoaded(true)
          }
        })
        .catch((err) => {
          console.error("[v0] upcoming fetch error:", err)
          setError("Failed to fetch upcoming matches")
        })

      // Wait for all to settle (but sections already updated as they finish)
      await Promise.allSettled([recentPromise, livePromise, upcomingPromise])
    } catch (err) {
      console.error("[v0] Error in fetchMatches:", err)
      setError("Network error while fetching matches")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()

    const dataRefreshInterval = setInterval(fetchMatches, 15000)

    return () => {
      clearInterval(dataRefreshInterval)
      if (recentAnimTimeout.current) window.clearTimeout(recentAnimTimeout.current)
      if (upcomingAnimTimeout.current) window.clearTimeout(upcomingAnimTimeout.current)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setViewTimer((prev) => {
        const newTimer = prev + 1

        if (currentView === "scoreboard" && newTimer >= 30) {
          setCurrentView("media")
          return 0
        } else if (currentView === "media" && newTimer >= 20) {
          setCurrentView("scoreboard")
          setCurrentMediaIndex((prevIndex) => (prevIndex + 1) % sampleMedia.length)
          return 0
        }

        return newTimer
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentView])

  useEffect(() => {
    if (upcomingMatches.length > 0) {
      const interval = setInterval(() => {
        setCurrentTickerIndex((prev) => (prev + 1) % Math.max(1, upcomingMatches.length - 1))
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [upcomingMatches.length])

  const formatResult = (match: Match) => {
    return (
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg tracking-wider text-foreground">{match.player1}</span>
        <span className="text-muted-foreground font-light">vs</span>
        <span className="font-bold text-lg tracking-wider text-foreground">{match.player2}</span>
        <span className="text-accent font-semibold text-base mx-2">•</span>
        <span className="text-primary font-bold text-lg tracking-wider">{match.score}</span>
      </div>
    )
  }

  const MediaSlideshow = () => {
    const currentMedia = sampleMedia[currentMediaIndex]
    const progress = (viewTimer / 20) * 100

    return (
      <div className="w-full max-w-8xl mx-auto p-6 min-h-screen bg-gradient-to-br from-background via-background to-card flex flex-col">
        <div className="relative flex items-center justify-between mb-8 px-4">
          <div className="w-20 h-20 md:w-24 md:h-24 gradient-bg border border-primary/30 rounded-2xl flex items-center justify-center shadow-2xl float-effect">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl"></div>
          </div>

          <div className="flex-1 text-center px-8">
            <div className="relative">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent uppercase tracking-[0.2em] font-mono">
                <span className="inline-block">Super Cup</span>
                <span className="inline-block text-2xl md:text-4xl mx-4">-</span>
                <span className="inline-block">Season 03</span>
              </h1>
              <div className="w-32 h-1 mx-auto mt-4 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-80"></div>
            </div>
          </div>

          <div className="w-20 h-20 md:w-24 md:h-24 gradient-bg border border-primary/30 rounded-2xl flex items-center justify-center shadow-2xl float-effect">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl"></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <Card className="relative overflow-hidden gradient-bg border-primary/20 shadow-2xl backdrop-blur-xl max-w-6xl w-full">
            <div className="relative">
              <img
                src={currentMedia.src || "/placeholder.svg"}
                alt={currentMedia.title}
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{currentMedia.title}</h3>
                {currentMedia.description && (
                  <p className="text-lg text-white/90 drop-shadow-lg">{currentMedia.description}</p>
                )}
              </div>

              <div className="absolute top-0 left-0 right-0 h-1 bg-black/30">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-white font-bold">
                  {currentMediaIndex + 1} / {sampleMedia.length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (currentView === "media") {
    return <MediaSlideshow />
  }

  if (error) {
    return (
      <div className="w-full max-w-8xl mx-auto p-6 min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={fetchMatches}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-8xl mx-auto p-6 space-y-8 min-h-screen bg-gradient-to-br from-background via-background to-card">
      <div className="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
        <span className="text-white font-bold text-sm">
          {currentView === "scoreboard"
            ? `Next ad in: ${30 - viewTimer}s`
            : `Back to scoreboard in: ${20 - viewTimer}s`}
        </span>
      </div>

      <div className="relative flex items-center justify-between mb-8 px-4">
        <div className="w-20 h-20 md:w-24 md:h-24 gradient-bg border border-primary/30 rounded-2xl flex items-center justify-center shadow-2xl float-effect">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl"></div>
        </div>

        <div className="flex-1 text-center px-8">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent uppercase tracking-[0.2em] font-mono">
              <span className="inline-block">Super Cup</span>
              <span className="inline-block text-2xl md:text-4xl mx-4">-</span>
              <span className="inline-block">Season 03</span>
            </h1>
            <div className="w-32 h-1 mx-auto mt-4 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-80"></div>
          </div>
        </div>

        <div className="w-20 h-20 md:w-24 md:h-24 gradient-bg border border-primary/30 rounded-2xl flex items-center justify-center shadow-2xl float-effect">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl"></div>
        </div>
      </div>

      <div className="mt-8">
        <Card
          className={`gradient-bg border-primary/20 shadow-2xl backdrop-blur-xl ${animateUpcoming ? "refresh-animate" : ""}`}
        >
          <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 px-6 py-4 border-b border-accent/20">
            <h3 className="text-lg md:text-xl font-bold text-accent uppercase tracking-[0.15em] font-mono flex items-center gap-3">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              Next Matches
              <span className="w-2 h-2 bg-accent rounded-full"></span>
            </h3>
          </div>
          <div className="p-6">
            {upcomingMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingMatches.slice(currentTickerIndex, currentTickerIndex + 3).map((match, index) => (
                  <div
                    key={match.id}
                    className="gradient-bg rounded-xl p-4 border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 ticker-slide-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-accent bg-accent/10 px-3 py-1 rounded-lg uppercase tracking-wider">
                          {match.category}
                        </span>
                        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                          #{match.matchNumber}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-lg tracking-wide">{match.player1}</span>
                      </div>
                      <div className="text-center text-muted-foreground font-light text-sm">vs</div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-lg tracking-wide">{match.player2}</span>
                      </div>
                    </div>
                    {match.startTime && (
                      <div className="mt-3 pt-3 border-t border-primary/10">
                        <span className="text-sm text-muted-foreground bg-muted/20 px-3 py-1 rounded-lg">
                          {match.startTime}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // simple skeleton rows
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl p-4 border border-primary/10 shadow-lg">
                    <div className="h-5 w-24 bg-muted/20 rounded mb-3 animate-pulse" />
                    <div className="h-4 w-3/4 bg-muted/20 rounded mb-2 animate-pulse" />
                    <div className="h-4 w-2/3 bg-muted/20 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          <Card
            className={`relative overflow-hidden gradient-bg border-primary/20 shadow-2xl backdrop-blur-xl ${animateRecent ? "refresh-animate" : ""}`}
          >
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-4 border-b border-primary/20">
              <h2 className="text-xl md:text-2xl font-bold text-primary uppercase tracking-[0.15em] font-mono flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                Recent Match Results
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                {liveMatches.length > 0 && (
                  <span className="ml-4 text-sm bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
                    {liveMatches.length} LIVE
                  </span>
                )}
              </h2>
            </div>
            <div
              className="relative h-20 flex items-center overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              tabIndex={0}
              role="region"
              aria-label="Recent badminton match results marquee"
            >
              {[...liveMatches, ...recentMatches].length > 0 ? (
                <div
                  className={`flex items-center gap-12 whitespace-nowrap ${isPaused ? "" : "marquee"}`}
                  style={{ animationPlayState: isPaused ? "paused" : "running" }}
                >
                  {[...liveMatches, ...recentMatches].map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center gap-6 px-8 py-4 gradient-bg rounded-2xl border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-bold text-accent bg-accent/10 px-3 py-1 rounded-lg uppercase tracking-wider">
                          {match.category}
                        </div>
                        <div className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                          #{match.matchNumber}
                        </div>
                        {match.status === "live" && (
                          <div className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-lg animate-pulse">
                            LIVE
                          </div>
                        )}
                      </div>
                      <div className="text-base">{formatResult(match)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full px-6">
                  <div className="h-10 w-full rounded-xl bg-muted/20 animate-pulse" />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
