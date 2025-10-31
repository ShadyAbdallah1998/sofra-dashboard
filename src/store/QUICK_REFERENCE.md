# Quick Reference Card

## Import Stores
```typescript
import { useAuthStore, useUsersStore, useDashboardStore } from '@/store';
```

## Auth Store

### Login
```typescript
const login = useAuthStore((state) => state.login);
await login({ email, password });
```

### Logout
```typescript
const logout = useAuthStore((state) => state.logout);
await logout();
```

### Get User
```typescript
const user = useAuthStore((state) => state.user);
```

### Check Loading
```typescript
const isLoading = useAuthStore((state) => state.isLoading);
```

## Users Store

### Get User Profile
```typescript
const getUser = useUsersStore((state) => state.getUser);
await getUser(userId);
```

### Update Profile
```typescript
const updateUser = useUsersStore((state) => state.updateUser);
await updateUser(userId, { fullname: 'New Name' });
```

### Get Current User
```typescript
const currentUser = useUsersStore((state) => state.currentUser);
```

## Dashboard Store

### Get Stats
```typescript
const getStats = useDashboardStore((state) => state.getStats);
await getStats();
```

### Refresh Stats (Silent)
```typescript
const refreshStats = useDashboardStore((state) => state.refreshStats);
await refreshStats();
```

### Get Stats Data
```typescript
const stats = useDashboardStore((state) => state.stats);
```

## Common Patterns

### Fetch on Mount
```typescript
useEffect(() => {
  getData();
  return () => useFeatureStore.getState().reset();
}, [getData]);
```

### Handle Form Submit
```typescript
const onSubmit = async (data) => {
  try {
    await action(data);
    router.push('/success');
  } catch (err) {
    // Error in store
  }
};
```

### Display Error
```typescript
const error = useFeatureStore((state) => state.error);
{error && <div>{error.message}</div>}
```

### Show Loading
```typescript
const isLoading = useFeatureStore((state) => state.isLoading);
{isLoading ? <Spinner /> : <Content />}
```

### Clear Error
```typescript
const clearError = useFeatureStore((state) => state.clearError);
clearError();
```

### Reset Store
```typescript
useFeatureStore.getState().reset();
```

## Integrated Pages

| Page | Store Used | Features |
|------|-----------|----------|
| Login | authStore | Login, error handling |
| Dashboard | authStore + dashboardStore | User info, stats, logout |
| Profile | authStore + usersStore | View/edit profile |
| Forgot Password | authService | Send reset email |
| Verify Email | authService | Send verification |
| Reset Password | authService | Reset with token |

## File Locations

```
src/
├── store/
│   ├── authStore.ts
│   ├── usersStore.ts
│   ├── dashboardStore.ts
│   └── index.ts
├── components/auth/login/
│   └── LoginForm.tsx
└── app/[locale]/
    ├── dashboard/page.tsx
    └── profile/page.tsx
```

## Cheat Sheet

```typescript
// 1. Import
import { useAuthStore } from '@/store';

// 2. Select state
const user = useAuthStore((state) => state.user);
const isLoading = useAuthStore((state) => state.isLoading);

// 3. Select actions
const login = useAuthStore((state) => state.login);

// 4. Use in component
const handleLogin = async (data) => {
  await login(data);
};

// 5. Cleanup
useEffect(() => {
  return () => useAuthStore.getState().reset();
}, []);
```

## Documentation

- **INDEX.md** - Start here
- **QUICK_START.md** - Create new store
- **USAGE_EXAMPLES.md** - Real examples
- **INTEGRATION_GUIDE.md** - Integration patterns
- **ARCHITECTURE.md** - System design

## Need Help?

1. Check existing integrations
2. Review documentation
3. Copy from template
4. Test in development
