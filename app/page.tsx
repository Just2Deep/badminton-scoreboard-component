import BadmintonScoreboard from "@/components/badminton-scoreboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto">
        <BadmintonScoreboard />
      </div>
    </main>
  )
}
