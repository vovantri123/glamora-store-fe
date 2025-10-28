'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppDispatch } from '@/lib/store/hooks';
import { logout } from '@/features/auth/store/authSlice';
import { resetApiState } from '@/lib/api/baseApi';
import { toast } from 'sonner';
import { LogOut, User } from 'lucide-react';
import { useAuthGuard } from '@/features/auth/hooks';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuthGuard();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetApiState());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-linear-to-br min-h-screen from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-4xl space-y-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your account details and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-lg font-semibold">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Full Name
                </p>
                <p className="text-lg font-semibold">{user?.fullName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User ID
                </p>
                <p className="font-mono text-lg">{user?.id}</p>
              </div>
            </div>

            {user?.roles && user.roles.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Roles
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Glamora Store</CardTitle>
            <CardDescription>
              You are successfully logged in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is your dashboard. You can start exploring the features of
              Glamora Store from here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
