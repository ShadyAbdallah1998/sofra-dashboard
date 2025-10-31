# Logout Testing Guide

## Quick Test Steps

### 1. Basic Logout Test
1. Open your app in the browser
2. Login with valid credentials
3. You should be redirected to `/dashboard`
4. Click the "Logout" button (red button in top right)
5. **Expected Results:**
   - Button text changes to "Logging out..."
   - You are redirected to `/auth/login`
   - Page refreshes
   - You cannot access `/dashboard` without logging in again

### 2. Verify Data Cleared
1. After logging in, open Browser DevTools (F12)
2. Go to "Application" tab → "Local Storage"
3. Find `user-storage` key
4. You should see your user data
5. Click logout
6. **Expected Results:**
   - `user-storage` should show `user: null`
   - All user data cleared

### 3. Test Protected Route Access
1. Logout from dashboard
2. Try to manually navigate to `/dashboard` by typing in URL
3. **Expected Results:**
   - You should see the dashboard but with no user data
   - Or implement auth guard to redirect to login

### 4. Test Offline Logout
1. Login to dashboard
2. Open DevTools → Network tab
3. Set to "Offline" mode
4. Click logout
5. **Expected Results:**
   - Logout still works
   - User is cleared
   - Redirected to login
   - No errors shown

### 5. Test Multiple Clicks
1. Login to dashboard
2. Rapidly click logout button multiple times
3. **Expected Results:**
   - Button becomes disabled (shows "Logging out...")
   - Only one logout request
   - Successfully logs out

## Verification Checklist

After clicking logout, verify:

- [ ] Button shows loading state ("Logging out...")
- [ ] Button is disabled during logout
- [ ] Redirected to `/auth/login`
- [ ] Page refreshes
- [ ] localStorage `user-storage` shows `user: null`
- [ ] Cannot access dashboard without login
- [ ] No errors in console
- [ ] No errors shown to user
- [ ] Works when API fails
- [ ] Works when offline

## Common Issues & Solutions

### Issue: Still see user data after logout
**Check:**
- Open DevTools → Application → Local Storage
- Look for `user-storage` key
- Should show `user: null`

**If not cleared:**
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check if persist middleware is working

### Issue: Not redirected to login
**Check:**
- Console for errors
- Network tab for failed requests
- Make sure `router.push('/auth/login')` is called

**Solution:**
- The fix ensures navigation always happens
- Check if there's a middleware blocking navigation

### Issue: Can still access dashboard
**Solution:**
- Add auth guard to dashboard page:
```typescript
useEffect(() => {
  if (!user) {
    router.push('/auth/login');
  }
}, [user, router]);
```

### Issue: Error shown after logout
**Check:**
- Console for error details
- The fix clears errors in `finally` block

**Solution:**
- Error should not be shown to user
- Only logged to console for debugging

## Browser DevTools Inspection

### Check localStorage
```javascript
// In browser console
localStorage.getItem('user-storage')
// Should show: {"state":{"user":null,"hasHydrated":true},"version":0}
```

### Check Zustand store
```javascript
// In browser console (if you have React DevTools)
// Look for useAuthStore
// user should be null
```

### Check Network
1. Open Network tab
2. Click logout
3. Look for DELETE request to logout endpoint
4. Should see 200 or 204 response (or fail gracefully)

## Test Scenarios

### Scenario 1: Happy Path
- ✅ Login successful
- ✅ Dashboard loads
- ✅ Logout successful
- ✅ Redirected to login
- ✅ Data cleared

### Scenario 2: API Failure
- ✅ Login successful
- ✅ Dashboard loads
- ❌ Logout API fails (500 error)
- ✅ Still logs out locally
- ✅ Redirected to login
- ✅ Data cleared

### Scenario 3: Network Offline
- ✅ Login successful (while online)
- ✅ Dashboard loads
- 📡 Go offline
- ✅ Logout still works
- ✅ Redirected to login
- ✅ Data cleared

### Scenario 4: Expired Token
- ✅ Login successful
- ⏰ Wait for token to expire
- ✅ Click logout
- ❌ API returns 401
- ✅ Still logs out locally
- ✅ Redirected to login

## Automated Testing (Future)

### Unit Test Example
```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/store';

describe('AuthStore Logout', () => {
  it('should clear user on logout', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    // Set user
    act(() => {
      result.current.setUser(mockUser);
    });
    
    expect(result.current.user).toBeDefined();
    
    // Logout
    await act(async () => {
      await result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
```

### Integration Test Example
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/[locale]/dashboard/page';

describe('Dashboard Logout', () => {
  it('should logout and redirect', async () => {
    const { container } = render(<DashboardPage />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('Logging out...')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/auth/login');
    });
  });
});
```

## Performance Check

After logout, verify:
- [ ] No memory leaks (check DevTools Memory tab)
- [ ] No lingering intervals/timers
- [ ] Dashboard store cleared
- [ ] No unnecessary re-renders
- [ ] Fast redirect (< 500ms)

## Security Check

After logout, verify:
- [ ] Cannot access protected routes
- [ ] API tokens cleared
- [ ] Session cookies cleared
- [ ] No sensitive data in localStorage
- [ ] No sensitive data in sessionStorage
- [ ] No sensitive data in memory

## Success Criteria

✅ Logout works 100% of the time
✅ Works in all scenarios (online, offline, API fail)
✅ No errors shown to user
✅ Complete data cleanup
✅ Fast and responsive
✅ Good UX with loading states

---

**Status:** ✅ All tests should pass
**Last Updated:** October 31, 2025
