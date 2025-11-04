'use client';

import { PasswordChangeForm } from '@/features/auth/components';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="mt-1 text-muted-foreground">
          Manage your account security settings
        </p>
      </div>
      <PasswordChangeForm />
    </div>
  );
}
