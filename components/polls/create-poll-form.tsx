"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
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
import { createPoll } from "@/lib/actions/polls";
import { createPollSchema, type CreatePollFormData } from "@/lib/schemas";

export function CreatePollForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const addOption = () => {
    if (fields.length < 10) {
      append({ value: "" });
    }
  };

  const removeOption = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const handleSubmit = async (data: CreatePollFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) {
        formData.append("description", data.description);
      }
      data.options.forEach((option) => {
        formData.append("options", option.value);
      });
      if (data.expiresAt) {
        formData.append("expiresAt", data.expiresAt);
      }

      const result = await createPoll(formData);

      if (result.success) {
        // Reset form
        form.reset();
        // Redirect to the created poll
        router.push(`/polls/${result.poll.id}`);
      } else {
        setError(result.error || "Failed to create poll");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Poll Title *
            </label>
            <Input
              id="title"
              placeholder="What would you like to ask?"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Input
              id="description"
              placeholder="Add more context to your poll"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Poll Options *</label>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-grow">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      {...form.register(`options.${index}.value` as const)}
                    />
                    {form.formState.errors.options?.[index]?.value && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.options[index].value.message}
                      </p>
                    )}
                  </div>
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {form.formState.errors.options &&
              !form.formState.errors.options.length && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.options.message}
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
            <Input
              id="expiresAt"
              type="datetime-local"
              {...form.register("expiresAt")}
            />
            {form.formState.errors.expiresAt && (
              <p className="text-sm text-red-600">
                {form.formState.errors.expiresAt.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Poll..." : "Create Poll"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
