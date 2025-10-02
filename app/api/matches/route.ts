import { NextResponse } from "next/server"

export interface Match {
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

// Sample match data that would typically come from a database
const matches: Match[] = [
  // Completed matches
  {
    id: "1",
    matchNumber: 15,
    player1: "Chen Wei Ming",
    player2: "Viktor Axelsen",
    category: "13+",
    round: "Singles Final",
    status: "completed",
    score: "21-18, 21-15",
    winner: "Chen Wei Ming",
    endTime: "2025-10-12T14:30:00Z",
  },
  {
    id: "2",
    matchNumber: 14,
    player1: "Carolina Marin",
    player2: "Tai Tzu-ying",
    category: "13+",
    round: "Singles Semi",
    status: "completed",
    score: "19-21, 21-16, 21-18",
    winner: "Tai Tzu-ying",
    endTime: "2025-10-12T13:45:00Z",
  },
  {
    id: "3",
    matchNumber: 13,
    player1: "Marcus Gideon",
    player2: "Kevin Sukamuljo",
    category: "u13",
    round: "Doubles Quarter",
    status: "completed",
    score: "21-15, 21-12",
    winner: "Marcus Gideon",
    endTime: "2025-10-12T13:00:00Z",
  },
  {
    id: "4",
    matchNumber: 12,
    player1: "Greysia Polii",
    player2: "Apriyani Rahayu",
    category: "u11",
    round: "Doubles Semi",
    status: "completed",
    score: "21-12, 21-16",
    winner: "Greysia Polii",
    endTime: "2025-10-12T12:15:00Z",
  },
  {
    id: "5",
    matchNumber: 11,
    player1: "Zheng Siwei",
    player2: "Huang Yaqiong",
    category: "u9",
    round: "Mixed Doubles Final",
    status: "completed",
    score: "18-21, 21-19, 21-16",
    winner: "Huang Yaqiong",
    endTime: "2025-10-12T11:30:00Z",
  },
  // Live matches
  {
    id: "6",
    matchNumber: 16,
    player1: "Kento Momota",
    player2: "Anders Antonsen",
    category: "13+",
    round: "Singles Final",
    status: "live",
    score: "15-12, 8-11",
    startTime: "2025-10-12T15:00:00Z",
  },
  {
    id: "7",
    matchNumber: 17,
    player1: "Akane Yamaguchi",
    player2: "An Se-young",
    category: "13+",
    round: "Singles Final",
    status: "live",
    score: "21-18, 12-15",
    startTime: "2025-10-12T15:30:00Z",
  },
  // Upcoming matches
  {
    id: "8",
    matchNumber: 18,
    player1: "Mohammad Ahsan",
    player2: "Hendra Setiawan",
    category: "u13",
    round: "Doubles Final",
    status: "upcoming",
    startTime: "2025-10-12T16:00:00Z",
  },
  {
    id: "9",
    matchNumber: 19,
    player1: "Chen Qingchen",
    player2: "Jia Yifan",
    category: "u13",
    round: "Doubles Final",
    status: "upcoming",
    startTime: "2025-10-12T16:30:00Z",
  },
  {
    id: "10",
    matchNumber: 20,
    player1: "Dechapol Puavaranukroh",
    player2: "Sapsiree Taerattanachai",
    category: "u11",
    round: "Mixed Doubles Final",
    status: "upcoming",
    startTime: "2025-10-12T17:00:00Z",
  },
  {
    id: "11",
    matchNumber: 21,
    player1: "Lee Zii Jia",
    player2: "Chou Tien-chen",
    category: "u11",
    round: "Singles Semi",
    status: "upcoming",
    startTime: "2025-10-12T17:30:00Z",
  },
  {
    id: "12",
    matchNumber: 22,
    player1: "Pusarla Sindhu",
    player2: "Nozomi Okuhara",
    category: "u9",
    round: "Singles Semi",
    status: "upcoming",
    startTime: "2025-10-12T18:00:00Z",
  },
  {
    id: "13",
    matchNumber: 23,
    player1: "Fajar Alfian",
    player2: "Muhammad Rian Ardianto",
    category: "u9",
    round: "Doubles Semi",
    status: "upcoming",
    startTime: "2025-10-12T18:30:00Z",
  },
  {
    id: "14",
    matchNumber: 24,
    player1: "Kim So-yeong",
    player2: "Kong Hee-yong",
    category: "13+",
    round: "Doubles Semi",
    status: "upcoming",
    startTime: "2025-10-12T19:00:00Z",
  },
  {
    id: "15",
    matchNumber: 25,
    player1: "Wang Yilyu",
    player2: "Huang Dongping",
    category: "u13",
    round: "Mixed Doubles Semi",
    status: "upcoming",
    startTime: "2025-10-12T19:30:00Z",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const limit = searchParams.get("limit")

  try {
    let filteredMatches = matches

    // Filter by status if provided
    if (status && ["upcoming", "live", "completed"].includes(status)) {
      filteredMatches = matches.filter((match) => match.status === status)
    }

    // Apply limit if provided
    if (limit) {
      const limitNum = Number.parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredMatches = filteredMatches.slice(0, limitNum)
      }
    }

    // Sort matches: live first, then upcoming by start time, then completed by end time (most recent first)
    filteredMatches.sort((a, b) => {
      if (a.status === "live" && b.status !== "live") return -1
      if (b.status === "live" && a.status !== "live") return 1

      if (a.status === "upcoming" && b.status === "upcoming") {
        return new Date(a.startTime || "").getTime() - new Date(b.startTime || "").getTime()
      }

      if (a.status === "completed" && b.status === "completed") {
        return new Date(b.endTime || "").getTime() - new Date(a.endTime || "").getTime()
      }

      return 0
    })

    return NextResponse.json({
      success: true,
      data: filteredMatches,
      total: filteredMatches.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch matches" }, { status: 500 })
  }
}
