-- Seed data for testing the polls application
-- Note: This should only be run in development/testing environments

-- Insert sample polls (you'll need to replace the created_by UUIDs with actual user IDs)
INSERT INTO public.polls (id, title, description, created_by, is_active, expires_at) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'What is your favorite programming language?',
    'Choose the programming language you enjoy working with the most',
    '00000000-0000-0000-0000-000000000001', -- Replace with actual user ID
    true,
    NOW() + INTERVAL '30 days'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Best framework for web development?',
    'Which framework do you think is the best for building modern web applications?',
    '00000000-0000-0000-0000-000000000001', -- Replace with actual user ID
    true,
    NOW() + INTERVAL '60 days'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Preferred database system',
    'What database system do you prefer for your projects?',
    '00000000-0000-0000-0000-000000000002', -- Replace with actual user ID
    true,
    NULL
);

-- Insert poll options for the first poll
INSERT INTO public.poll_options (id, poll_id, text, votes) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'JavaScript/TypeScript', 15),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Python', 12),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Java', 8),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'C++', 5),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Go', 3);

-- Insert poll options for the second poll
INSERT INTO public.poll_options (id, poll_id, text, votes) VALUES
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'React', 20),
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'Vue.js', 12),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Angular', 8),
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440002', 'Next.js', 18),
('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Svelte', 6);

-- Insert poll options for the third poll
INSERT INTO public.poll_options (id, poll_id, text, votes) VALUES
('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'PostgreSQL', 25),
('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'MySQL', 15),
('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 'MongoDB', 12),
('660e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440003', 'Supabase', 18),
('660e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440003', 'Firebase', 10);

-- Note: Sample votes are not included as they require valid user IDs
-- The vote counts above are just for demonstration purposes
