'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearUser();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear user anyway
      clearUser();
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg shadow-md p-8">
          <h1 className="fz-25 font-bold text-foreground mb-6">Dashboard</h1>

          {user && (
            <div className="space-y-4">
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <h2 className="fz-16 font-semibold text-foreground mb-3">User Information</h2>
                <div className="space-y-2 fz-14">
                  <p><span className="font-medium">ID:</span> {user.id}</p>
                  <p><span className="font-medium">Name:</span> {user.fullname}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Email Verified:</span> {user.emailVerified ? '✅ Yes' : '❌ No'}</p>
                  {user.role && <p><span className="font-medium">Role:</span> {user.role}</p>}
                  {user.firstname && <p><span className="font-medium">First Name:</span> {user.firstname}</p>}
                  {user.lastname && <p><span className="font-medium">Last Name:</span> {user.lastname}</p>}
                  <p><span className="font-medium">Joined:</span> {new Date(user.joinedAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(user.lastUpdatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <Button onClick={handleLogout} variant="destructive" className="fz-16">
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
