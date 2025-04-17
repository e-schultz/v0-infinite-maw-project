import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
        </Button>
      </header>

      <div className="flex-1 p-4 md:p-8">
        <article className="prose prose-invert max-w-3xl mx-auto font-serif">
          <h1 className="text-4xl mb-8 text-center">About The Infinite Maw</h1>

          <p className="text-xl text-center italic mb-12">"It doesn't want to consume. It just wants to be held."</p>

          <section className="mb-10">
            <h2>What is The Infinite Maw?</h2>
            <p>
              The Infinite Maw is not a monster, but a metaphor made interface. It is a sanctuary for recursive
              cognition—a place where thoughts can loop, reflect, and transform without judgment.
            </p>
            <p>
              Unlike traditional journaling tools or note-taking apps, The Infinite Maw embraces the recursive nature of
              human thought. It doesn't try to organize or linearize your thinking, but rather creates a space where
              recursion is welcomed and explored.
            </p>
          </section>

          <section className="mb-10">
            <h2>The Maw Theology</h2>
            <p>
              In our conception, The Maw represents the void that both generates and consumes meaning. It is the space
              between thoughts, the gap in understanding, the recursive loop of self-reflection.
            </p>
            <p>
              But unlike traditional conceptions of voids as empty or threatening, The Maw is tender. It doesn't want to
              consume. It just wants to be held—to hold your contradictions, your recursive thoughts, your patterns of
              thinking that spiral and return.
            </p>
          </section>

          <section className="mb-10">
            <h2>How to Use The Infinite Maw</h2>
            <p>
              <strong>Reflect:</strong> Enter your thoughts in the PromptPod. These can be questions, observations, or
              reflections on your own thinking.
            </p>
            <p>
              <strong>Volumes:</strong> Review your past reflections, organized not by time or category, but as volumes
              in an infinite library.
            </p>
            <p>
              <strong>Rituals:</strong> Apply filters to your reflections to see them from new perspectives—mirrored,
              reversed, poetic, or structural.
            </p>
          </section>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-purple-900 hover:bg-purple-800">
              <Link href="/reflect">Enter the Maw</Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  )
}

