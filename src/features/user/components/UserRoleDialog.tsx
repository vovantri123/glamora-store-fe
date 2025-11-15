'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User } from '../types/user.types';
import { useUpdateUserRolesMutation } from '../api/userApi';

interface UserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

// Only USER and ADMIN roles
const AVAILABLE_ROLES = [
  { name: 'USER', description: 'Regular user' },
  { name: 'ADMIN', description: 'Administrator' },
];

export function UserRoleDialog({
  open,
  onOpenChange,
  user,
}: UserRoleDialogProps) {
  const [updateUserRoles, { isLoading }] = useUpdateUserRolesMutation();

  // Roles state: initialize and sync only when dialog opens or selected user changes
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      const currentRoles = user?.roles.map((r) => r.name) || [];
      // Only set roles if it's different from current state to avoid unnecessary renders
      if (JSON.stringify(currentRoles) !== JSON.stringify(roles)) {
        setRoles(currentRoles);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.id, user?.roles]);

  const handleRoleToggle = (roleName: string) => {
    setRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (roles.length === 0) {
      toast.error('Please select at least one role');
      return;
    }

    try {
      await updateUserRoles({
        userId: user.id,
        data: { roleNames: roles },
      }).unwrap();
      toast.success('Roles updated successfully');
      onOpenChange(false);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to update roles');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Roles</DialogTitle>
          <DialogDescription>
            Select roles for user: {user?.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {AVAILABLE_ROLES.map((role) => (
            <div key={role.name} className="flex items-start space-x-3">
              <Checkbox
                id={role.name}
                checked={roles.includes(role.name)}
                onCheckedChange={() => handleRoleToggle(role.name)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor={role.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {role.name}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {role.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
