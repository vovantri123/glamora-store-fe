'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
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

import { useVerifyRegisterOtpMutation } from '@/features/auth/api/authApi';
import { useGuestGuard } from '@/features/auth/hooks';

function VerifyOtpFormContent() {
  useGuestGuard();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [verifyOtp, { isLoading }] = useVerifyRegisterOtpMutation();

  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (!email) {
      toast.error('Email is required');
      router.push('/register');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    try {
      const result = await verifyOtp({ email, otp }).unwrap();
      toast.success(result.message || 'Email verified successfully!');
      router.push('/login');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'data' in error) {
        const errData = error.data as { message?: string };
        toast.error(
          errData.message || 'Verification failed. Please try again.'
        );
      } else {
        toast.error('Verification failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Verify your email
          </CardTitle>
          <CardDescription className="text-base">
            We&apos;ve sent a 6-digit verification code to
            <br />
            <span className="font-semibold text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label
                htmlFor="otp"
                className="block text-center text-sm font-medium"
              >
                Enter Verification Code
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isLoading}
                  className="gap-3"
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot
                      index={0}
                      className="h-14 w-14 rounded-xl border-2 text-xl font-bold transition-all duration-200 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-14 w-14 rounded-xl border-2 text-xl font-bold transition-all duration-200 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-14 w-14 rounded-xl border-2 text-xl font-bold transition-all duration-200 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <InputOTPSlot
                      index={3}
                      className="h-14 w-14 rounded-xl border-2 text-xl font-bold transition-all duration-200 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <InputOTPSlot
                      index={4}
                      className="h-14 w-14 rounded-xl border-2 text-xl font-bold transition-all duration-200 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <InputOTPSlot
                      index={5}
                      className="h-14 w-14 rounded-xl border-2 text-xl font-bold transition-all duration-200 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Please enter the 6-digit code sent to your email
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verify Email
                </>
              )}
            </Button>

            <div className="space-y-2">
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => router.push('/register')}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Register
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive the code?{' '}
                <button
                  type="button"
                  className="font-medium text-primary transition-colors hover:underline"
                  onClick={() =>
                    toast.info(
                      'Please check your spam folder or try registering again'
                    )
                  }
                >
                  Resend
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export function VerifyOtpForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <VerifyOtpFormContent />
    </Suspense>
  );
}
