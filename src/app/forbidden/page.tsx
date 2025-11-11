'use client';

import Link from 'next/link';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
      <Card className="w-full max-w-2xl border-none shadow-2xl">
        <CardContent className="p-8 text-center md:p-12">
          {/* 403 Icon */}
          <div className="mb-8">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-6xl font-bold text-transparent">
              403
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Access Denied</h2>
            <p className="text-lg text-gray-600">
              You don&apos;t have permission to access this resource. Please
              contact the administrator if you believe this is an error.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            {/* <Link href="/products">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go to Shop
              </Button>
            </Link> */}
            <Link href="/">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 sm:w-auto"
              >
                <Home className="mr-2 h-5 w-5" />
                Go to Homepage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
