"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Brain, Home, Gamepad2, LineChart, Users, Settings, LogOut, Menu, X, ChevronRight, Calculator, HeartPulse } from "lucide-react"

const patientNavigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Games", href: "/dashboard/games", icon: Gamepad2 },
  { name: "Family", href: "/dashboard/family", icon: Users },
  { name: "Caregivers", href: "/dashboard/caregivers", icon: HeartPulse },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

const caregiverNavigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Manage Patients", href: "/dashboard/patients", icon: Users },
  { name: "Score Calculator", href: "/dashboard/calculator", icon: Calculator },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const navigation = user.role === "caregiver" ? caregiverNavigation : patientNavigation

  return (
    <div className="min-h-screen bg-muted/30">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 z-50 h-full bg-card border-r border-border transform transition-all duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${sidebarCollapsed ? "lg:w-16" : "lg:w-72"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link href="/" className={`flex items-center gap-2 ${sidebarCollapsed ? "lg:justify-center" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && <span className="text-xl font-semibold text-foreground">MindLite</span>}
            </Link>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
                className="hidden lg:block p-2 rounded-lg hover:bg-muted transition-colors"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${sidebarCollapsed ? "lg:justify-center lg:px-3" : ""} ${
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  title={sidebarCollapsed ? item.name : ""}
                >
                  <item.icon className="w-5 h-5" />
                  {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                  {isActive && !sidebarCollapsed && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className={`flex items-center gap-3 px-4 py-3 mb-2 ${sidebarCollapsed ? "lg:justify-center lg:px-3" : ""}`}>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">{user.email.charAt(0).toUpperCase()}</span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${sidebarCollapsed ? "lg:justify-center lg:px-3" : ""}`}
              title={sidebarCollapsed ? "Sign out" : ""}
            >
              <LogOut className="w-5 h-5" />
              {!sidebarCollapsed && <span className="font-medium">Sign out</span>}
            </button>
          </div>
        </div>
      </aside>

      <div className={`${sidebarCollapsed ? "lg:pl-16" : "lg:pl-72"} transition-all duration-200 ease-in-out`}>
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 py-4 bg-background/95 backdrop-blur border-b border-border lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">MindLite</span>
          </div>
        </header>
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
