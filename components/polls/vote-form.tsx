"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// This is a Client Component

import { useState } from "react";

export function VoteForm({
  options,
  pollId,
}: {
  options: { id: string; text: string }[];
  pollId: string;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) {
      alert("Please select an option to vote.");
      return;
    }
    // In a real app, you would call a Server Action to submit the vote
    console.log(`Voted for option ${selectedOption} on poll ${pollId}`);
    alert("Thank you for voting!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <RadioGroup onValueChange={setSelectedOption} className="mb-4">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id}>{option.text}</Label>
          </div>
        ))}
      </RadioGroup>
      <Button type="submit">Submit Vote</Button>
    </form>
  );
}
