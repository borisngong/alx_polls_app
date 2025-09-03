-- Fix RLS policies to allow test user ID for development/testing
-- This should be removed in production

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all active polls" ON public.polls;
DROP POLICY IF EXISTS "Users can view their own polls" ON public.polls;
DROP POLICY IF EXISTS "Authenticated users can create polls" ON public.polls;
DROP POLICY IF EXISTS "Users can update their own polls" ON public.polls;
DROP POLICY IF EXISTS "Users can delete their own polls" ON public.polls;

-- Create new policies that allow the test user ID
CREATE POLICY "Allow test user to create polls" ON public.polls
    FOR INSERT WITH CHECK (
        created_by = '00000000-0000-0000-0000-000000000001'::uuid
    );

CREATE POLICY "Allow test user to view polls" ON public.polls
    FOR SELECT USING (
        created_by = '00000000-0000-0000-0000-000000000001'::uuid OR is_active = true
    );

CREATE POLICY "Allow test user to update polls" ON public.polls
    FOR UPDATE USING (
        created_by = '00000000-0000-0000-0000-000000000001'::uuid
    );

CREATE POLICY "Allow test user to delete polls" ON public.polls
    FOR DELETE USING (
        created_by = '00000000-0000-0000-0000-000000000001'::uuid
    );

-- Fix poll_options policies
DROP POLICY IF EXISTS "Users can view poll options for active polls" ON public.poll_options;
DROP POLICY IF EXISTS "Users can view poll options for their own polls" ON public.poll_options;
DROP POLICY IF EXISTS "Users can create options for their own polls" ON public.poll_options;
DROP POLICY IF EXISTS "Users can update options for their own polls" ON public.poll_options;
DROP POLICY IF EXISTS "Users can delete options for their own polls" ON public.poll_options;

CREATE POLICY "Allow test user to manage poll options" ON public.poll_options
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_options.poll_id AND created_by = '00000000-0000-0000-0000-000000000001'::uuid
        )
    );

-- Fix poll_votes policies
DROP POLICY IF EXISTS "Users can view votes for active polls" ON public.poll_votes;
DROP POLICY IF EXISTS "Users can view their own votes" ON public.poll_votes;
DROP POLICY IF EXISTS "Authenticated users can vote once per poll" ON public.poll_votes;

CREATE POLICY "Allow test user to manage votes" ON public.poll_votes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.polls 
            WHERE id = poll_votes.poll_id AND created_by = '00000000-0000-0000-0000-000000000001'::uuid
        )
    );

-- Alternative: Temporarily disable RLS for testing (uncomment if needed)
-- ALTER TABLE public.polls DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.poll_options DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.poll_votes DISABLE ROW LEVEL SECURITY;
