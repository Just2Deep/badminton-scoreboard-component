"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"
import { BrandLogos } from "./brand-logos"
import { MediaDisplay } from "./media-display"

interface Match {
  id: string
  matchNumber: number
  player1: string
  player2: string
  category?: string
  round?: string
  status: "upcoming" | "live" | "completed"
  score?: string
  winner?: string
  startTime?: string
  endTime?: string
}

interface ApiResponse {
  success: boolean
  data: Match[]
  total: number
  timestamp: string
}

type SheetRow = {
  Match?: string
  "Player A"?: string
  "Player B"?: string
  Score?: string
  Winner?: string
  Status?: string // "past" | "next"
  Category?: string // optional in sheet; use if provided
}

const SHEET_URL = "https://opensheet.elk.sh/16bUHth1gRVkT3c7kkIr_Bo7kj4IQ87ETZ1tSjkuCQFw/Sheet1"

const CATEGORY_ROTATION = ["u9", "u11", "u13", "13+"] as const
type CategoryType = (typeof CATEGORY_ROTATION)[number]

function normalizeCategory(raw?: string): CategoryType | undefined {
  if (!raw) return undefined
  const v = raw.toLowerCase().replace(/\s+/g, "")
  if (v.includes("13+")) return "13+"
  if (v.includes("u13")) return "u13"
  if (v.includes("u11")) return "u11"
  if (v.includes("u9")) return "u9"
  return undefined
}

function labelForCategory(c?: string) {
  const v = (c || "").toLowerCase()
  if (v === "u9") return "U9"
  if (v === "u11") return "U11"
  if (v === "u13") return "U13"
  if (v === "13+") return "13+"
  return "—"
}

function pickOnePerCategory(list: Match[], opts: { order: "asc" | "desc"; max?: number } = { order: "asc" }) {
  // list should already be sorted. We keep first seen per category.
  const seen = new Set<string>()
  const out: Match[] = []
  for (const m of list) {
    const cat = (m.category || "").toLowerCase()
    if (!cat || seen.has(cat)) continue
    seen.add(cat)
    out.push(m)
    if (opts.max && out.length >= opts.max) break
  }
  return out
}

export default function BadmintonScoreboard() {
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [currentView, setCurrentView] = useState<"scoreboard" | "media">("scoreboard")
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [viewTimer, setViewTimer] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

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

      const res = await fetch(SHEET_URL, { cache: "no-store" })
      const rows = (await res.json()) as SheetRow[]

      const parsed: Match[] = rows
        .map((r) => {
          const matchNum = Number.parseInt(String(r.Match || "").trim(), 10)
          if (Number.isNaN(matchNum)) return null

          const statusRaw = (r.Status || "").toLowerCase().trim()
          const status: Match["status"] =
            statusRaw === "past" ? "completed" : statusRaw === "next" ? "upcoming" : "upcoming"

          // Prefer explicit Category from sheet; otherwise derive via rotation using matchNumber
          const catFromSheet = normalizeCategory(r.Category)
          const derived = CATEGORY_ROTATION[(Math.max(1, matchNum) - 1) % CATEGORY_ROTATION.length]

          return {
            id: `sheet-${matchNum}`,
            matchNumber: matchNum,
            player1: (r["Player A"] || "").trim(),
            player2: (r["Player B"] || "").trim(),
            status,
            score: (r.Score || "").trim(),
            winner: (r.Winner || "").trim(),
            category: (catFromSheet || derived) as string,
          } as Match
        })
        .filter(Boolean) as Match[]

      const nonEmpty = parsed.filter(
        (m) => m.player1.length > 0 || m.player2.length > 0 || (m.score && m.score.length > 0),
      )

      // Upcoming: sort ascending by match number, then pick one per category (max 6 to allow future categories)
      const upcomingSorted = nonEmpty
        .filter((m) => m.status === "upcoming")
        .sort((a, b) => a.matchNumber - b.matchNumber)

      const upcoming = pickOnePerCategory(upcomingSorted, { order: "asc", max: 6 })

      // Recent: completed with scores, sort descending by match number, then pick one per category (last 4)
      const recentSorted = nonEmpty
        .filter((m) => m.status === "completed" && (m.score?.length ?? 0) > 0)
        .sort((a, b) => b.matchNumber - a.matchNumber)

      const recent = pickOnePerCategory(recentSorted, { order: "desc", max: 4 })

      const live: Match[] = []

      const recentChanged = JSON.stringify(recentMatches) !== JSON.stringify(recent)
      const upcomingChanged = JSON.stringify(upcomingMatches) !== JSON.stringify(upcoming)

      if (recentChanged) {
        setRecentMatches(recent)
        setAnimateRecent(true)
        if (recentAnimTimeout.current) window.clearTimeout(recentAnimTimeout.current)
        recentAnimTimeout.current = window.setTimeout(() => setAnimateRecent(false), 900)
      }
      if (upcomingChanged) {
        setUpcomingMatches(upcoming)
        setAnimateUpcoming(true)
        if (upcomingAnimTimeout.current) window.clearTimeout(upcomingAnimTimeout.current)
        upcomingAnimTimeout.current = window.setTimeout(() => setAnimateUpcoming(false), 900)
      }

      setLiveMatches(live)
      setRecentLoaded(true)
      setUpcomingLoaded(true)
      setLiveLoaded(true)
    } catch (err) {
      console.error("Error fetching OpenSheet rows:", err)
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
          setIsTransitioning(true)
          setTimeout(() => {
            setCurrentView("media")
            setIsTransitioning(false)
          }, 500)
          return 0
        } else if (currentView === "media" && newTimer >= 20) {
          setIsTransitioning(true)
          setTimeout(() => {
            setCurrentView("scoreboard")
            setCurrentMediaIndex((prev) => prev + 1)
            setIsTransitioning(false)
          }, 500)
          return 0
        }

        return newTimer
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentView])

  useEffect(() => {
    if (upcomingMatches.length > 4) {
      const interval = setInterval(() => {
        setCurrentTickerIndex((prev) => (prev + 1) % Math.ceil(upcomingMatches.length / 4))
      }, 5000)
      return () => clearInterval(interval)
    } else {
      setCurrentTickerIndex(0)
    }
  }, [upcomingMatches.length])

  const formatResult = (match: Match) => {
    return (
      <div className="flex items-center gap-3">
        <span className="font-bold text-xl tracking-wider text-foreground">
          {match.player1
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ")}
        </span>
        <span className="text-muted-foreground font-light text-xl">vs</span>
        <span className="font-bold text-xl tracking-wider text-foreground">
          {match.player2
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ")}
        </span>
        <span className="text-accent font-semibold text-xl mx-1">•</span>
        <span className="text-primary font-bold text-xl tracking-wider">{match.score}</span>
      </div>
    )
  }

  if (currentView === "media") {
    return (
      <MediaDisplay isTransitioning={isTransitioning} viewTimer={viewTimer} currentMediaIndex={currentMediaIndex} />
    )
  }

  if (error) {
    return (
      <div
        className={`w-full h-screen bg-gradient-to-br from-background via-background to-card flex flex-col overflow-hidden transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
      >
        <BrandLogos animate={false} />
        <div className="flex items-center justify-center mb-2 px-2 flex-shrink-0">
          <div className="text-center">
            <div className="relative">
              <h1 className="whitespace-nowrap text-3xl md:text-6xl font-extrabold text-accent uppercase tracking-[0.12em] font-sans">
                Super Cup - Season 03
              </h1>
              <div className="w-24 h-1 mx-auto mt-2 bg-accent rounded-full opacity-90"></div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto p-6 flex-1 flex items-center justify-center">
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
      </div>
    )
  }

  return (
    <div
      className={`w-full h-screen bg-gradient-to-br from-background via-background to-card grid grid-rows-[auto,auto,1fr] overflow-hidden transition-opacity duration-500 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
    >
      <BrandLogos animate={false} />
      <div className="text-center px-4 py-8">
        <div className="relative">
          <h1 className="text-2xl md:text-5xl font-extrabold text-accent uppercase tracking-[0.12em] font-sans">
            Super Cup - Season 03
          </h1>
          <div className="w-24 h-1 mx-auto mt-2 bg-accent rounded-full opacity-90"></div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col overflow-hidden px-2">
        <div className="flex flex-col gap-10 min-h-0 overflow-hidden bg-gradient-to-br from-card/50 to-background/30 rounded-2xl p-2 border border-primary/10 shadow-inner">
          <Card
            className={`gradient-bg border-primary/20 shadow-2xl backdrop-blur-xl flex-shrink-0 ${
              animateUpcoming ? "refresh-animate" : ""
            }`}
          >
            <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 px-3 py-1 border-b border-accent/20">
              <h3 className="text-lg md:text-3xl font-bold text-accent uppercase tracking-[0.15em] font-mono flex items-center gap-2 justify-center">
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                Upcoming Matches
                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
              </h3>
            </div>
            <div className="p-2 max-h-[calc(60vh)]">
              {upcomingMatches.length > 0 ? (
                <div className="relative overflow-hidden h-full">
                  <div
                    className="grid grid-cols-2 gap-4 transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentTickerIndex * 100}%)`,
                    }}
                  >
                    {upcomingMatches.map((match, index) => (
                      <div key={match.id} className="px-2">
                        <div className="gradient-bg rounded-lg p-2 border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                          {/* Metadata chips */}
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-[11px] md:text-xs uppercase tracking-wide text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                              {labelForCategory(match.category)}
                            </span>
                            <span className="text-[11px] md:text-xs tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              #{match.matchNumber}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <span className="font-bold text-foreground text-xl tracking-wide truncate flex-1 text-center">
                              {match.player1
                                .split(" ")
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(" ")}
                            </span>
                            <span className="text-muted-foreground font-light text-xl flex-shrink-0">vs</span>
                            <span className="font-bold text-foreground text-xl tracking-wide truncate flex-1 text-center">
                              {match.player2
                                .split(" ")
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(" ")}
                            </span>
                          </div>
                          {match.startTime && (
                            <div className="mt-4 pt-4 border-t border-primary/10">
                              <span className="text-base text-muted-foreground bg-muted/20 px-3 py-1 rounded-lg">
                                {match.startTime}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {upcomingMatches.length > 4 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                      {Array.from({ length: Math.ceil(upcomingMatches.length / 4) }).map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            currentTickerIndex === idx ? "bg-primary" : "bg-primary/30"
                          }`}
                          onClick={() => setCurrentTickerIndex(idx)}
                          aria-label={`Show matches page ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="rounded-xl p-5 border border-primary/10 shadow-lg">
                      <div className="h-5 w-24 bg-muted/20 rounded mb-3 animate-pulse" />
                      <div className="h-4 w-3/4 bg-muted/20 rounded mb-2 animate-pulse" />
                      <div className="h-4 w-2/3 bg-muted/20 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card
            className={`relative overflow-hidden gradient-bg border-primary/20 shadow-2xl backdrop-blur-xl ${
              animateRecent ? "refresh-animate" : ""
            }`}
          >
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-3 py-1 border-b border-primary/20">
              <h2 className="text-lg md:text-3xl font-bold text-primary uppercase font-mono flex items-center justify-center gap-2 tracking-[0.15em]">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Recent Match Results
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                {liveMatches.length > 0 && (
                  <span className="ml-4 text-base bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
                    {liveMatches.length} LIVE
                  </span>
                )}
              </h2>
            </div>
            <div
              className="relative py-1 min-h-8 flex items-center overflow-hidden"
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              tabIndex={0}
              role="region"
              aria-label="Recent badminton match results marquee"
            >
              {[...liveMatches, ...recentMatches].length > 0 ? (
                <div
                  className={`flex items-center gap-4 whitespace-nowrap ${isPaused ? "" : "marquee"}`}
                  style={{
                    animationPlayState: isPaused ? "paused" : "running",
                  }}
                >
                  {[...liveMatches, ...recentMatches].map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center gap-4 px-3 py-3 gradient-bg rounded-xl border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-base font-bold text-primary bg-primary/10 px-3 py-2 rounded-lg">
                          #{match.matchNumber}
                        </div>
                        <div className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-lg uppercase">
                          {labelForCategory(match.category)}
                        </div>
                        {match.status === "live" && (
                          <div className="text-sm font-bold text-red-500 bg-red-500/10 px-2 py-2 rounded-lg animate-pulse">
                            LIVE
                          </div>
                        )}
                      </div>
                      <div className="text-lg leading-relaxed">{formatResult(match)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full px-4">
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
