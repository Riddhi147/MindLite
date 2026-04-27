"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
  opacity: number
}

interface ParticleCursorProps {
  /** Base hue for particles (0-360). Default 270 (purple) */
  hue?: number
  /** How many particles spawn per frame while moving. Default 3 */
  density?: number
  /** Max particle count at any time. Default 120 */
  maxParticles?: number
  /** Extra CSS class for the canvas wrapper */
  className?: string
}

export default function ParticleCursor({
  hue = 270,
  density = 3,
  maxParticles = 120,
  className = "",
}: ParticleCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: -100, y: -100, moving: false })
  const animationId = useRef<number>(0)
  const lastMouse = useRef({ x: -100, y: -100 })

  const spawnParticle = useCallback(
    (x: number, y: number) => {
      if (particles.current.length >= maxParticles) return

      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 1.5 + 0.3
      const life = Math.random() * 40 + 25 // 25-65 frames
      const size = Math.random() * 4 + 1.5

      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3, // slight upward drift
        life,
        maxLife: life,
        size,
        hue: hue + (Math.random() - 0.5) * 40, // slight hue variation
        opacity: 1,
      })
    },
    [hue, maxParticles]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }
    resize()

    const resizeObserver = new ResizeObserver(resize)
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
      mouse.current.moving = true
    }

    const handleMouseLeave = () => {
      mouse.current.moving = false
    }

    canvas.parentElement?.addEventListener("mousemove", handleMouseMove)
    canvas.parentElement?.addEventListener("mouseleave", handleMouseLeave)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new particles if mouse is moving
      if (mouse.current.moving) {
        const dx = mouse.current.x - lastMouse.current.x
        const dy = mouse.current.y - lastMouse.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Spawn more particles when moving faster
        const count = Math.min(Math.max(Math.floor(dist / 3), 1), density + 2)
        for (let i = 0; i < count; i++) {
          const offsetX = (Math.random() - 0.5) * 8
          const offsetY = (Math.random() - 0.5) * 8
          spawnParticle(mouse.current.x + offsetX, mouse.current.y + offsetY)
        }

        lastMouse.current.x = mouse.current.x
        lastMouse.current.y = mouse.current.y
      }

      // Update & draw particles
      particles.current = particles.current.filter((p) => {
        p.life--
        if (p.life <= 0) return false

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98 // friction
        p.vy *= 0.98

        const progress = p.life / p.maxLife
        p.opacity = progress
        const currentSize = p.size * progress

        // Glow layer
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, currentSize * 3
        )
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${p.opacity * 0.4})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentSize * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 85%, 78%, ${p.opacity})`
        ctx.fill()

        return true
      })

      animationId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId.current)
      canvas.parentElement?.removeEventListener("mousemove", handleMouseMove)
      canvas.parentElement?.removeEventListener("mouseleave", handleMouseLeave)
      resizeObserver.disconnect()
    }
  }, [spawnParticle, density])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-20 ${className}`}
      aria-hidden="true"
    />
  )
}
