# Quick Start Guide - Feature Stores

## Creating a New Store (3 Steps)

### Step 1: Copy the Template
```bash
cp src/store/_template.store.ts src/store/myFeatureStore.ts
```

### Step 2: Customize for Your Feature

Replace these items:
- `Feature` → Your feature name (e.g., `Products`, `Orders`, `Settings`)
- `any` types → Your actual types from `@/types`
- Service calls → Your actual API service methods

### Step 3: Export from Index
Add to `src/store/index.ts`:
```typescript
export { useMyFeatureStore } from './myFeatureStore';
```

## Store Structure Checklist

Every store should have:

✅ **State Type** - Data structure
```typescript
type FeatureState = {
  data: DataType | null;
  isLoading: boolean;
  error: Error | undefined;
};
```

✅ **Actions Type** - Operations
```typescript
type FeatureActions = {
  getData: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
};
```

✅ **Initial State** - Default values
```typescript
const initialState: FeatureState = {
  data: null,
  isLoading: false,
  error: undefined,
};
```

✅ **Error Handling** - In every async action
```typescript
try {
  // API call
} catch (err) {
  const error = err as Error;
  reportError(error, { componentStack: 'Store.action' });
  set({ error, isLoading: false });
  throw error;
}
```

## Common Patterns

### Basic CRUD Store
```typescript
type FeatureActions = {
  getAll: () => Promise<void>;
  getById: (id: string) => Promise<void>;
  create: (data: CreateType) => Promise<void>;
  update: (id: string, data: UpdateType) => Promise<void>;
  delete: (id: string) => Promise<void>;
  reset: () => void;
};
```

### Store with Search/Filter
```typescript
type FeatureState = {
  items: Item[];
  searchQuery: string;
  filters: FilterType;
  filteredItems: Item[];
};

type FeatureActions = {
  setSearchQuery: (query: string) => void;
  setFilters: (filters: FilterType) => void;
  applyFilters: () => void;
};
```

### Store with Pagination
```typescript
type FeatureState = {
  items: Item[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

type FeatureActions = {
  loadPage: (page: number) => Promise<void>;
  loadMore: () => Promise<void>;
};
```

## Usage in Components

```typescript
import { useFeatureStore } from '@/store';

function MyComponent() {
  // 1. Select state
  const data = useFeatureStore((state) => state.data);
  const isLoading = useFeatureStore((state) => state.isLoading);
  
  // 2. Select actions
  const getData = useFeatureStore((state) => state.getData);
  
  // 3. Fetch on mount
  useEffect(() => {
    getData();
    return () => useFeatureStore.getState().reset();
  }, [getData]);
  
  // 4. Render
  if (isLoading) return <Spinner />;
  return <div>{data}</div>;
}
```

## When to Add Persistence

Add persistence for:
- ✅ User authentication state
- ✅ User preferences (theme, language)
- ✅ Shopping cart
- ✅ Draft forms

Don't persist:
- ❌ Temporary UI state
- ❌ API data (should be fresh on reload)
- ❌ Error states
- ❌ Loading states

```typescript
import { persist, createJSONStorage } from 'zustand/middleware';

export const useFeatureStore = create<State & Actions>()(
  persist(
    (set) => ({ /* store implementation */ }),
    {
      name: 'feature-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        // Only persist these fields
        data: state.data 
      }),
    }
  )
);
```

## Debugging

```typescript
// Log all state changes
useFeatureStore.subscribe((state) => {
  console.log('State changed:', state);
});

// Get current state in console
console.log(useFeatureStore.getState());

// Reset store
useFeatureStore.getState().reset();
```

## Need Help?

- See `README.md` for detailed pattern explanation
- See `USAGE_EXAMPLES.md` for real-world examples
- Check existing stores: `authStore.ts`, `usersStore.ts`, `dashboardStore.ts`
