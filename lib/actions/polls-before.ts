'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createPoll(formData: FormData) {
  console.log("Server Action: createPoll called");
  
  try {
    // Fix for Next.js 15: Use cookies directly as a function
    const supabase = createServerComponentClient({ cookies });
    console.log("Server Action: Supabase client created");
    
    // Temporarily disable auth for testing - remove this later
    console.log("Server Action: Skipping auth check for testing");
    
    // TODO: Re-enable auth when you have authentication set up
    // const { data: { user }, error: authError } = await supabase.auth.getUser();
    // if (authError || !user) {
    //   return { success: false, error: 'Unauthorized' };
    // }
    
    // Use a test user ID for now
    const testUserId = '00000000-0000-0000-0000-000000000001';

    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const options = formData.getAll('options') as string[];
    const expiresAt = formData.get('expiresAt') as string;

    console.log("Server Action: Form data extracted:", { title, description, options, expiresAt });

    // Validate required fields
    if (!title?.trim()) {
      console.log("Server Action: Validation failed - no title");
      return { success: false, error: 'Poll title is required' };
    }

    if (!options || options.length < 2 || options.some(opt => !opt.trim())) {
      console.log("Server Action: Validation failed - invalid options");
      return { success: false, error: 'At least 2 poll options are required' };
    }

    console.log("Server Action: Creating poll in database...");

    // Create poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        created_by: testUserId, // Use test user ID
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        is_active: true
      })
      .select()
      .single();

    if (pollError) {
      console.error('Server Action: Poll creation error:', pollError);
      return { success: false, error: pollError.message };
    }

    console.log("Server Action: Poll created successfully:", poll);

    // Create poll options
    const pollOptions = options
      .filter(opt => opt.trim())
      .map(option => ({
        poll_id: poll.id,
        text: option.trim(),
        votes: 0
      }));

    console.log("Server Action: Creating poll options:", pollOptions);

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions);

    if (optionsError) {
      console.error('Server Action: Poll options creation error:', optionsError);
      return { success: false, error: optionsError.message };
    }

    console.log("Server Action: Poll options created successfully");

    // Revalidate the polls page
    revalidatePath('/polls');
    revalidatePath('/dashboard');

    console.log("Server Action: Returning success with poll:", poll);
    return { success: true, poll };
  } catch (error) {
    console.error('Server Action: Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getPolls() {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    // First fetch all active polls
    const { data: polls, error: pollsError } = await supabase
      .from('polls')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (pollsError) {
      console.error('Error fetching polls:', pollsError);
      return { success: false, error: pollsError.message, polls: [] };
    }

    if (!polls || polls.length === 0) {
      return { success: true, polls: [] };
    }

    // Then fetch options for each poll
    const pollsWithOptions = await Promise.all(
      polls.map(async (poll) => {
        const { data: options, error: optionsError } = await supabase
          .from('poll_options')
          .select('*')
          .eq('poll_id', poll.id);

        if (optionsError) {
          console.error(`Error fetching options for poll ${poll.id}:`, optionsError);
          return { ...poll, options: [] };
        }

        return { ...poll, options: options || [] };
      })
    );

    return { success: true, polls: pollsWithOptions };
  } catch (error) {
    console.error('Unexpected error fetching polls:', error);
    return { success: false, error: 'An unexpected error occurred', polls: [] };
  }
}
