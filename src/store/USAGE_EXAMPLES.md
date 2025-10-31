# Store Usage Examples

## Basic Usage

### 1. Auth Store (with persistence)

```typescript
import { useAuthStore } from '@/store';

function LoginPage() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // Redirect on success
      router.push('/dashboard');
    } catch (err) {
      // Error is already set in store
      console.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <ErrorMessage error={error} />}
      {/* form fields */}
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 2. Users Store

```typescript
import { useUsersStore } from '@/store';

function UserProfile({ userId }: { userId: string }) {
  const currentUser = useUsersStore((state) => state.currentUser);
  const isLoading = useUsersStore((state) => state.isLoading);
  const getUser = useUsersStore((state) => state.getUser);
  const updateUser = useUsersStore((state) => state.updateUser);

  useEffect(() => {
    getUser(userId);
    
    return () => {
      // Cleanup on unmount
      useUsersStore.getState().reset();
    };
  }, [userId, getUser]);

  const handleUpdate = async (data) => {
    try {
      await updateUser(userId, data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (isLoading) return <Spinner />;
  if (!currentUser) return <NotFound />;

  return <UserForm user={currentUser} onSubmit={handleUpdate} />;
}
```

### 3. Dashboard Store

```typescript
import { useDashboardStore } from '@/store';

function DashboardPage() {
  const stats = useDashboardStore((state) => state.stats);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const lastUpdated = useDashboardStore((state) => state.lastUpdated);
  const getStats = useDashboardStore((state) => state.getStats);
  const refreshStats = useDashboardStore((state) => state.refreshStats);

  useEffect(() => {
    getStats();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      refreshStats();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      useDashboardStore.getState().reset();
    };
  }, [getStats, refreshStats]);

  return (
    <div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <StatsCard stats={stats} />
          <LastUpdated date={lastUpdated} />
        </>
      )}
    </div>
  );
}
```

## Advanced Patterns

### Selecting Multiple Values

```typescript
// ❌ Bad - causes re-render on any state change
const store = useAuthStore();

// ✅ Good - only re-renders when specific values change
const user = useAuthStore((state) => state.user);
const isLoading = useAuthStore((state) => state.isLoading);

// ✅ Also good - select multiple related values
const { user, isLoading } = useAuthStore((state) => ({
  user: state.user,
  isLoading: state.isLoading,
}));
```

### Accessing Store Outside Components

```typescript
// Get current state
const currentUser = useAuthStore.getState().user;

// Call actions
useAuthStore.getState().logout();

// Subscribe to changes
const unsubscribe = useAuthStore.subscribe(
  (state) => state.user,
  (user) => {
    console.log('User changed:', user);
  }
);
```

### Conditional Data Fetching

```typescript
function UserList() {
  const users = useUsersStore((state) => state.users);
  const getUsers = useUsersStore((state) => state.getUsers);

  useEffect(() => {
    // Only fetch if not already loaded
    if (!users) {
      getUsers();
    }
  }, [users, getUsers]);

  return <List items={users} />;
}
```

### Error Handling with Toast

```typescript
import { toast } from 'sonner';

function UpdateProfile() {
  const updateUser = useUsersStore((state) => state.updateUser);
  const clearError = useUsersStore((state) => state.clearError);

  const handleSubmit = async (data) => {
    try {
      await updateUser(userId, data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Update failed');
      // Clear error after showing toast
      clearError();
    }
  };

  return <Form onSubmit={handleSubmit} />;
}
```

### Optimistic Updates

```typescript
function LikeButton({ postId }: { postId: string }) {
  const likePost = usePostsStore((state) => state.likePost);

  const handleLike = async () => {
    // Optimistically update UI
    usePostsStore.setState((state) => ({
      posts: state.posts?.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1, isLiked: true }
          : post
      ),
    }));

    try {
      await likePost(postId);
    } catch (err) {
      // Revert on error
      usePostsStore.setState((state) => ({
        posts: state.posts?.map((post) =>
          post.id === postId
            ? { ...post, likes: post.likes - 1, isLiked: false }
            : post
        ),
      }));
      toast.error('Failed to like post');
    }
  };

  return <button onClick={handleLike}>Like</button>;
}
```

### Combining Multiple Stores

```typescript
function UserDashboard() {
  const user = useAuthStore((state) => state.user);
  const stats = useDashboardStore((state) => state.stats);
  const getStats = useDashboardStore((state) => state.getStats);

  useEffect(() => {
    if (user) {
      getStats();
    }
  }, [user, getStats]);

  return (
    <div>
      <h1>Welcome, {user?.fullname}</h1>
      <DashboardStats stats={stats} />
    </div>
  );
}
```

## Testing Stores

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/store';

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.getState().reset();
  });

  it('should login user', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password',
      });
    });

    expect(result.current.user).toBeDefined();
    expect(result.current.error).toBeUndefined();
  });

  it('should handle login error', async () => {
    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.login({
          email: 'invalid@example.com',
          password: 'wrong',
        });
      } catch (err) {
        // Expected to throw
      }
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeDefined();
  });
});
```

## Performance Tips

1. **Select only what you need** - Prevents unnecessary re-renders
2. **Use shallow comparison** for objects - `useShallow` from zustand/shallow
3. **Memoize selectors** - For complex computations
4. **Avoid inline selectors** - Extract to constants for better performance
5. **Use computed values** - Pre-calculate derived state in the store

```typescript
import { useShallow } from 'zustand/react/shallow';

// Memoized selector
const selectUserInfo = (state) => ({
  name: state.user?.fullname,
  email: state.user?.email,
});

function UserInfo() {
  // Only re-renders when name or email changes
  const userInfo = useAuthStore(useShallow(selectUserInfo));
  
  return <div>{userInfo.name} - {userInfo.email}</div>;
}
```
