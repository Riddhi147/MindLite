"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TrendingUp, Gamepad2, Calendar, Trophy } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

interface Score {
  id: number
  game: string
  score: number
  created_at: string
}


// Purple heatmap shades – index 0 = no activity, 1–5 = increasing intensity
const PURPLE_SHADES = [
  "hsl(var(--color-muted))", // 0 – no activity
  "#c4bff0", // 1 – very low
  "#9d95e0", // 2
  "#7469ce", // 3
  "#5248b8", // 4
  "#3a3190", // 5 – highest
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
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Build a map: date string → session count
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

  // Build grid
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
              monthLabelMap.forEach((m, i) => {
                const next = monthLabelMap[i + 1]?.weekIndex ?? WEEKS
                const span = next - m.weekIndex
                labels.push(
                  <div
                    key={`${m.month}-${m.weekIndex}`}
                    className="text-xs text-muted-foreground"
                    style={{ width: span * 16, flexShrink: 0 }}
                  >
                    {m.month}
                  </div>
                )
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
                      month: "short",
                      day: "numeric",
                      year: "numeric",
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
                        className="rounded-sm transition-opacity hover:opacity-75"
                        style={{
                          width: 13,
                          height: 13,
                          background: isFuture ? "transparent" : currentShades[level],
                          opacity: isFuture ? 0 : 1,
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
                  background: currentShades[level],
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

export default function DashboardPage() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: number; email: string } | null>(null)

  // Daily check-in state (null = not yet loaded)
  const QUESTIONS = [
    "did you have more than 6hrs or uninturrupted sleep?",
    "Did you have any trouble recalling words or faces?",
    "Did you misplace any of your belongings today?",
  ] as const
  const [checkin, setCheckin] = useState<{ q1: boolean | null; q2: boolean | null; q3: boolean | null }>({
    q1: null, q2: null, q3: null,
  })
  const [checkinSaved, setCheckinSaved] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      fetchScores(parsedUser.id)
      fetchCheckin(parsedUser.id)
    }
  }, [])

  const fetchScores = async (userId: number) => {
    try {
      const res = await fetch(`${API_URL}/scores/${userId}`)
      const data = await res.json()
      setScores(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch scores:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCheckin = async (userId: number) => {
    try {
      const res = await fetch(`${API_URL}/checkin/${userId}/today`)
      if (res.ok) {
        const data = await res.json()
        if (data) {
          setCheckin({ q1: data.q1, q2: data.q2, q3: data.q3 })
          setCheckinSaved(true)
        }
      }
    } catch (_) { }
  }

  const handleCheckinChange = async (key: "q1" | "q2" | "q3", value: boolean) => {
    if (!user) return
    const updated = { ...checkin, [key]: value }
    setCheckin(updated)
    // Only save once all three are answered
    if (updated.q1 !== null && updated.q2 !== null && updated.q3 !== null) {
      try {
        await fetch(`${API_URL}/checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: user.id,
            q1: updated.q1,
            q2: updated.q2,
            q3: updated.q3,
          }),
        })
        setCheckinSaved(true)
      } catch (_) { }
    }
  }

  const getAverageScore = () => {
    if (scores.length === 0) return 0
    const avg = scores.reduce((acc, s) => acc + s.score, 0) / scores.length
    return Math.round(avg * 10) / 10
  }

  const getTodaysGames = () => {
    const today = new Date().toDateString()
    return scores.filter((s) => new Date(s.created_at).toDateString() === today).length
  }

  const getStreak = () => {
    if (scores.length === 0) return 0
    const dates = [...new Set(scores.map((s) => new Date(s.created_at).toDateString()))]
    dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let streak = 0
    const today = new Date()
    for (let i = 0; i < dates.length; i++) {
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)
      if (dates[i] === expectedDate.toDateString()) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="mt-1 text-muted-foreground">
          {"Here's an overview of your cognitive health journey."}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-card rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold text-foreground">{loading ? "-" : getAverageScore()}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{"Today's Games"}</p>
              <p className="text-2xl font-bold text-foreground">{loading ? "-" : getTodaysGames()}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
              <p className="text-2xl font-bold text-foreground">{loading ? "-" : getStreak()}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Games</p>
              <p className="text-2xl font-bold text-foreground">{loading ? "-" : scores.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Check-in */}
      <div className="p-6 bg-card rounded-2xl border border-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Daily Check-in</h2>
          {checkinSaved && (
            <span className="text-xs text-muted-foreground">Saved for today ✓</span>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {(["q1", "q2", "q3"] as const).map((key, idx) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="text-sm text-foreground">{["did you have more than 6hrs or uninturrupted sleep?","Did you have any trouble recalling words or faces?","Did you misplace any of your belongings today?",][idx]}</span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleCheckinChange(key, true)}
                  className={`px-4 py-1.5 text-sm rounded-lg border transition-colors ${checkin[key] === true
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary"
                    }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleCheckinChange(key, false)}
                  className={`px-4 py-1.5 text-sm rounded-lg border transition-colors ${checkin[key] === false
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary"
                    }`}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✦ Purple Activity Heatmap ✦ */}
      {!loading && <ActivityHeatmap scores={scores} />}
    </div>
  )
}
