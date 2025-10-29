'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, LogIn, Mail, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useLoginMutation, authApi } from '@/features/auth/api/authApi';
import { useAppDispatch } from '@/lib/store/hooks';
import {
  setCredentials,
  setLoading,
  setError,
} from '@/features/auth/store/authSlice';
import { useGuestGuard } from '@/features/auth/hooks/useAuthGuard';

export function LoginForm() {
  useGuestGuard(); // Redirect to dashboard if already authenticated
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const result = await login(formData).unwrap();

      if (result.data?.accessToken) {
        // Store token temporarily to make authenticated request
        if (typeof window !== 'undefined') {
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('accessToken', result.data.accessToken);
        }

        // Fetch user profile with the token
        const profileResult = await dispatch(
          authApi.endpoints.getProfile.initiate()
        ).unwrap();

        if (!profileResult.data) {
          throw new Error('Failed to fetch user profile');
        }

        // Decode token to get roles from scope
        const tokenPayload = JSON.parse(
          atob(result.data.accessToken.split('.')[1])
        );

        // Store credentials with user profile data
        dispatch(
          setCredentials({
            user: {
              id: profileResult.data.id!,
              fullName: profileResult.data.fullName || '',
              email: profileResult.data.email || '',
              gender: profileResult.data.gender,
              dob: profileResult.data.dob,
              avatar: profileResult.data.avatar,
              roles: tokenPayload.scope?.split(' ') || [],
            },
            accessToken: result.data.accessToken,
            rememberMe,
          })
        );

        toast.success(result.message || 'Login successful!');
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error) {
        const errData = error.data as { message?: string };
        const errorMessage =
          errData.message || 'Login failed. Please try again.';
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
      } else {
        const errorMessage = 'Login failed. Please try again.';
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg">
            <LogIn className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your.email@example.com"
                  disabled={isLoading}
                  required
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  disabled={isLoading}
                  required
                  className="h-11 pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  disabled={isLoading}
                />
                <label
                  htmlFor="rememberMe"
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary transition-colors hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="h-11 w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary transition-colors hover:underline"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
