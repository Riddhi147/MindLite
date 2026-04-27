"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RotateCcw, Trophy, Play } from "lucide-react"
import { useRouter } from "next/dist/client/components/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

type GameState = "ready" | "showing" | "input" | "result" | "gameover"

export default function NumberRecallGame() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [gameState, setGameState] = useState<GameState>("ready")
  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState("")
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [showingIndex, setShowingIndex] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)
  const [saving, setSaving] = useState(false)

  const generateSequence = (length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 10))
  }

  const startGame = () => {
    setLevel(1)
    setScore(0)
    startRound(3)
  }

  const startRound = (length: number) => {
    const newSequence = generateSequence(length)
    setSequence(newSequence)
    setUserInput("")
    setGameState("showing")
    setShowingIndex(0)
  }

  useEffect(() => {
    if (gameState === "showing" && showingIndex < sequence.length) {
      const timer = setTimeout(() => {
        setShowingIndex((prev) => prev + 1)
      }, 800)
      return () => clearTimeout(timer)
    } else if (gameState === "showing" && showingIndex === sequence.length) {
      const timer = setTimeout(() => {
        setGameState("input")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [gameState, showingIndex, sequence.length])

  const handleSubmit = () => {
    const correct = userInput === sequence.join("")
    setIsCorrect(correct)
    setGameState("result")

    if (correct) {
      const roundScore = sequence.length * 10
      setScore((prev) => prev + roundScore)
    }
  }

  const handleNextRound = () => {
    if (isCorrect) {
      const newLevel = level + 1
      setLevel(newLevel)
      startRound(2 + newLevel)
    } else {
      setGameState("gameover")
    }
  }

  const saveScore = async () => {
    setSaving(true)
    const storedUser = localStorage.getItem("user")
    if (!storedUser) return

    const parsedUser = JSON.parse(storedUser)
    try {
      const res =await fetch(`${API_URL}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: parsedUser.id,
          game: "number-recall",
          score,
        }),
      })
///////////////
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        router.push("/login?registered=true")
      }
///////////////
    } catch (error) {
      console.error("Failed to save score:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleKeyPress = (key: string) => {
    if (gameState !== "input") return
    if (key === "backspace") {
      setUserInput((prev) => prev.slice(0, -1))
    } else if (userInput.length < sequence.length) {
      setUserInput((prev) => prev + key)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard/games"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Games
        </Link>
        {gameState !== "ready" && (
          <button
            onClick={() => setGameState("ready")}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </button>
        )}
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Number Recall</h1>
        <p className="mt-1 text-muted-foreground">
          Remember and repeat the number sequence
        </p>
      </div>

      {gameState !== "ready" && gameState !== "gameover" && (
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="text-2xl font-bold text-foreground">{level}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold text-foreground">{score}</p>
          </div>
        </div>
      )}

      <div className="p-8 bg-card rounded-2xl border border-border">
        {gameState === "ready" && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Play className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Ready to play?</h2>
            <p className="text-muted-foreground mb-6">
              {"You'll see a sequence of numbers. Remember them and type them back in order."}
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "showing" && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Remember this sequence:</p>
            <div className="flex items-center justify-center gap-3">
              {sequence.map((num, index) => (
                <div
                  key={index}
                  className={`w-16 h-20 rounded-xl flex items-center justify-center text-3xl font-bold transition-all duration-300 ${
                    index < showingIndex
                      ? "bg-primary text-primary-foreground scale-100"
                      : "bg-muted text-transparent scale-90"
                  }`}
                >
                  {index < showingIndex ? num : "?"}
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === "input" && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Enter the sequence:</p>
            <div className="flex items-center justify-center gap-3 mb-8">
              {sequence.map((_, index) => (
                <div
                  key={index}
                  className={`w-16 h-20 rounded-xl flex items-center justify-center text-3xl font-bold border-2 ${
                    userInput[index]
                      ? "bg-primary/10 border-primary text-foreground"
                      : "bg-muted border-border text-muted-foreground"
                  }`}
                >
                  {userInput[index] || "_"}
                </div>
              ))}
            </div>

            {/* Number pad */}
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "backspace"].map((key, index) => (
                <button
                  key={index}
                  onClick={() => key !== null && handleKeyPress(key.toString())}
                  disabled={key === null}
                  className={`h-14 rounded-xl font-semibold text-lg transition-colors ${
                    key === null
                      ? "invisible"
                      : key === "backspace"
                      ? "bg-muted text-foreground hover:bg-muted/80"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {key === "backspace" ? "Del" : key}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={userInput.length !== sequence.length}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        )}

        {gameState === "result" && (
          <div className="text-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isCorrect ? "bg-success/10" : "bg-destructive/10"
              }`}
            >
              <span className="text-4xl">{isCorrect ? "O" : "X"}</span>
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isCorrect ? "text-success" : "text-destructive"}`}>
              {isCorrect ? "Correct!" : "Wrong!"}
            </h2>
            <p className="text-muted-foreground mb-2">
              The sequence was: <span className="font-bold text-foreground">{sequence.join(" ")}</span>
            </p>
            <p className="text-muted-foreground mb-6">
              You entered: <span className="font-bold text-foreground">{userInput.split("").join(" ") || "Nothing"}</span>
            </p>
            <button
              onClick={handleNextRound}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              {isCorrect ? "Next Level" : "See Results"}
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="text-center">
            <Trophy className="w-16 h-16 text-warning mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Game Over!</h2>
            <p className="text-muted-foreground mb-6">
              You reached level {level} with {sequence.length - 1} digits
            </p>

            <div className="inline-block p-6 bg-primary/10 rounded-xl mb-6">
              <p className="text-sm text-muted-foreground">Final Score</p>
              <p className="text-4xl font-bold text-primary">{score}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={saveScore}
                disabled={saving}
                className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Score"}
              </button>
              <button
                onClick={startGame}
                className="w-full sm:w-auto px-6 py-3 border border-border rounded-xl font-semibold hover:bg-muted transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
