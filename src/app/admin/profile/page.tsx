'use client';

import { ProfileForm, PasswordChangeForm } from '@/features/auth/components';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="mt-1 text-muted-foreground">
          Manage your personal information
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
