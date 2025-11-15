'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/confirm-dialog';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Key,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { User, Gender } from '../types/user.types';
import { useDeleteUserMutation, useActivateUserMutation } from '../api/userApi';
import { toast } from 'sonner';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onUpdateRoles: (user: User) => void;
  onUpdatePassword: (user: User) => void;
  isDeleted?: boolean;
}

const genderLabels: Record<Gender, string> = {
  [Gender.MALE]: 'Male',
  [Gender.FEMALE]: 'Female',
  [Gender.OTHER]: 'Other',
};

export function UserTable({
  users,
  onEdit,
  onUpdateRoles,
  onUpdatePassword,
  isDeleted = false,
}: UserTableProps) {
  const [deleteUser] = useDeleteUserMutation();
  const [activateUser] = useActivateUserMutation();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: number | null;
  }>({ open: false, userId: null });

  const handleDelete = async () => {
    if (!deleteDialog.userId) return;

    try {
      await deleteUser(deleteDialog.userId).unwrap();
      toast.success('User deleted successfully');
      setDeleteDialog({ open: false, userId: null });
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to delete user');
    }
  };

  const handleActivate = async (userId: number) => {
    try {
      await activateUser(userId).unwrap();
      toast.success('User activated successfully');
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || 'Failed to activate user');
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.gender ? (
                      <Badge
                        variant={
                          user.gender === Gender.MALE
                            ? 'default'
                            : user.gender === Gender.FEMALE
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {genderLabels[user.gender]}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.dob ? format(new Date(user.dob), 'dd/MM/yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge key={role.name} variant="secondary">
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateRoles(user)}>
                          <Shield className="mr-2 h-4 w-4" />
                          Update Roles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUpdatePassword(user)}
                        >
                          <Key className="mr-2 h-4 w-4" />
                          Change Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {isDeleted ? (
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() => handleActivate(user.id)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              setDeleteDialog({ open: true, userId: user.id })
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={deleteDialog.open}
        // ConfirmDialog hiển thị dựa trên deleteDialog.open (true/false)
        onOpenChange={(open) =>
          setDeleteDialog({ open, userId: deleteDialog.userId })
        }
        // khi người dùng bấm close, ESC, click outside, hoặc
        // dialog thay đổi state → callback nhận giá trị mới của open.
        onConfirm={handleDelete}
        title="Confirm Deletion"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}
