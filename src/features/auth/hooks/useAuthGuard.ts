'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';

// Use in pages/components that should be accessible only to authenticated users
// For example: dashboard, profile pages,...
export function useAuthGuard() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated, user };
}

// Use in pages/components that should be accessible only to guests (unauthenticated users)
// For example: login, registration pages,...
export function useGuestGuard() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return { isAuthenticated };
}
