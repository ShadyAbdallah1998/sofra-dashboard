# Store Integration Guide

This document shows how stores are integrated across the application.

## Integration Overview

### Auth Store Integration

The `authStore` is integrated across all authentication-related pages and components:

#### 1. Login Form (`src/components/auth/login/LoginForm.tsx`)
```typescript
import { useAuthStore } from '@/store';

// Select state and actions
const login = useAuthStore((state) => state.login);
const isLoading = useAuthStore((state) => state.isLoading);
const error = useAuthStore((state) => state.error);
const clearError = useAuthStore((state) => state.clearError);

// Use in form submission
const onSubmit = async (data: LoginFormData) => {
  clearError();
  try {
    await login(data);
    router.push('/dashboard');
  } catch (err) {
    // Error is already in store
  }
};
```

**Benefits:**
- Centralized loading state
- Consistent error handling
- Automatic user persistence
- No manual service calls in component

#### 2. Dashboard (`src/app/[locale]/dashboard/page.tsx`)
```typescript
import { useAuthStore, useDashboardStore } from '@/store';

// Auth store for user and logout
const user = useAuthStore((state) => state.user);
const logout = useAuthStore((state) => state.logout);

// Dashboard store for stats
const stats = useDashboardStore((state) => state.stats);
const getStats = useDashboardStore((state) => state.getStats);

// Fetch stats on mount
useEffect(() => {
  getStats();
  return () => useDashboardStore.getState().reset();
}, [getStats]);
```

**Features:**
- Displays user information from auth store
- Shows dashboard statistics
- Auto-refresh every 5 minutes
- Proper cleanup on unmount

#### 3. Profile Page (`src/app/[locale]/profile/page.tsx`)
```typescript
import { useAuthStore, useUsersStore } from '@/store';

// Auth store for current user
const user = useAuthStore((state) => state.user);
const setUser = useAuthStore((state) => state.setUser);

// Users store for profile operations
const updateUser = useUsersStore((state) => state.updateUser);
const getUser = useUsersStore((state) => state.getUser);

// Update profile
const onSubmit = async (data) => {
  await updateUser(user.id, data);
  // Sync with auth store
  const updatedUser = useUsersStore.getState().currentUser;
  if (updatedUser) setUser(updatedUser);
};
```

**Features:**
- Fetches user details on mount
- Updates profile with validation
- Syncs changes back to auth store
- Proper error handling

### Users Store Integration

The `usersStore` is used for user profile management:

**Key Operations:**
- `getUser(id)` - Fetch user details
- `updateUser(id, data)` - Update user profile
- `deleteUser(id)` - Delete user account

**Usage Pattern:**
```typescript
// Fetch user
useEffect(() => {
  if (userId) {
    getUser(userId);
  }
  return () => useUsersStore.getState().reset();
}, [userId, getUser]);

// Update user
const handleUpdate = async (data) => {
  try {
    await updateUser(userId, data);
    toast.success('Profile updated');
  } catch (err) {
    toast.error('Update failed');
  }
};
```

### Dashboard Store Integration

The `dashboardStore` provides dashboard statistics:

**Features:**
- Mock statistics (replace with real API)
- Auto-refresh capability
- Last updated timestamp
- Loading states

**Usage Pattern:**
```typescript
// Fetch stats
useEffect(() => {
  getStats();
  
  // Auto-refresh
  const interval = setInterval(() => {
    refreshStats(); // Silent refresh
  }, 5 * 60 * 1000);
  
  return () => {
    clearInterval(interval);
    useDashboardStore.getState().reset();
  };
}, [getStats, refreshStats]);
```

## Integration Patterns

### Pattern 1: Simple Data Fetching
```typescript
function MyComponent() {
  const data = useFeatureStore((state) => state.data);
  const getData = useFeatureStore((state) => state.getData);
  
  useEffect(() => {
    getData();
    return () => useFeatureStore.getState().reset();
  }, [getData]);
  
  return <div>{data}</div>;
}
```

### Pattern 2: Form Submission with Store
```typescript
function MyForm() {
  const submit = useFeatureStore((state) => state.submit);
  const isLoading = useFeatureStore((state) => state.isLoading);
  const error = useFeatureStore((state) => state.error);
  
  const onSubmit = async (data) => {
    try {
      await submit(data);
      router.push('/success');
    } catch (err) {
      // Error already in store
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <ErrorMessage error={error} />}
      <button disabled={isLoading}>Submit</button>
    </form>
  );
}
```

### Pattern 3: Multiple Stores
```typescript
function ComplexComponent() {
  // Multiple stores
  const user = useAuthStore((state) => state.user);
  const profile = useUsersStore((state) => state.currentUser);
  const stats = useDashboardStore((state) => state.stats);
  
  // Coordinate between stores
  useEffect(() => {
    if (user?.id) {
      useUsersStore.getState().getUser(user.id);
      useDashboardStore.getState().getStats();
    }
  }, [user?.id]);
  
  return <div>{/* Render combined data */}</div>;
}
```

### Pattern 4: Optimistic Updates
```typescript
function OptimisticComponent() {
  const updateItem = useFeatureStore((state) => state.updateItem);
  
  const handleUpdate = async (id, data) => {
    // Optimistic update
    useFeatureStore.setState((state) => ({
      items: state.items?.map(item =>
        item.id === id ? { ...item, ...data } : item
      ),
    }));
    
    try {
      await updateItem(id, data);
    } catch (err) {
      // Revert on error
      await useFeatureStore.getState().getData();
    }
  };
}
```

## File Structure

```
src/
├── store/
│   ├── authStore.ts          ✅ Integrated in login, dashboard, profile
│   ├── usersStore.ts         ✅ Integrated in profile
│   ├── dashboardStore.ts     ✅ Integrated in dashboard
│   └── index.ts              ✅ Central exports
├── components/
│   └── auth/
│       └── login/
│           └── LoginForm.tsx ✅ Uses authStore
└── app/[locale]/
    ├── auth/
    │   ├── login/page.tsx           ✅ Uses LoginForm
    │   ├── forgot-password/page.tsx ✅ Uses authService
    │   ├── verify-email/page.tsx    ✅ Uses authService
    │   └── reset-password/
    │       └── [token]/page.tsx     ✅ Uses authService
    ├── dashboard/page.tsx           ✅ Uses authStore + dashboardStore
    └── profile/page.tsx             ✅ Uses authStore + usersStore
```

## Integration Checklist

When integrating a store into a component:

- [ ] Import store from `@/store`
- [ ] Select only needed state (use selectors)
- [ ] Select needed actions
- [ ] Call actions in useEffect or handlers
- [ ] Handle loading states in UI
- [ ] Display errors to user
- [ ] Clean up on unmount (call reset)
- [ ] Test error scenarios
- [ ] Test loading states
- [ ] Verify no memory leaks

## Common Integration Issues

### Issue 1: Component Re-renders Too Much
**Problem:** Using entire store instead of selectors
```typescript
// ❌ Bad
const store = useAuthStore();

// ✅ Good
const user = useAuthStore((state) => state.user);
```

### Issue 2: Stale Data
**Problem:** Not fetching fresh data on mount
```typescript
// ✅ Solution
useEffect(() => {
  getData();
}, [getData]);
```

### Issue 3: Memory Leaks
**Problem:** Not cleaning up on unmount
```typescript
// ✅ Solution
useEffect(() => {
  getData();
  return () => useFeatureStore.getState().reset();
}, [getData]);
```

### Issue 4: Error Not Displayed
**Problem:** Not checking error state
```typescript
// ✅ Solution
const error = useFeatureStore((state) => state.error);
{error && <ErrorMessage error={error} />}
```

## Next Steps

1. **Add More Features**: Create stores for other features
2. **Add Tests**: Test store integration in components
3. **Add Loading Skeletons**: Better loading UX
4. **Add Error Boundaries**: Catch component errors
5. **Add Analytics**: Track store actions
6. **Add Persistence**: Persist more stores if needed

## Examples

See these files for complete integration examples:
- `src/components/auth/login/LoginForm.tsx` - Form with store
- `src/app/[locale]/dashboard/page.tsx` - Multiple stores
- `src/app/[locale]/profile/page.tsx` - CRUD operations
- `src/store/USAGE_EXAMPLES.md` - More patterns

## Support

- Check existing integrations for patterns
- Review store documentation
- Test in development
- Monitor console for errors
