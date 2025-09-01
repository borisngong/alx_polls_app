import { Poll } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"

// Mock data for demonstration
const mockPoll: Poll = {
  id: "1",
  title: "What's your favorite programming language?",
  description: "Let's see what the community prefers. This poll will help us understand the most popular programming languages among developers.",
  options: [
    { id: "1-1", text: "JavaScript/TypeScript", votes: 45 },
    { id: "1-2", text: "Python", votes: 38 },
    { id: "1-3", text: "Java", votes: 22 },
    { id: "1-4", text: "C++", votes: 15 }
  ],
  createdBy: "user1",
  isActive: true,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-15")
}

interface PollDetailPageProps {
  params: {
    id: string
  }
}

export default function PollDetailPage({ params }: PollDetailPageProps) {
  const poll = mockPoll // In real app, fetch by params.id
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/polls" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Polls
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="text-lg">{poll.description}</CardDescription>
            )}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Created by User</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{poll.createdAt.toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium">{totalVotes}</span> total votes
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {poll.options.map((option) => {
                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
                return (
                  <div key={option.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">{option.text}</span>
                      <span className="text-sm text-gray-600">
                        {option.votes} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="pt-6 border-t">
              <div className="flex gap-4">
                <Button variant="outline" size="lg">
                  Vote on this poll
                </Button>
                <Button variant="outline" size="lg">
                  Share Poll
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
