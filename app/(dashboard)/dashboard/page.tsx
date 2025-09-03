"use client";

import withAuth from "@/components/withAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Poll } from "@/types"
import Link from "next/link"
import { Plus, BarChart3, Users, TrendingUp } from "lucide-react"

// Mock data for demonstration
const mockUserPolls: Poll[] = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see what the community prefers",
    options: [
      { id: "1-1", text: "JavaScript/TypeScript", votes: 45 },
      { id: "1-2", text: "Python", votes: 38 },
      { id: "1-3", text: "Java", votes: 22 },
      { id: "1-4", text: "C++", votes: 15 }
    ],
    created_by: "user1",
    is_active: true,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15")
  }
]

function DashboardPage() {
  const totalPolls = mockUserPolls.length
  const totalVotes = mockUserPolls.reduce((sum, poll) => 
    sum + poll.options.reduce((pollSum, option) => pollSum + option.votes, 0), 0
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your polls.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPolls}</div>
            <p className="text-xs text-muted-foreground">
              Polls you've created
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              Across all your polls
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserPolls.filter(p => p.is_active).length}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with creating new content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/polls/create">
                <Plus className="h-4 w-4 mr-2" />
                Create New Poll
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/polls">View All Polls</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Polls */}
      <Card>
        <CardHeader>
          <CardTitle>Your Recent Polls</CardTitle>
          <CardDescription>Polls you've created recently</CardDescription>
        </CardHeader>
        <CardContent>
          {mockUserPolls.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't created any polls yet.</p>
              <Button asChild>
                <Link href="/polls/create">Create Your First Poll</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {mockUserPolls.map((poll) => (
                <div key={poll.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{poll.title}</h3>
                    <p className="text-sm text-gray-600">
                      {poll.options.reduce((sum, option) => sum + option.votes, 0)} votes
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/polls/${poll.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default withAuth(DashboardPage);
