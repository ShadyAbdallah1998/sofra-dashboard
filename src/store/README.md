# Store Pattern Guide

This guide explains the standardized pattern for creating feature stores in this application.

## Pattern Structure

Each feature store follows this structure:

```typescript
import { create, StoreApi } from 'zustand';
import { featureService } from '@/services/featureService';
import { reportError } from '@/lib/utils';
import type { FeatureType } from '@/types/feature.types';

// 1. State Type - Define the data structure
type FeatureState = {
  data: FeatureType | null;
  isLoading: boolean;
  error: Error | undefined;
  // Add feature-specific state here
};

// 2. Actions Type - Define all operations
type FeatureActions = {
  getData: () => Promise<void>;
  updateData: (data: FeatureType) => Promise<void>;
  clearError: () => void;
  reset: () => void;
  // Add feature-specific actions here
};

// 3. Initial State
const initialState: FeatureState = {
  data: null,
  isLoading: false,
  error: undefined,
};

// 4. Create Store
export const useFeatureStore = create<FeatureState & FeatureActions>(
  (
    set: StoreApi<FeatureState & FeatureActions>['setState'],
    get: StoreApi<FeatureState & FeatureActions>['getState']
  ) => ({
    ...initialState,

    getData: async () => {
      set({ isLoading: true, error: undefined });
      try {
        const data = await featureService.getData();
        set({ data, isLoading: false });
      } catch (err) {
        const error = err as Error;
        reportError(error, { componentStack: 'FeatureStore.getData' });
        set({ error, isLoading: false });
        throw error;
      }
    },

    updateData: async (data: FeatureType) => {
      set({ isLoading: true, error: undefined });
      try {
        await featureService.updateData(data);
        set({ data, isLoading: false });
      } catch (err) {
        const error = err as Error;
        reportError(error, { componentStack: 'FeatureStore.updateData' });
        set({ error, isLoading: false });
        throw error;
      }
    },

    clearError: () => set({ error: undefined }),

    reset: () => set(initialState),
  })
);
```

## Key Principles

### 1. Separation of Concerns
- **State**: Data and UI state
- **Actions**: Business logic and API calls
- **Services**: API communication layer

### 2. Error Handling
- Always wrap async operations in try-catch
- Use `reportError` for consistent error tracking
- Set error state for UI feedback
- Re-throw errors for component-level handling

### 3. Loading States
- Set `isLoading: true` before async operations
- Set `isLoading: false` in both success and error cases
- Use loading state for UI feedback (spinners, disabled buttons)

### 4. Type Safety
- Define separate types for State and Actions
- Use TypeScript for all store definitions
- Import types from centralized type files

### 5. Reset Functionality
- Always include a `reset()` action
- Useful for cleanup on unmount or logout
- Returns store to initial state

## Advanced Patterns

### With Persistence (like authStore)
```typescript
import { persist, createJSONStorage } from 'zustand/middleware';

export const useFeatureStore = create<FeatureState & FeatureActions>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'feature-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ data: state.data }), // Only persist specific fields
    }
  )
);
```

### With Computed Values (like orderListingStore)
```typescript
type FeatureState = {
  rawData: DataType | null;
  computedValues: ComputedType | null;
};

type FeatureActions = {
  getComputedValues: () => ComputedType;
};

export const useFeatureStore = create<FeatureState & FeatureActions>(
  (set, get) => ({
    rawData: null,
    computedValues: null,

    getData: async () => {
      // ... fetch data
      const computed = get().getComputedValues();
      set({ rawData: data, computedValues: computed });
    },

    getComputedValues: () => {
      const state = get();
      // Perform computations
      return computedResult;
    },
  })
);
```

### With Debounced Actions
```typescript
import { debounce } from 'lodash';

export const useFeatureStore = create<FeatureState & FeatureActions>(
  (set, get) => ({
    searchQuery: '',
    
    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
      get().doSearch(query);
    },

    doSearch: debounce(async (query: string) => {
      // Perform search
    }, 500),
  })
);
```

## Usage in Components

```typescript
import { useFeatureStore } from '@/store/featureStore';

const MyComponent = () => {
  // Select only needed state (prevents unnecessary re-renders)
  const data = useFeatureStore((state) => state.data);
  const isLoading = useFeatureStore((state) => state.isLoading);
  const error = useFeatureStore((state) => state.error);
  const getData = useFeatureStore((state) => state.getData);

  useEffect(() => {
    getData();
    
    return () => {
      // Cleanup if needed
      useFeatureStore.getState().reset();
    };
  }, [getData]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div>{/* Render data */}</div>;
};
```

## Store Naming Convention

- File: `{feature}Store.ts` (camelCase)
- Hook: `use{Feature}Store` (PascalCase with 'use' prefix)
- State Type: `{Feature}State`
- Actions Type: `{Feature}Actions`

## Examples in Codebase

- `authStore.ts` - Authentication with persistence
- `usersStore.ts` - User management
- Reference the order listing store for complex computed values pattern
