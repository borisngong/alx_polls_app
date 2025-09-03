import { PollCard } from "@/components/polls/poll-card"
import { Button } from "@/components/ui/button"
import { Poll } from "@/types"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getPolls } from "@/lib/actions/polls"

export default async function PollsPage() {
  const { success, polls, error } = await getPolls();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Polls</h1>
          <p className="text-gray-600 mt-2">Discover and vote on polls created by the community</p>
        </div>
        <Button asChild>
          <Link href="/polls/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Poll
          </Link>
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error loading polls: {error}
        </div>
      )}
      
      {success && polls && polls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h3>
          <p className="text-gray-600 mb-4">Be the first to create a poll!</p>
          <Button asChild>
            <Link href="/polls/create">Create Your First Poll</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
