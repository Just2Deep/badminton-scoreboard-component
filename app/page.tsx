import BadmintonScoreboard from "@/components/badminton-scoreboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex items-center">
      <div className="container mx-auto px-2 sm:px-4 md:px-6">
        <BadmintonScoreboard />
      </div>
    </main>
  )
}
