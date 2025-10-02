"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample data types
interface LiveResult {
  id: string
  player1: string
  player2: string
  score1: number
  score2: number
  court: string
  status: "live" | "completed"
  round: string
}

interface UpcomingMatch {
  id: string
  matchNumber: number
  player1: string
  player2: string
  category: "u9" | "u11" | "u13" | "13+"
  round: string
}

// Sample data - easily replaceable with API data
const sampleLiveResults: LiveResult[] = [
  {
    id: "1",
    player1: "Chen Wei Ming",
    player2: "Viktor Axelsen",
    score1: 21,
    score2: 18,
    court: "Court 1",
    status: "live",
    round: "Men's Singles Final",
  },
  {
    id: "2",
    player1: "Carolina Marin",
    player2: "Tai Tzu-ying",
    score1: 19,
    score2: 21,
    court: "Court 2",
    status: "live",
    round: "Women's Singles Semi",
  },
  {
    id: "3",
    player1: "Marcus Gideon",
    player2: "Kevin Sukamuljo",
    score1: 21,
    score2: 15,
    court: "Court 3",
    status: "completed",
    round: "Men's Doubles Quarter",
  },
  {
    id: "4",
    player1: "Greysia Polii",
    player2: "Apriyani Rahayu",
    score1: 21,
    score2: 12,
    court: "Court 4",
    status: "completed",
    round: "Women's Doubles Semi",
  },
  {
    id: "5",
    player1: "Zheng Siwei",
    player2: "Huang Yaqiong",
    score1: 18,
    score2: 21,
    court: "Court 5",
    status: "live",
    round: "Mixed Doubles Final",
  },
]

const sampleUpcomingMatches: UpcomingMatch[] = [
  {
    id: "1",
    matchNumber: 1,
    player1: "Kento Momota",
    player2: "Anders Antonsen",
    category: "13+",
    round: "Men's Singles Final",
  },
  {
    id: "2",
    matchNumber: 2,
    player1: "Akane Yamaguchi",
    player2: "An Se-young",
    category: "13+",
    round: "Women's Singles Final",
  },
  {
    id: "3",
    matchNumber: 3,
    player1: "Mohammad Ahsan",
    player2: "Hendra Setiawan",
    category: "u13",
    round: "Men's Doubles Final",
  },
  {
    id: "4",
    matchNumber: 4,
    player1: "Chen Qingchen",
    player2: "Jia Yifan",
    category: "u13",
    round: "Women's Doubles Final",
  },
  {
    id: "5",
    matchNumber: 5,
    player1: "Dechapol Puavaranukroh",
    player2: "Sapsiree Taerattanachai",
    category: "u11",
    round: "Mixed Doubles Final",
  },
  {
    id: "6",
    matchNumber: 6,
    player1: "Lee Zii Jia",
    player2: "Chou Tien-chen",
    category: "u11",
    round: "Men's Singles Semi",
  },
  {
    id: "7",
    matchNumber: 7,
    player1: "Pusarla Sindhu",
    player2: "Nozomi Okuhara",
    category: "u9",
    round: "Women's Singles Semi",
  },
  {
    id: "8",
    matchNumber: 8,
    player1: "Fajar Alfian",
    player2: "Muhammad Rian Ardianto",
    category: "u9",
    round: "Men's Doubles Semi",
  },
  {
    id: "9",
    matchNumber: 9,
    player1: "Kim So-yeong",
    player2: "Kong Hee-yong",
    category: "13+",
    round: "Women's Doubles Semi",
  },
  {
    id: "10",
    matchNumber: 10,
    player1: "Wang Yilyu",
    player2: "Huang Dongping",
    category: "u13",
    round: "Mixed Doubles Semi",
  },
]

export default function BadmintonScoreboard() {
  const [currentTickerIndex, setCurrentTickerIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-scroll ticker every 3 seconds
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentTickerIndex((prev) => (prev + 2) % sampleUpcomingMatches.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused])

  const formatScore = (score1: number, score2: number, status: string) => {
    if (status === "live") {
      return (
        <span className="flex items-center gap-3">
          <span className="text-primary font-bold text-lg tracking-wider">{score1}</span>
          <span className="text-muted-foreground text-sm">—</span>
          <span className="text-primary font-bold text-lg tracking-wider">{score2}</span>
          <Badge variant="destructive" className="text-xs font-semibold animate-pulse bg-red-500/90 glow-effect">
            LIVE
          </Badge>
        </span>
      )
    }
    return (
      <span className="flex items-center gap-3">
        <span className="font-bold text-lg tracking-wider">{score1}</span>
        <span className="text-muted-foreground text-sm">—</span>
        <span className="font-bold text-lg tracking-wider">{score2}</span>
        <Badge variant="secondary" className="text-xs font-semibold bg-secondary/60">
          FINAL
        </Badge>
      </span>
    )
  }

  return (
    <div className="w-full max-w-8xl mx-auto p-6 space-y-8 min-h-screen bg-gradient-to-br from-background via-background to-card">
      <div className="relative flex items-center justify-between mb-8 px-4">
        {/* Left Logo Placeholder */}
        <div className="w-20 h-20 md:w-24 md:h-24 gradient-bg border border-primary/30 rounded-2xl flex items-center justify-center shadow-2xl float-effect">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl"></div>
        </div>

        <div className="flex-1 text-center px-8">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent uppercase tracking-[0.2em] font-mono animate-fade-in-up">
              <span className="inline-block animate-bounce-subtle">Super</span>
              <span className="inline-block mx-4 animate-pulse-glow">Cup</span>
              <span className="inline-block text-2xl md:text-4xl animate-slide-in-right">-</span>
              <span className="inline-block ml-4 animate-typewriter">Season 03</span>
            </h1>
            <div className="relative w-32 h-1 mx-auto mt-4 overflow-hidden rounded-full bg-gradient-to-r from-transparent via-primary/30 to-transparent">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-sweep-right"></div>
            </div>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary/60 rounded-full animate-float-1"></div>
            <div className="absolute -top-2 left-1/3 w-1 h-1 bg-accent/60 rounded-full animate-float-2"></div>
            <div className="absolute -top-3 right-1/3 w-1.5 h-1.5 bg-primary/40 rounded-full animate-float-3"></div>
          </div>
        </div>

        {/* Right Logo Placeholder */}
        <div className="w-20 h-20 md:w-24 md:h-24 gradient-bg border border-primary/30 rounded-2xl flex items-center justify-center shadow-2xl float-effect">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-xl"></div>
        </div>
      </div>

      <Card className="relative overflow-hidden gradient-bg border-primary/20 shadow-2xl backdrop-blur-xl">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-4 border-b border-primary/20">
          <h2 className="text-xl md:text-2xl font-bold text-primary uppercase tracking-[0.15em] font-mono flex items-center gap-3">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Live Match Results
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
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
          aria-label="Live badminton match results marquee"
        >
          <div
            className={`flex items-center gap-12 whitespace-nowrap ${isPaused ? "" : "marquee"}`}
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {sampleLiveResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center gap-6 px-8 py-4 gradient-bg rounded-2xl border border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-sm font-bold text-accent bg-accent/10 px-3 py-1 rounded-lg uppercase tracking-wider">
                  {result.court}
                </div>
                <div className="text-base">
                  <span className="font-semibold text-foreground">{result.player1}</span>
                  <span className="text-muted-foreground mx-3 font-light">vs</span>
                  <span className="font-semibold text-foreground">{result.player2}</span>
                </div>
                <div className="text-base">{formatScore(result.score1, result.score2, result.status)}</div>
                <div className="text-sm text-muted-foreground bg-muted/20 px-4 py-2 rounded-lg font-medium">
                  {result.round}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="gradient-bg border-primary/20 shadow-2xl backdrop-blur-xl">
        <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 px-6 py-4 border-b border-primary/20">
          <h2 className="text-xl md:text-2xl font-bold text-accent uppercase tracking-[0.15em] font-mono flex items-center gap-3">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            Next 10 Matches
            <span className="w-2 h-2 bg-accent rounded-full"></span>
          </h2>
        </div>
        <div
          className="relative h-40 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          tabIndex={0}
          role="region"
          aria-label="Upcoming badminton matches ticker"
        >
          <div className="absolute inset-0 flex flex-col justify-center gap-3 px-6">
            {[0, 1].map((offset) => {
              const matchIndex = (currentTickerIndex + offset) % sampleUpcomingMatches.length
              const match = sampleUpcomingMatches[matchIndex]
              return (
                <div
                  key={`${match.id}-${currentTickerIndex}`}
                  className="flex items-center gap-6 px-6 py-4 gradient-bg rounded-2xl border border-primary/20 shadow-xl transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="text-primary font-bold text-base min-w-[100px] bg-primary/10 px-4 py-2 rounded-lg uppercase tracking-wider">
                    Match #{match.matchNumber}
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-semibold">
                      <span className="text-foreground">{match.player1}</span>
                      <span className="text-muted-foreground mx-4 font-light">vs</span>
                      <span className="text-foreground">{match.player2}</span>
                    </div>
                  </div>
                  <div className="text-base text-accent font-bold bg-accent/10 px-4 py-2 rounded-lg uppercase tracking-wider">
                    {match.category}
                  </div>
                  <div className="text-sm text-muted-foreground bg-muted/20 px-4 py-2 rounded-lg font-medium min-w-[140px] text-center">
                    {match.round}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center gap-2 p-4 bg-gradient-to-r from-secondary/5 via-secondary/10 to-secondary/5">
          {Array.from({ length: Math.ceil(sampleUpcomingMatches.length / 2) }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                Math.floor(currentTickerIndex / 2) === index
                  ? "bg-primary shadow-lg shadow-primary/50"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}
