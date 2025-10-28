'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/lib/store/hooks';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 font-sans dark:from-black dark:to-slate-900">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 px-8 py-16 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-black dark:text-zinc-50">
            Welcome to Glamora Store
          </h1>
          <p className="mx-auto max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Your premium fashion destination. Discover the latest trends and
            exclusive collections.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={() => router.push('/login')}
            className="min-w-[150px]"
          >
            Sign In
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push('/register')}
            className="min-w-[150px]"
          >
            Create Account
          </Button>
        </div>

        <div className="text-muted-foreground mt-8 text-sm">
          <p>Experience premium fashion shopping</p>
        </div>
      </main>
    </div>
  );
}
