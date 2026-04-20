# Migration Guide: Local State to Supabase

## Overview
Your application has been successfully updated to use Supabase instead of local state. Here's what needs to be done:

## Completed Changes
- [x] Installed @supabase/supabase-js
- [x] Created Supabase client configuration
- [x] Created database schema
- [x] Created new Supabase-based context
- [x] Updated layout to use new context
- [x] Updated monthly_sales page

## Remaining Updates Required

### 1. Update All Components Using `useApp`
Replace all imports and hook calls from:
```typescript
import { useApp } from "@/lib/app-context"
const { ... } = useApp()
```

To:
```typescript
import { useSupabaseApp } from "@/lib/supabase-app-context"
const { ... } = useSupabaseApp()
```

### Files to Update:
- `app/manager/weekly_plan/page.tsx`
- `app/manager/daily_plan/page.tsx`
- `app/employee/page.tsx`
- `app/employee/dashboard/page.tsx`
- `app/employee/locations/page.tsx`
- `app/register/page.tsx`
- `components/notification-bell.tsx`
- Any other components using the context

### 2. Handle Loading States
Add loading state handling to components that need async data:
```typescript
const { data, loading } = useSupabaseApp()

if (loading) {
  return <div>Loading...</div>
}
```

### 3. Async Function Updates
All context functions are now async. Update calls to use await:
```typescript
// Before
addTask(task)

// After  
await addTask(task)
```

### 4. Environment Setup
1. Create `.env.local` file with:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Run the database schema in Supabase SQL editor

## Quick Migration Script
Use this script to batch update imports:

```bash
# Find all files with old import
grep -r "useApp.*app-context" app/ components/

# Replace imports (run for each file)
sed -i 's/useApp.*app-context/useSupabaseApp.*supabase-app-context/g' filename.tsx
sed -i 's/const {.*} = useApp()/const {.*} = useSupabaseApp()/g' filename.tsx
```

## Testing
After migration:
1. Start the dev server
2. Test login/registration
3. Test task creation
4. Test product management
5. Check data persistence across page refreshes

## Benefits
- Data persists across sessions
- Real-time updates possible
- Scalable database backend
- Better data consistency
