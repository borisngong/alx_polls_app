"use client";

import { useEffect } from "react";
import { useFormState, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { createPollAction, FormState } from "@/lib/actions/polls";
import { createPollSchema, type CreatePollFormData } from "@/lib/schemas";
import { useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";

const initialState: FormState = {
  success: false,
  message: "",
};

export function CreatePollForm() {
  const [state, formAction] = useFormState(createPollAction, initialState);
  const router = useRouter();

  const form = useForm<CreatePollFormData>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: "",
      description: "",
      options: [{ value: "" }, { value: "" }],
      expiresAt: "",
    },
  });

  const { fields, append, remove } = useFieldArray<CreatePollFormData>({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    if (state.success && state.pollId) {
      router.push(`/polls/${state.pollId}`);
    }
  }, [state, router]);

  const addOption = () => {
    if (fields.length < 10) {
      append({ value: "" });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create a New Poll</CardTitle>
        <CardDescription>
          Create a new poll for others to vote on
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {!state.success && state.message && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{state.message}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Poll Title *
            </label>
            <Input
              id="title"
              name="title"
              placeholder="What would you like to ask?"
            />
            {state.errors?.title && (
              <p className="text-sm text-red-600">{state.errors.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Input
              id="description"
              name="description"
              placeholder="Add more context to your poll"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Poll Options *</label>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-grow">
                    <Input
                      name="options"
                      placeholder={`Option ${index + 1}`}
                      defaultValue={field.value}
                    />
                  </div>
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {state.errors?.options && (
              <p className="text-sm text-red-600">
                {state.errors.options[0]}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={fields.length >= 10}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>

          <div className="space-y-2">
            <label htmlFor="expiresAt" className="text-sm font-medium">
              Expiration Date (optional)
            </label>
            <Input id="expiresAt" name="expiresAt" type="datetime-local" />
          </div>

          <Button type="submit" className="w-full">
            Create Poll
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
