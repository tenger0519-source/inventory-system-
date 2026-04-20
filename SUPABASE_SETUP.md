# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project" 
4. Choose your organization or create a new one
5. Enter a project name (e.g., "inventory-system")
6. Set a database password (save it securely)
7. Choose a region closest to you
8. Click "Create new project"

## 2. Get Your Supabase Credentials

Once your project is created:

1. Go to Project Settings > API
2. Copy the **Project URL** 
3. Copy the **anon public** key

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root (this file is already in .gitignore):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the placeholders with your actual Supabase credentials.

## 4. Run the Database Schema

1. Go to your Supabase project dashboard
2. Click on the "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy the entire contents of `supabase-schema.sql` 
5. Paste it into the SQL editor
6. Click "Run" to execute the schema

## 5. Verify Setup

Your database should now have:
- All required tables created
- Initial user data inserted
- Row Level Security enabled
- Indexes and triggers set up

## 6. Test the Connection

Start your development server:

```bash
npm run dev
```

The app should now connect to your Supabase database instead of using local state.

## Notes

- The schema includes sample users with the password "password123"
- Row Level Security (RLS) is enabled with permissive policies for development
- You can restrict access policies later for production
- All tables have `created_at` and `updated_at` timestamps
- The database structure matches your current TypeScript types in `app-context.tsx`
