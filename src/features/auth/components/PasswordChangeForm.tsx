'use client';

import { useState } from 'react';
import { useUpdatePasswordMutation } from '../api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

export function PasswordChangeForm() {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user types
    if (field === 'newPassword' || field === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      newPassword: '',
      confirmPassword: '',
    };

    if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !newErrors.newPassword && !newErrors.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updatePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      toast.success('Password updated successfully!');
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: unknown) {
      console.error('Update password error:', error);
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = error.data as { message?: string };
        toast.error(
          errorData?.message || 'Failed to update password. Please try again.'
        );
      } else {
        toast.error('Failed to update password. Please try again.');
      }
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Lock className="h-6 w-6" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Old Password */}
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current Password</Label>
            <Input
              id="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={(e) => handleChange('oldPassword', e.target.value)}
              placeholder="Enter your current password"
              required
            />
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              placeholder="Enter new password (minimum 8 characters)"
              required
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Re-enter new password"
              required
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                })
              }
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
