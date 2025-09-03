"use client"

import { Poll } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PollCardProps {
  poll: Poll
  onVote?: (optionId: string) => void
}

export function PollCard({ poll, onVote }: PollCardProps) {
  const totalVotes = poll.options?.reduce((sum, option) => sum + option.votes, 0) || 0
  
  const handleVote = (optionId: string) => {
    if (onVote) {
      onVote(optionId)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{poll.title}</CardTitle>
        {poll.description && (
          <CardDescription>{poll.description}</CardDescription>
        )}
        <div className="text-sm text-muted-foreground">
          {totalVotes} votes • Created {new Date(poll.created_at).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {poll.options && poll.options.length > 0 ? (
          <div className="space-y-2">
            {poll.options.map((option) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
              return (
                <div key={option.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{option.text}</span>
                    <span className="text-sm text-muted-foreground">
                      {option.votes} votes ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No options available
          </div>
        )}
        <div className="flex gap-2">
          {poll.options && poll.options.length > 0 && (
            <Button 
              onClick={() => handleVote(poll.options[0]?.id || "")}
              variant="outline"
              size="sm"
            >
              Vote
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href={`/polls/${poll.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
