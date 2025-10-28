'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ArrowLeft, KeyRound, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useResetPasswordMutation } from '@/features/auth/api/authApi';

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!email) {
      toast.error('Email is required');
      router.push('/forgot-password');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    // Client-side password confirmation check
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const result = await resetPassword({
        email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      }).unwrap();

      toast.success(result.message || 'Password reset successfully!');
      router.push('/login');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error) {
        const errData = error.data as { message?: string };
        toast.error(
          errData.message || 'Password reset failed. Please try again.'
        );
      } else {
        toast.error('Password reset failed. Please try again.');
      }
    }
  };

  return (
    <div className="bg-muted flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="bg-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <KeyRound className="text-primary-foreground h-8 w-8" />
          </div>
          <CardTitle className="text-primary text-2xl font-bold">
            Reset your password
          </CardTitle>
          <CardDescription className="text-base">
            Enter the code sent to
            <br />
            <span className="text-foreground font-semibold">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <Label
                htmlFor="otp"
                className="block text-center text-sm font-medium"
              >
                Enter Reset Code
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={formData.otp}
                  onChange={(value) => setFormData({ ...formData, otp: value })}
                  disabled={isLoading}
                  className="gap-3"
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot
                      index={0}
                      className="hover:border-primary focus:border-primary focus:ring-primary/20 h-14 w-14 rounded-xl border-2 text-xl font-bold transition-all duration-200 focus:ring-2"
                    />
                    <InputOTPSlot
                      index={1}
                      className="hover:border-primary focus:border-primary focus:ring-primary/20 h-14 w-14 rounded-xl border-2 text-xl font-bold transition-all duration-200 focus:ring-2"
                    />
                    <InputOTPSlot
                      index={2}
                      className="hover:border-primary focus:border-primary focus:ring-primary/20 h-14 w-14 rounded-xl border-2 text-xl font-bold transition-all duration-200 focus:ring-2"
                    />
                    <InputOTPSlot
                      index={3}
                      className="hover:border-primary focus:border-primary focus:ring-primary/20 h-14 w-14 rounded-xl border-2 text-xl font-bold transition-all duration-200 focus:ring-2"
                    />
                    <InputOTPSlot
                      index={4}
                      className="hover:border-primary focus:border-primary focus:ring-primary/20 h-14 w-14 rounded-xl border-2 text-xl font-bold transition-all duration-200 focus:ring-2"
                    />
                    <InputOTPSlot
                      index={5}
                      className="hover:border-primary focus:border-primary focus:ring-primary/20 h-14 w-14 rounded-xl border-2 text-xl font-bold transition-all duration-200 focus:ring-2"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                New Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  placeholder="Enter new password"
                  disabled={isLoading}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="text-muted-foreground h-4 w-4" />
                  ) : (
                    <Eye className="text-muted-foreground h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  disabled={isLoading}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="text-muted-foreground h-4 w-4" />
                  ) : (
                    <Eye className="text-muted-foreground h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || formData.otp.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Reset Password
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.push('/forgot-password')}
              disabled={isLoading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Forgot Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
