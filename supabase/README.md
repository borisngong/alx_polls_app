# Supabase Database Setup

This directory contains the database schema and setup files for the Polling App.

## Files

- `001_create_polls_schema.sql` - Main database schema with tables, policies, and triggers
- `seed.sql` - Sample data for testing (development only)
- `README.md` - This file

## Database Schema

### Tables

#### 1. `polls` Table
- **id**: UUID primary key
- **title**: Poll title (max 200 characters)
- **description**: Optional poll description
- **created_by**: Reference to auth.users (user who created the poll)
- **is_active**: Boolean flag for active/inactive polls
- **expires_at**: Optional expiration timestamp
- **created_at**: Creation timestamp
- **updated_at**: Last update timestamp

#### 2. `poll_options` Table
- **id**: UUID primary key
- **poll_id**: Reference to polls table
- **text**: Option text (max 500 characters)
- **votes**: Vote count for this option
- **created_at**: Creation timestamp
- **updated_at**: Last update timestamp

#### 3. `poll_votes` Table
- **id**: UUID primary key
- **poll_id**: Reference to polls table
- **option_id**: Reference to poll_options table
- **user_id**: Reference to auth.users (user who voted)
- **created_at**: Vote timestamp
- **Unique constraint**: One vote per user per poll

### Features

- **Row Level Security (RLS)**: All tables have RLS enabled with appropriate policies
- **Automatic vote counting**: Triggers automatically update vote counts
- **Timestamp management**: Automatic updated_at timestamp updates
- **Performance indexes**: Indexes on frequently queried columns
- **Data integrity**: Foreign key constraints and unique constraints

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run Migration
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `001_create_polls_schema.sql`
4. Run the migration

### 3. Environment Variables
Add these to your `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Test with Sample Data (Optional)
1. In SQL Editor, run the contents of `seed.sql`
2. **Note**: Replace the placeholder user IDs with actual user IDs from your auth.users table

## RLS Policies

### Polls
- Users can view all active polls
- Users can view, create, update, and delete their own polls

### Poll Options
- Users can view options for active polls
- Users can manage options for their own polls

### Poll Votes
- Users can view votes for active polls
- Users can view their own votes
- Users can vote once per poll

## Database Functions

### `update_poll_option_vote_count()`
Automatically updates vote counts when votes are added/removed

### `update_updated_at_column()`
Automatically updates the `updated_at` timestamp when records are modified

## Usage in Application

The schema is designed to work with the existing Server Actions and components:

- **Creating polls**: Insert into `polls` table, then insert options into `poll_options`
- **Voting**: Insert into `poll_votes` table (triggers automatically update vote counts)
- **Viewing polls**: Query `polls` with `poll_options` joined
- **User permissions**: RLS policies handle access control automatically

## Security Features

- **Row Level Security**: Users can only access data they're authorized to see
- **Input validation**: Server-side validation in Server Actions
- **User authentication**: All operations require valid user authentication
- **Data isolation**: Users cannot access other users' private data
