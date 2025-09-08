# Agent Guidelines for Polling App

This document outlines the essential commands and code style guidelines for agents operating within this repository.

## 1. Build, Lint, and Test Commands

*   **Build**: `npm run build`
*   **Lint**: `npm run lint`
*   **Test All**: `npm run test`
*   **Test Single File**: `vitest <path/to/your/test.test.ts>` (e.g., `vitest lib/actions/polls.test.ts`)

## 2. Code Style Guidelines

*   **Language**: TypeScript
*   **Framework**: Next.js App Router
*   **Styling**: Tailwind CSS with shadcn/ui components
*   **Components**: Prefer Server Components; use Client Components for interactivity.
*   **Forms**: Use `react-hook-form` with `zod` validation, submitting via Server Actions.
*   **Naming**: PascalCase for components, camelCase for functions, snake_case for DB.
*   **Error Handling**: `try/catch` in Server Actions/Route Handlers; `error.tsx` for route errors.
*   **Secrets**: Use environment variables; never hardcode.
*   **Imports**: Utilize path aliases (`@/*`).

## 3. Cursor Rules

Refer to `.cursor/rules/project-spec.mdc` for detailed architectural and code patterns, including:
*   Strict adherence to Next.js App Router structure.
*   Exclusive use of Server Actions for mutations.
*   Supabase client for all database operations.
*   Validation of user input with Zod schemas.
