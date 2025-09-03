-- Temporarily disable RLS for testing
-- Run this in your Supabase SQL Editor to allow poll creation

-- Disable RLS on all tables
ALTER TABLE public.polls DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes DISABLE ROW LEVEL SECURITY;

-- Alternative: Drop all RLS policies if you want to keep RLS enabled but remove restrictions
-- DROP POLICY IF EXISTS "Users can view all active polls" ON public.polls;
-- DROP POLICY IF EXISTS "Users can view their own polls" ON public.polls;
-- DROP POLICY IF EXISTS "Authenticated users can create polls" ON public.polls;
-- DROP POLICY IF EXISTS "Users can update their own polls" ON public.polls;
-- DROP POLICY IF EXISTS "Users can delete their own polls" ON public.polls;

-- DROP POLICY IF EXISTS "Users can view poll options for active polls" ON public.poll_options;
-- DROP POLICY IF EXISTS "Users can view poll options for their own polls" ON public.poll_options;
-- DROP POLICY IF EXISTS "Users can create options for their own polls" ON public.poll_options;
-- DROP POLICY IF EXISTS "Users can update options for their own polls" ON public.poll_options;
-- DROP POLICY IF EXISTS "Users can delete options for their own polls" ON public.poll_options;

-- DROP POLICY IF EXISTS "Users can view votes for active polls" ON public.poll_votes;
-- DROP POLICY IF EXISTS "Users can view their own votes" ON public.poll_votes;
-- DROP POLICY IF EXISTS "Authenticated users can vote once per poll" ON public.poll_votes;

-- Note: After testing, you can re-enable RLS with:
-- ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
