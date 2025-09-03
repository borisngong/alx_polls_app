#!/bin/bash

# Database Setup Script for Polling App
# This script helps you set up the Supabase database schema

echo "🚀 Setting up Polling App Database Schema"
echo "=========================================="

echo ""
echo "📋 Prerequisites:"
echo "1. You need a Supabase project created at https://supabase.com"
echo "2. You need your project URL and anon key"
echo "3. You need access to the Supabase SQL Editor"
echo ""

echo "📝 Steps to complete:"
echo "1. Go to your Supabase project dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Copy the contents of supabase/migrations/001_create_polls_schema.sql"
echo "4. Paste and run the migration"
echo "5. (Optional) Run supabase/seed.sql for sample data"
echo ""

echo "🔑 Environment Variables to add to .env.local:"
echo "NEXT_PUBLIC_SUPABASE_URL=your_project_url"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
echo ""

echo "✅ After setup, your database will have:"
echo "- polls table with RLS policies"
echo "- poll_options table with automatic vote counting"
echo "- poll_votes table with unique constraints"
echo "- Proper indexes for performance"
echo "- Sample data for testing (if seed.sql is run)"
echo ""

echo "📚 Check supabase/README.md for detailed documentation"
echo ""

echo "🎯 Ready to create some polls! 🎉"
