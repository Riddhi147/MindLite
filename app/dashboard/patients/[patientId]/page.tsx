// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { ArrowLeft, TrendingUp, TrendingDown, Minus, Brain, Target, Clock, Calendar, AlertTriangle, Heart } from "lucide-react"
// import { ProgressChart } from "@/components/progress-chart"

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

// interface Score {
//   id: number
//   game: string
//   score: number
//   created_at: string
// }

// const gameIcons: Record<string, React.ElementType> = {
//   "memory-match": Brain,
//   "number-recall": Target,
//   "word-recall": Clock,
//   "pattern-recognition": Brain,
//   "face-recognition": Heart,
// }

// export default function PatientProgressPage() {
//   const params = useParams()
//   const router = useRouter()
//   const patientId = params.patientId as string

//   const [scores, setScores] = useState<Score[]>([])
//   const [loading, setLoading] = useState(true)
//   const [patientEmail, setPatientEmail] = useState("")

//   useEffect(() => {
//     // Get patient email from the patients list stored in state (or re-fetch)
//     const fetchData = async () => {
//       try {
//         const storedUser = localStorage.getItem("user")
//         if (!storedUser) return
//         const doctor = JSON.parse(storedUser)

//         // Get patients list to find email
//         const patientsRes = await fetch(`${API_URL}/doctor/${doctor.id}/patients`)
//         const patients = await patientsRes.json()
//         const patient = patients.find((p: { patient_id: number; email: string }) => p.patient_id === parseInt(patientId))
//         if (patient) setPatientEmail(patient.email)

//         // Get scores
//         const scoresRes = await fetch(`${API_URL}/scores/${patientId}`)
//         const data = await scoresRes.json()
//         setScores(Array.isArray(data) ? data : [])
//       } catch {
//         console.error("Failed to fetch patient data")
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [patientId])

//   const getScoresByGame = () => {
//     const grouped: Record<string, Score[]> = {}
//     scores.forEach((score) => {
//       if (!grouped[score.game]) grouped[score.game] = []
//       grouped[score.game].push(score)
//     })
//     return grouped
//   }

//   const getTrend = (gameScores: Score[]) => {
//     if (gameScores.length < 2) return { direction: "stable", percentage: 0 }
//     const recent = gameScores.slice(-5)
//     const older = gameScores.slice(-10, -5)
//     if (older.length === 0) return { direction: "stable", percentage: 0 }
//     const recentAvg = recent.reduce((a, b) => a + b.score, 0) / recent.length
//     const olderAvg = older.reduce((a, b) => a + b.score, 0) / older.length
//     const change = ((recentAvg - olderAvg) / olderAvg) * 100
//     if (Math.abs(change) < 5) return { direction: "stable", percentage: 0 }
//     return { direction: change > 0 ? "up" : "down", percentage: Math.abs(Math.round(change)) }
//   }

//   const getDeclineAlerts = () => {
//     const alerts: string[] = []
//     const scoresByGame = getScoresByGame()
//     Object.entries(scoresByGame).forEach(([game, gameScores]) => {
//       const trend = getTrend(gameScores)
//       if (trend.direction === "down" && trend.percentage >= 15) {
//         alerts.push(`${formatGameName(game)} scores have dropped ${trend.percentage}% recently`)
//       }
//       const recentScores = gameScores.slice(-3)
//       const allLow = recentScores.every((s) => s.score < 40)
//       if (recentScores.length >= 3 && allLow) {
//         alerts.push(`Consistently low scores in ${formatGameName(game)} (below 40%)`)
//       }
//     })
//     // Check inactivity
//     if (scores.length > 0) {
//       const lastPlayed = new Date(scores[scores.length - 1].created_at)
//       const daysSince = Math.floor((Date.now() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24))
//       if (daysSince >= 7) {
//         alerts.push(`Patient has not played any games in ${daysSince} days`)
//       }
//     }
//     return alerts
//   }

//   const formatGameName = (id: string) =>
//     id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

//   const getLastPlayed = () => {
//     if (scores.length === 0) return "Never"
//     const last = scores.reduce((a, b) =>
//       new Date(a.created_at) > new Date(b.created_at) ? a : b
//     )
//     return new Date(last.created_at).toLocaleDateString("en-US", {
//       month: "long", day: "numeric", year: "numeric"
//     })
//   }

//   const getAvgScore = () => {
//     if (scores.length === 0) return 0
//     return Math.round((scores.reduce((a, b) => a + b.score, 0) / scores.length) * 10) / 10
//   }

//   const scoresByGame = getScoresByGame()
//   const alerts = getDeclineAlerts()

//   return (
//     <div className="max-w-5xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-4 mb-8">
//         <button
//           onClick={() => router.push("/dashboard/patients")}
//           className="p-2 rounded-xl hover:bg-muted transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5 text-muted-foreground" />
//         </button>
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Patient Progress</h1>
//           <p className="mt-1 text-muted-foreground">{patientEmail}</p>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
//         </div>
//       ) : (
//         <>
//           {/* Decline Alerts */}
//           {alerts.length > 0 && (
//             <div className="mb-6 p-5 bg-destructive/10 border border-destructive/30 rounded-2xl">
//               <div className="flex items-center gap-2 mb-3">
//                 <AlertTriangle className="w-5 h-5 text-destructive" />
//                 <h2 className="font-semibold text-destructive">Decline Alerts</h2>
//               </div>
//               <ul className="space-y-1">
//                 {alerts.map((alert, i) => (
//                   <li key={i} className="text-sm text-destructive flex items-start gap-2">
//                     <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
//                     {alert}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Summary stats */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//             <div className="p-5 bg-card rounded-2xl border border-border">
//               <p className="text-sm text-muted-foreground mb-1">Total Games</p>
//               <p className="text-2xl font-bold text-foreground">{scores.length}</p>
//             </div>
//             <div className="p-5 bg-card rounded-2xl border border-border">
//               <p className="text-sm text-muted-foreground mb-1">Average Score</p>
//               <p className="text-2xl font-bold text-foreground">{getAvgScore()}</p>
//             </div>
//             <div className="p-5 bg-card rounded-2xl border border-border">
//               <p className="text-sm text-muted-foreground mb-1">Games Played</p>
//               <p className="text-2xl font-bold text-foreground">{Object.keys(scoresByGame).length} types</p>
//             </div>
//             <div className="p-5 bg-card rounded-2xl border border-border">
//               <div className="flex items-center gap-2 mb-1">
//                 <Calendar className="w-4 h-4 text-muted-foreground" />
//                 <p className="text-sm text-muted-foreground">Last Played</p>
//               </div>
//               <p className="text-sm font-semibold text-foreground">{getLastPlayed()}</p>
//             </div>
//           </div>

//           {/* Chart */}
//           <div className="p-6 bg-card rounded-2xl border border-border mb-8">
//             <h2 className="text-xl font-semibold text-foreground mb-6">Score History</h2>
//             <ProgressChart scores={scores} loading={false} />
//           </div>

//           {/* Per-game breakdown */}
//           <h2 className="text-xl font-semibold text-foreground mb-4">Performance by Game</h2>
//           {Object.keys(scoresByGame).length === 0 ? (
//             <div className="p-8 bg-card rounded-2xl border border-border text-center">
//               <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//               <p className="text-lg font-medium text-foreground">No games played yet</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {Object.entries(scoresByGame).map(([game, gameScores]) => {
//                 const trend = getTrend(gameScores)
//                 const avgScore = Math.round((gameScores.reduce((a, b) => a + b.score, 0) / gameScores.length) * 10) / 10
//                 const bestScore = Math.max(...gameScores.map((s) => s.score))
//                 const Icon = gameIcons[game] || Brain
//                 return (
//                   <div key={game} className="p-6 bg-card rounded-2xl border border-border">
//                     <div className="flex items-center gap-3 mb-4">
//                       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
//                         <Icon className="w-5 h-5 text-primary" />
//                       </div>
//                       <h3 className="font-semibold text-foreground">{formatGameName(game)}</h3>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-sm text-muted-foreground">Average</span>
//                         <span className="font-semibold text-foreground">{avgScore}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm text-muted-foreground">Best</span>
//                         <span className="font-semibold text-foreground">{bestScore}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm text-muted-foreground">Played</span>
//                         <span className="font-semibold text-foreground">{gameScores.length}x</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Trend</span>
//                         <span className={`flex items-center gap-1 font-semibold text-sm ${
//                           trend.direction === "up" ? "text-success" :
//                           trend.direction === "down" ? "text-destructive" :
//                           "text-muted-foreground"
//                         }`}>
//                           {trend.direction === "up" && <TrendingUp className="w-4 h-4" />}
//                           {trend.direction === "down" && <TrendingDown className="w-4 h-4" />}
//                           {trend.direction === "stable" && <Minus className="w-4 h-4" />}
//                           {trend.percentage > 0 ? `${trend.percentage}%` : "Stable"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   )
// }


























"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Brain, Target, Clock, Calendar, AlertTriangle, Heart } from "lucide-react"
import { ProgressChart } from "@/components/progress-chart"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

interface Score {
  id: number
  game: string
  score: number
  created_at: string
}

const gameIcons: Record<string, React.ElementType> = {
  "memory-match": Brain,
  "number-recall": Target,
  "word-recall": Clock,
  "pattern-recognition": Brain,
  "face-recognition": Heart,
}

// Purple shades for heatmap intensity (0 = no activity)
const PURPLE_SHADES = [
  "hsl(var(--color-muted))", // 0 - no activity
  "#CECBF6",      // 1 - low
  "#AFA9EC",      // 2
  "#7F77DD",      // 3
  "#534AB7",      // 4
  "#3C3489",      // 5 - high
]

const DARK_PURPLE_SHADES = [
  "hsl(var(--color-muted))",
  "#CECBF6",
  "#AFA9EC",
  "#7F77DD",
  "#534AB7",
  "#3C3489",
]

function ActivityHeatmap({ scores }: { scores: Score[] }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  const currentShades = isDark ? DARK_PURPLE_SHADES : PURPLE_SHADES
  const WEEKS = 53
  const DAYS_OF_WEEK = ["", "Mon", "", "Wed", "", "Fri", ""]
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  // Build a map of date string → activity count
  const activityMap: Record<string, number> = {}
  scores.forEach((s) => {
    const dateKey = new Date(s.created_at).toDateString()
    activityMap[dateKey] = (activityMap[dateKey] || 0) + 1
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Start from the Sunday 52 weeks ago
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 52 * 7 - today.getDay())

  // Build grid: weeks × days
  const weeks: { date: Date; count: number }[][] = []
  const monthLabelMap: { month: string; weekIndex: number }[] = []
  let lastMonth = -1

  for (let w = 0; w < WEEKS; w++) {
    const week: { date: Date; count: number }[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + w * 7 + d)
      const count = activityMap[date.toDateString()] || 0
      week.push({ date, count })
      if (d === 0) {
        const mo = date.getMonth()
        if (mo !== lastMonth) {
          monthLabelMap.push({ month: MONTHS[mo], weekIndex: w })
          lastMonth = mo
        }
      }
    }
    weeks.push(week)
  }

  const getLevel = (count: number) => Math.min(count, 5)

  const totalActive = Object.values(activityMap).reduce((a, b) => a + b, 0)

  return (
    <div className="p-6 bg-card rounded-2xl border border-border mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Activity Heatmap</h2>
        <span className="text-sm text-muted-foreground">{totalActive} sessions in the last year</span>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 680 }}>
          {/* Month labels */}
          <div className="flex ml-8 mb-1" style={{ gap: 0 }}>
            {(() => {
              const labels: React.ReactNode[] = []
              let prev = 0
              monthLabelMap.forEach((m, i) => {
                const next = monthLabelMap[i + 1]?.weekIndex ?? WEEKS
                const span = next - m.weekIndex
                labels.push(
                  <div
                    key={m.month}
                    className="text-xs text-muted-foreground"
                    style={{ width: span * 16, flexShrink: 0 }}
                  >
                    {m.month}
                  </div>
                )
                prev = next
              })
              return labels
            })()}
          </div>

          {/* Grid */}
          <div className="flex gap-0">
            {/* Day labels */}
            <div className="flex flex-col mr-1" style={{ gap: 3 }}>
              {DAYS_OF_WEEK.map((label, i) => (
                <div
                  key={i}
                  className="text-xs text-muted-foreground text-right"
                  style={{ height: 13, lineHeight: "13px", width: 28 }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            <div className="flex" style={{ gap: 3 }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: 3 }}>
                  {week.map(({ date, count }, di) => {
                    const level = getLevel(count)
                    const isFuture = date > today
                    const dateStr = date.toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })
                    const title = isFuture
                      ? ""
                      : count === 0
                      ? `No activity — ${dateStr}`
                      : `${count} session${count > 1 ? "s" : ""} — ${dateStr}`
                    return (
                      <div
                        key={di}
                        title={title}
                        className={`rounded-sm transition-opacity hover:opacity-75 ${isFuture ? "opacity-0" : ""}`}
                        style={{
                          width: 13,
                          height: 13,
                          background: isFuture ? "transparent" : level === 0 ? "hsl(var(--color-muted))" : currentShades[level],
                          cursor: count > 0 ? "pointer" : "default",
                        }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Less</span>
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className="rounded-sm"
                style={{
                  width: 13,
                  height: 13,
                  background: level === 0 ? "hsl(var(--color-muted))" : currentShades[level],
                }}
              />
            ))}
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PatientProgressPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.patientId as string

  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [patientEmail, setPatientEmail] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (!storedUser) return
        const doctor = JSON.parse(storedUser)

        const patientsRes = await fetch(`${API_URL}/doctor/${doctor.id}/patients`)
        const patients = await patientsRes.json()
        const patient = patients.find((p: { patient_id: number; email: string }) => p.patient_id === parseInt(patientId))
        if (patient) setPatientEmail(patient.email)

        const scoresRes = await fetch(`${API_URL}/scores/${patientId}`)
        const data = await scoresRes.json()
        setScores(Array.isArray(data) ? data : [])
      } catch {
        console.error("Failed to fetch patient data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [patientId])

  const getScoresByGame = () => {
    const grouped: Record<string, Score[]> = {}
    scores.forEach((score) => {
      if (!grouped[score.game]) grouped[score.game] = []
      grouped[score.game].push(score)
    })
    return grouped
  }

  const getTrend = (gameScores: Score[]) => {
    if (gameScores.length < 2) return { direction: "stable", percentage: 0 }
    const recent = gameScores.slice(-5)
    const older = gameScores.slice(-10, -5)
    if (older.length === 0) return { direction: "stable", percentage: 0 }
    const recentAvg = recent.reduce((a, b) => a + b.score, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b.score, 0) / older.length
    const change = ((recentAvg - olderAvg) / olderAvg) * 100
    if (Math.abs(change) < 5) return { direction: "stable", percentage: 0 }
    return { direction: change > 0 ? "up" : "down", percentage: Math.abs(Math.round(change)) }
  }

  const getDeclineAlerts = () => {
    const alerts: string[] = []
    const scoresByGame = getScoresByGame()
    Object.entries(scoresByGame).forEach(([game, gameScores]) => {
      const trend = getTrend(gameScores)
      if (trend.direction === "down" && trend.percentage >= 15) {
        alerts.push(`${formatGameName(game)} scores have dropped ${trend.percentage}% recently`)
      }
      const recentScores = gameScores.slice(-3)
      const allLow = recentScores.every((s) => s.score < 40)
      if (recentScores.length >= 3 && allLow) {
        alerts.push(`Consistently low scores in ${formatGameName(game)} (below 40%)`)
      }
    })
    if (scores.length > 0) {
      const lastPlayed = new Date(scores[scores.length - 1].created_at)
      const daysSince = Math.floor((Date.now() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24))
      if (daysSince >= 7) {
        alerts.push(`Patient has not played any games in ${daysSince} days`)
      }
    }
    return alerts
  }

  const formatGameName = (id: string) =>
    id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  const getLastPlayed = () => {
    if (scores.length === 0) return "Never"
    const last = scores.reduce((a, b) =>
      new Date(a.created_at) > new Date(b.created_at) ? a : b
    )
    return new Date(last.created_at).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    })
  }

  const getAvgScore = () => {
    if (scores.length === 0) return 0
    return Math.round((scores.reduce((a, b) => a + b.score, 0) / scores.length) * 10) / 10
  }

  const scoresByGame = getScoresByGame()
  const alerts = getDeclineAlerts()

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/dashboard/patients")}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Progress</h1>
          <p className="mt-1 text-muted-foreground">{patientEmail}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Decline Alerts */}
          {alerts.length > 0 && (
            <div className="mb-6 p-5 bg-destructive/10 border border-destructive/30 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h2 className="font-semibold text-destructive">Decline Alerts</h2>
              </div>
              <ul className="space-y-1">
                {alerts.map((alert, i) => (
                  <li key={i} className="text-sm text-destructive flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 bg-card rounded-2xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Total Games</p>
              <p className="text-2xl font-bold text-foreground">{scores.length}</p>
            </div>
            <div className="p-5 bg-card rounded-2xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Average Score</p>
              <p className="text-2xl font-bold text-foreground">{getAvgScore()}</p>
            </div>
            <div className="p-5 bg-card rounded-2xl border border-border">
              <p className="text-sm text-muted-foreground mb-1">Games Played</p>
              <p className="text-2xl font-bold text-foreground">{Object.keys(scoresByGame).length} types</p>
            </div>
            <div className="p-5 bg-card rounded-2xl border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Last Played</p>
              </div>
              <p className="text-sm font-semibold text-foreground">{getLastPlayed()}</p>
            </div>
          </div>

          {/* ✦ Activity Heatmap ✦ */}
          <ActivityHeatmap scores={scores} />

          {/* Score History Chart */}
          <div className="p-6 bg-card rounded-2xl border border-border mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Score History</h2>
            <ProgressChart scores={scores} loading={false} />
          </div>

          {/* Per-game breakdown */}
          <h2 className="text-xl font-semibold text-foreground mb-4">Performance by Game</h2>
          {Object.keys(scoresByGame).length === 0 ? (
            <div className="p-8 bg-card rounded-2xl border border-border text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">No games played yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(scoresByGame).map(([game, gameScores]) => {
                const trend = getTrend(gameScores)
                const avgScore = Math.round((gameScores.reduce((a, b) => a + b.score, 0) / gameScores.length) * 10) / 10
                const bestScore = Math.max(...gameScores.map((s) => s.score))
                const Icon = gameIcons[game] || Brain
                return (
                  <div key={game} className="p-6 bg-card rounded-2xl border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{formatGameName(game)}</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Average</span>
                        <span className="font-semibold text-foreground">{avgScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Best</span>
                        <span className="font-semibold text-foreground">{bestScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Played</span>
                        <span className="font-semibold text-foreground">{gameScores.length}x</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Trend</span>
                        <span className={`flex items-center gap-1 font-semibold text-sm ${
                          trend.direction === "up" ? "text-success" :
                          trend.direction === "down" ? "text-destructive" :
                          "text-muted-foreground"
                        }`}>
                          {trend.direction === "up" && <TrendingUp className="w-4 h-4" />}
                          {trend.direction === "down" && <TrendingDown className="w-4 h-4" />}
                          {trend.direction === "stable" && <Minus className="w-4 h-4" />}
                          {trend.percentage > 0 ? `${trend.percentage}%` : "Stable"}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}