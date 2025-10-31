# Store Architecture Overview

## File Structure

```
src/store/
├── index.ts                    # Central exports
├── authStore.ts               # Authentication (with persistence)
├── usersStore.ts              # User management
├── dashboardStore.ts          # Dashboard example
├── _template.store.ts         # Template for new stores
├── ARCHITECTURE.md            # This file
├── README.md                  # Pattern documentation
├── QUICK_START.md            # Quick reference
└── USAGE_EXAMPLES.md         # Real-world examples
```

## Store Types

### 1. Persisted Stores (authStore)
- Survives page reloads
- Uses localStorage/sessionStorage
- For: auth state, user preferences, cart

**Key Features:**
- `persist` middleware
- `hasHydrated` flag for SSR
- `partialize` to control what persists

### 2. Standard Stores (usersStore, dashboardStore)
- Fresh on every load
- For: API data, temporary state
- Simpler implementation

**Key Features:**
- Standard CRUD operations
- Error handling
- Loading states

### 3. Complex Stores (orderListingStore pattern)
- Computed values
- Search/filter logic
- Debounced actions
- Auto-refresh intervals

**Key Features:**
- `getComputedValues()` method
- Debounced search
- Interval management
- Fuzzy search integration

## Data Flow

```
Component → Store Action → Service → API
                ↓
            Update State
                ↓
          Component Re-renders
```

### Example Flow:
```typescript
// 1. Component calls action
await login({ email, password });

// 2. Store action calls service
const user = await authService.login(credentials);

// 3. Store updates state
set({ user, isLoading: false });

// 4. Component re-renders with new state
const user = useAuthStore((state) => state.user);
```

## State Management Layers

```
┌─────────────────────────────────────┐
│         Components (UI)             │
│  - Select state with selectors      │
│  - Call actions                     │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│      Stores (State + Logic)         │
│  - Manage state                     │
│  - Handle async operations          │
│  - Error handling                   │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│       Services (API Layer)          │
│  - HTTP requests                    │
│  - Data transformation              │
└─────────────────────────────────────┘
              ↕
┌─────────────────────────────────────┐
│          Backend API                │
└─────────────────────────────────────┘
```

## Store Responsibilities

### ✅ Stores SHOULD:
- Manage feature-specific state
- Handle async operations
- Provide actions for state updates
- Handle errors consistently
- Expose loading states
- Call service layer for API requests

### ❌ Stores SHOULD NOT:
- Make direct HTTP requests (use services)
- Contain UI logic
- Handle routing
- Manage global app state (use separate store)
- Contain business validation (use services/utils)

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| File | `{feature}Store.ts` | `authStore.ts` |
| Hook | `use{Feature}Store` | `useAuthStore` |
| State Type | `{Feature}State` | `AuthState` |
| Actions Type | `{Feature}Actions` | `AuthActions` |
| Selector | `select{Property}` | `selectUser` |

## Common Patterns

### Pattern 1: Basic CRUD
```typescript
type State = {
  items: Item[];
  isLoading: boolean;
  error: Error | undefined;
};

type Actions = {
  getAll: () => Promise<void>;
  create: (data: CreateData) => Promise<void>;
  update: (id: string, data: UpdateData) => Promise<void>;
  delete: (id: string) => Promise<void>;
};
```

### Pattern 2: Single Resource
```typescript
type State = {
  item: Item | null;
  isLoading: boolean;
  error: Error | undefined;
};

type Actions = {
  get: (id: string) => Promise<void>;
  update: (data: UpdateData) => Promise<void>;
};
```

### Pattern 3: List with Filters
```typescript
type State = {
  items: Item[];
  filters: FilterType;
  searchQuery: string;
  isLoading: boolean;
};

type Actions = {
  getItems: (filters?: FilterType) => Promise<void>;
  setFilters: (filters: FilterType) => void;
  setSearchQuery: (query: string) => void;
};
```

## Integration Points

### With React Components
```typescript
// Selector pattern - prevents unnecessary re-renders
const user = useAuthStore((state) => state.user);
const login = useAuthStore((state) => state.login);
```

### With Services
```typescript
// Store calls service, service makes API request
const user = await authService.login(credentials);
set({ user });
```

### With Error Tracking
```typescript
// Consistent error reporting
reportError(error, { componentStack: 'StoreName.actionName' });
```

### With TypeScript
```typescript
// Full type safety
type State = { /* ... */ };
type Actions = { /* ... */ };
create<State & Actions>()
```

## Performance Considerations

### Selector Optimization
```typescript
// ❌ Bad - re-renders on any state change
const store = useAuthStore();

// ✅ Good - only re-renders when user changes
const user = useAuthStore((state) => state.user);
```

### Computed Values
```typescript
// Pre-compute in store instead of component
type State = {
  items: Item[];
  filteredItems: Item[]; // Computed
};
```

### Debouncing
```typescript
// Debounce expensive operations
import { debounce } from 'lodash';

doSearch: debounce((query: string) => {
  // Search logic
}, 500)
```

## Testing Strategy

### Unit Tests
- Test actions in isolation
- Mock service layer
- Verify state updates

### Integration Tests
- Test component + store interaction
- Verify side effects
- Test error scenarios

### Example
```typescript
describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
  });

  it('should login user', async () => {
    await useAuthStore.getState().login(credentials);
    expect(useAuthStore.getState().user).toBeDefined();
  });
});
```

## Migration Guide

### From Redux
- Actions → Store actions
- Reducers → `set()` calls
- Selectors → Zustand selectors
- Middleware → Zustand middleware

### From Context API
- Context Provider → Store creation
- useContext → useStore selector
- setState → Store actions

## Best Practices

1. **One store per feature** - Keep stores focused
2. **Async in actions** - All API calls in store actions
3. **Error handling** - Consistent error patterns
4. **Loading states** - Always track loading
5. **Reset on unmount** - Clean up when done
6. **Type everything** - Full TypeScript coverage
7. **Selective subscriptions** - Use selectors wisely
8. **Service layer** - Separate API logic
9. **Documentation** - Comment complex logic
10. **Testing** - Test critical paths

## Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- `README.md` - Detailed pattern guide
- `QUICK_START.md` - Quick reference
- `USAGE_EXAMPLES.md` - Real-world examples
- `_template.store.ts` - Copy for new stores
