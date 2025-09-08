"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { VoteForm } from "@/components/polls/vote-form";

export default function PollDetailsClient({ poll }: { poll: any }) {
  const [showVoteForm, setShowVoteForm] = useState(false);
  const totalVotes = poll.poll_options.reduce(
    (sum: number, option: any) => sum + option.votes,
    0
  );

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
              <CardDescription className="text-lg">
                {poll.description}
              </CardDescription>
            )}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Created by User</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(poll.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium">{totalVotes}</span> total votes
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              {poll.poll_options.map((option: any) => {
                const percentage =
                  totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
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
                );
              })}
            </div>

            <div className="pt-6 border-t">
              {showVoteForm ? (
                <VoteForm pollId={poll.id} options={poll.poll_options} />
              ) : (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowVoteForm(true)}
                  >
                    Vote on this poll
                  </Button>
                  <Button variant="outline" size="lg">
                    Share Poll
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
