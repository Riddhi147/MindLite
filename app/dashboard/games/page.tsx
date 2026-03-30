import Link from "next/link"
import { Brain, Target, Clock, Puzzle, ArrowRight, Sparkles, Heart, Zap } from "lucide-react"
const games = [
  {
    id: "memory-match",
    name: "Memory Match",
    description: "Test your visual memory by finding matching pairs of cards. This classic game helps assess and improve short-term visual memory.",
    icon: Brain,
    color: "bg-primary/10 text-primary",
    difficulty: "Easy",
    duration: "3-5 min",
  },
  {
  id: "reaction",
  name: "Reaction Time",
  description: "Wait for the button to turn green and tap as fast as you can. Tests processing speed and reflexes.",
  icon: Zap,
  color: "bg-yellow-500/10 text-yellow-500",
  difficulty: "Easy",
  duration: "1-2 min",
 },
  // {
  //   id: "number-recall",
  //   name: "Number Recall",
  //   description: "Remember and repeat increasingly longer number sequences. Challenges working memory and attention span.",
  //   icon: Target,
  //   color: "bg-success/10 text-success",
  //   difficulty: "Medium",
  //   duration: "2-4 min",
  // },
  {
    id: "word-recall",
    name: "Word Recall",
    description: "Memorize a list of words and recall as many as you can. Assesses verbal memory and cognitive processing.",
    icon: Clock,
    color: "bg-warning/10 text-warning",
    difficulty: "Medium",
    duration: "3-5 min",
  },
  {
    id: "pattern-recognition",
    name: "Pattern Recognition",
    description: "Identify the next item in a sequence of patterns. Tests logical reasoning and visual processing abilities.",
    icon: Puzzle,
    color: "bg-accent text-primary",
    difficulty: "Hard",
    duration: "4-6 min",
  },
  {
    id: "face-recognition",
    name: "Face Recognition",
    description: "Look at photos of your family members and identify how they are related to you. Helps assess facial and relational memory.",
    icon: Heart,
    color: "bg-rose-500/10 text-rose-500",
    difficulty: "Easy",
    duration: "2-3 min",
  },

]

export default function GamesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Cognitive Games</h1>
        <p className="mt-1 text-muted-foreground">
          Choose a game to exercise your brain and track your cognitive performance.
        </p>
      </div>

      <div className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Daily Recommendation</h2>
            <p className="mt-1 text-muted-foreground">
              For optimal cognitive tracking, we recommend playing at least 2 different games daily. 
              This helps provide a comprehensive assessment of various cognitive functions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/dashboard/games/${game.id}`}
            className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl ${game.color} flex items-center justify-center shrink-0`}>
                <game.icon className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold text-foreground">{game.name}</h3>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{game.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    {game.difficulty}
                  </span>
                  <span className="text-muted-foreground">{game.duration}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end text-primary font-medium group-hover:gap-2 transition-all">
              Play Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
