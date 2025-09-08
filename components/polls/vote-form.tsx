"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { submitVoteAction } from "@/lib/actions/polls";

export function VoteForm({
  options,
  pollId,
}: {
  options: { id: string; text: string }[];
  pollId: string;
}) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedOption) {
      setError("Please select an option to vote.");
      return;
    }

    startTransition(async () => {
      const result = await submitVoteAction(pollId, selectedOption);
      if (!result.success) {
        setError(result.message || "Failed to submit vote.");
      } else {
        alert("Thank you for voting!");
        // Optionally, you might want to disable the form or show updated results
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <RadioGroup
        onValueChange={setSelectedOption}
        className="mb-4"
        name="vote-option"
      >
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id}>{option.text}</Label>
          </div>
        ))}
      </RadioGroup>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Vote"}
      </Button>
    </form>
  );
}
