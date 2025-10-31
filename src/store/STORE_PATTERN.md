# Store Pattern Summary

## Quick Reference Card

### Store Anatomy
```typescript
// 1. TYPES
type FeatureState = {
  data: DataType | null;
  isLoading: boolean;
  error: Error | undefined;
};

type FeatureActions = {
  getData: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
};

// 2. INITIAL STATE
const initialState: FeatureState = {
  data: null,
  isLoading: false,
  error: undefined,
};

// 3. CREATE STORE
export const useFeatureStore = create<FeatureState & FeatureActions>(
  (set, get) => ({
    ...initialState,
    
    // 4. ACTIONS
    getData: async () => {
      set({ isLoading: true, error: undefined });
      try {
        const data = await service.getData();
        set({ data, isLoading: false });
      } catch (err) {
        reportError(err as Error, { componentStack: 'Store.action' });
        set({ error: err as Error, isLoading: false });
        throw err;
      }
    },
    
    clearError: () => set({ error: undefined }),
    reset: () => set(initialState),
  })
);
```

## Component Usage Pattern

```typescript
function MyComponent() {
  // SELECT STATE
  const data = useFeatureStore((state) => state.data);
  const isLoading = useFeatureStore((state) => state.isLoading);
  const error = useFeatureStore((state) => state.error);
  
  // SELECT ACTIONS
  const getData = useFeatureStore((state) => state.getData);
  
  // FETCH ON MOUNT
  useEffect(() => {
    getData();
    return () => useFeatureStore.getState().reset();
  }, [getData]);
  
  // HANDLE LOADING
  if (isLoading) return <Spinner />;
  
  // HANDLE ERROR
  if (error) return <Error message={error.message} />;
  
  // RENDER DATA
  return <div>{data}</div>;
}
```

## Three Store Types

### Type 1: Basic Store (Most Common)
```typescript
// For: API data, temporary state
// Examples: users, products, orders

export const useFeatureStore = create<State & Actions>(
  (set) => ({
    data: null,
    isLoading: false,
    error: undefined,
    
    getData: async () => { /* ... */ },
    reset: () => set(initialState),
  })
);
```

### Type 2: Persisted Store
```typescript
// For: auth, preferences, cart
// Survives page reload

export const useFeatureStore = create<State & Actions>()(
  persist(
    (set) => ({ /* ... */ }),
    {
      name: 'storage-key',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### Type 3: Complex Store
```typescript
// For: search, filters, computed values
// Advanced features

export const useFeatureStore = create<State & Actions>(
  (set, get) => ({
    items: [],
    searchQuery: '',
    computedValues: null,
    
    setSearchQuery: debounce((query) => {
      set({ searchQuery: query });
      const computed = get().getComputedValues();
      set({ computedValues: computed });
    }, 500),
    
    getComputedValues: () => {
      const state = get();
      // Compute derived values
      return computed;
    },
  })
);
```

## Error Handling Template

```typescript
actionName: async (params) => {
  set({ isLoading: true, error: undefined });
  try {
    const result = await service.method(params);
    set({ data: result, isLoading: false });
  } catch (err) {
    const error = err as Error;
    reportError(error, { componentStack: 'StoreName.actionName' });
    set({ error, isLoading: false });
    throw error; // Re-throw for component handling
  }
}
```

## Common Actions Checklist

Every store should have:
- ✅ `reset()` - Return to initial state
- ✅ `clearError()` - Clear error state
- ✅ Async actions with try-catch
- ✅ Loading state management
- ✅ Error reporting

## File Checklist

When creating a new feature store:
- [ ] Copy `_template.store.ts`
- [ ] Rename to `{feature}Store.ts`
- [ ] Define types in `@/types/{feature}.types.ts`
- [ ] Create service in `@/services/{feature}Service.ts`
- [ ] Update state type
- [ ] Update actions type
- [ ] Implement actions
- [ ] Add to `src/store/index.ts`
- [ ] Test in component

## Quick Commands

```bash
# Create new store from template
cp src/store/_template.store.ts src/store/myFeatureStore.ts

# View all stores
ls src/store/*.ts

# Test store
npm test src/store/myFeatureStore.test.ts
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Component re-renders too much | Use specific selectors, not whole store |
| State not persisting | Add `persist` middleware |
| TypeScript errors | Check State & Actions types match |
| Actions not working | Verify service layer is correct |
| Memory leaks | Call `reset()` in cleanup |

## Performance Checklist

- [ ] Use selectors (not whole store)
- [ ] Debounce expensive operations
- [ ] Compute values in store (not component)
- [ ] Reset store on unmount
- [ ] Avoid inline selectors

## Next Steps

1. Read `QUICK_START.md` for step-by-step guide
2. Check `USAGE_EXAMPLES.md` for real examples
3. Review `README.md` for detailed patterns
4. See `ARCHITECTURE.md` for system overview
5. Copy `_template.store.ts` to start building

## Store Comparison

| Feature | Auth Store | Users Store | Dashboard Store |
|---------|-----------|-------------|-----------------|
| Persistence | ✅ Yes | ❌ No | ❌ No |
| Auto-refresh | ❌ No | ❌ No | ✅ Yes |
| Computed values | ❌ No | ❌ No | ❌ No |
| Debouncing | ❌ No | ❌ No | ❌ No |
| Complexity | Medium | Simple | Simple |

## Pattern Evolution

```
Simple Store → Add Persistence → Add Computed Values → Add Debouncing
   (users)         (auth)         (orderListing)        (search)
```

Start simple, add complexity only when needed!
