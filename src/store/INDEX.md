# Store Documentation Index

Welcome to the store pattern documentation! This guide will help you create and manage feature stores consistently across the application.

## 📚 Documentation Files

### 🚀 Getting Started
1. **[QUICK_START.md](./QUICK_START.md)** - Start here! 3-step guide to create a new store
2. **[STORE_PATTERN.md](./STORE_PATTERN.md)** - Quick reference card with templates

### 📖 Detailed Guides
3. **[README.md](./README.md)** - Complete pattern documentation and principles
4. **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** - Real-world usage examples
5. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design decisions

### 🛠️ Resources
6. **[_template.store.ts](./_template.store.ts)** - Copy this to create new stores

## 🏪 Existing Stores

### Production Stores
- **[authStore.ts](./authStore.ts)** - Authentication with persistence
  - Login/logout
  - Password management
  - Persisted user state
  
- **[usersStore.ts](./usersStore.ts)** - User management
  - Get user by ID
  - Update user profile
  - Delete user

- **[dashboardStore.ts](./dashboardStore.ts)** - Dashboard statistics
  - Get stats
  - Auto-refresh
  - Last updated tracking

### Central Export
- **[index.ts](./index.ts)** - Import all stores from here

## 🎯 Quick Navigation

### I want to...

#### Create a new store
→ Go to [QUICK_START.md](./QUICK_START.md)

#### See usage examples
→ Go to [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)

#### Understand the pattern
→ Go to [README.md](./README.md)

#### Learn the architecture
→ Go to [ARCHITECTURE.md](./ARCHITECTURE.md)

#### Get a quick reference
→ Go to [STORE_PATTERN.md](./STORE_PATTERN.md)

#### Copy a template
→ Use [_template.store.ts](./_template.store.ts)

## 📋 Store Creation Checklist

- [ ] Copy `_template.store.ts` to `{feature}Store.ts`
- [ ] Define types in `@/types/{feature}.types.ts`
- [ ] Create service in `@/services/{feature}Service.ts`
- [ ] Update State type
- [ ] Update Actions type
- [ ] Implement actions with error handling
- [ ] Add to `src/store/index.ts`
- [ ] Test in component
- [ ] Add documentation if complex

## 🎨 Store Types Overview

| Type | Use Case | Example | Complexity |
|------|----------|---------|------------|
| **Basic** | API data, CRUD | usersStore | ⭐ Simple |
| **Persisted** | Auth, preferences | authStore | ⭐⭐ Medium |
| **Complex** | Search, filters | orderListingStore | ⭐⭐⭐ Advanced |

## 🔑 Key Principles

1. **One store per feature** - Keep focused
2. **Type everything** - Full TypeScript
3. **Handle errors consistently** - Use reportError
4. **Track loading states** - Always
5. **Reset on cleanup** - Prevent memory leaks
6. **Use selectors** - Optimize re-renders
7. **Service layer** - Separate API logic
8. **Test critical paths** - Ensure reliability

## 📊 Pattern Comparison

### This Pattern (Zustand)
✅ Simple API
✅ No boilerplate
✅ TypeScript friendly
✅ Small bundle size
✅ Easy testing

### vs Redux
❌ More boilerplate
❌ Complex setup
✅ DevTools
✅ Mature ecosystem

### vs Context API
✅ Built-in React
❌ Performance issues
❌ No persistence
❌ More re-renders

## 🔄 Migration Path

```
Context API → Basic Store → Add Persistence → Add Computed Values
```

Start simple, add features as needed!

## 📞 Support

- Check existing stores for examples
- Read documentation files
- Review the template
- Ask team members

## 🎓 Learning Path

1. **Beginner**: Read QUICK_START.md → Copy template → Create basic store
2. **Intermediate**: Read README.md → Add persistence → Handle complex state
3. **Advanced**: Read ARCHITECTURE.md → Computed values → Debouncing

## 🔗 External Resources

- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: October 31, 2025
**Pattern Version**: 1.0
**Maintained By**: Development Team
