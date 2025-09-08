import { getPollDetailsAction } from "@/lib/actions/polls";
import PollDetailsClient from "@/components/polls/poll-details-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PollDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PollDetailPage({ params }: PollDetailPageProps) {
  const { poll, error } = await getPollDetailsAction(params.id);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Error loading poll: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Poll Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The poll you are looking for does not exist or has been
              deactivated.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <PollDetailsClient poll={poll} />;
}
