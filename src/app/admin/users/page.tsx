'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search } from 'lucide-react';
import {
  UserTable,
  UserFormDialog,
  UserRoleDialog,
  UserPasswordDialog,
  useGetUsersQuery,
  User,
} from '@/features/user';
import { CustomPagination } from '@/components/common/CustomPagination';

export default function UsersPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleted, setIsDeleted] = useState(false);

  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });
  const [roleDialog, setRoleDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });
  const [passwordDialog, setPasswordDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });

  const { data, isLoading, isFetching } = useGetUsersQuery({
    page,
    size,
    sortBy,
    sortDir,
    fullname: searchTerm || undefined,
    isDeleted,
  });

  const users = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;
  const totalElements = data?.data?.totalElements || 0;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleEdit = (user: User) => {
    setFormDialog({ open: true, user });
  };

  const handleUpdateRoles = (user: User) => {
    setRoleDialog({ open: true, user });
  };

  const handleUpdatePassword = (user: User) => {
    setPasswordDialog({ open: true, user });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts in the system
          </p>
        </div>
        <Button onClick={() => setFormDialog({ open: true, user: null })}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by user name..."
                className="h-10 pl-9"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isDeleted"
                  checked={isDeleted}
                  onCheckedChange={(checked) => {
                    setIsDeleted(checked as boolean);
                    setPage(0);
                  }}
                />
                <label
                  htmlFor="isDeleted"
                  className="cursor-pointer text-sm font-medium"
                >
                  Show deleted users
                </label>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Sort by:
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">ID</SelectItem>
                    <SelectItem value="fullName">Name</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="createdAt">Created</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Order:
                </span>
                <Select
                  value={sortDir}
                  onValueChange={(value) => setSortDir(value as 'asc' | 'desc')}
                >
                  <SelectTrigger className="h-9 w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Show:
                </span>
                <Select
                  value={size.toString()}
                  onValueChange={(value) => {
                    setSize(Number(value));
                    setPage(0);
                  }}
                >
                  <SelectTrigger className="h-9 w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading || isFetching ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              <UserTable
                users={users}
                onEdit={handleEdit}
                onUpdateRoles={handleUpdateRoles}
                onUpdatePassword={handleUpdatePassword}
                isDeleted={isDeleted}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <CustomPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <UserFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open, user: formDialog.user })}
        user={formDialog.user}
      />

      <UserRoleDialog
        open={roleDialog.open}
        onOpenChange={(open) => setRoleDialog({ open, user: roleDialog.user })}
        user={roleDialog.user}
      />

      <UserPasswordDialog
        open={passwordDialog.open}
        onOpenChange={(open) =>
          setPasswordDialog({ open, user: passwordDialog.user })
        }
        user={passwordDialog.user}
      />
    </div>
  );
}
