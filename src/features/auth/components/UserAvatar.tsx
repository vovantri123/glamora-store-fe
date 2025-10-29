'use client';

import { useGetProfileQuery } from '@/features/auth/api/authApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export function UserAvatar() {
  const { data: profileData, isLoading } = useGetProfileQuery();

  if (isLoading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  const user = profileData?.data;

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage
        src={user?.avatar || undefined}
        alt={user?.fullName || 'User'}
      />
      <AvatarFallback>
        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
      </AvatarFallback>
    </Avatar>
  );
}

interface UserInfoProps {
  className?: string;
}

export function UserInfo({ className = '' }: UserInfoProps) {
  const { data: profileData, isLoading } = useGetProfileQuery();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  const user = profileData?.data;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={user?.avatar || undefined}
          alt={user?.fullName || 'User'}
        />
        <AvatarFallback>
          {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{user?.fullName || 'User'}</span>
        <span className="text-xs text-muted-foreground">
          {user?.email || ''}
        </span>
      </div>
    </div>
  );
}
