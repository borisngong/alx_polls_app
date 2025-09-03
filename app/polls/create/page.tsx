import { CreatePollForm } from "@/components/polls/create-poll-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreatePollPage() {
  console.log("Create poll page loaded!")
  
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
          <h1 className="text-3xl font-bold text-gray-900">Create a New Poll</h1>
          <p className="text-gray-600 mt-2">
            Create engaging polls for your community to vote on
          </p>
        </div>
        
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          ✅ Create Poll Page Loaded Successfully!
        </div>
        
        <CreatePollForm />
      </div>
    </div>
  )
}
