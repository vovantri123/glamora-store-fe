'use client';

import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import { useAppDispatch } from '@/lib/store/hooks';
import { logout } from '../store/authSlice';
import { resetApiState } from '@/lib/api/baseApi';
import { toast } from 'sonner';

interface UserMenuProps {
  user?: {
    fullName?: string;
    email?: string;
    avatar?: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetApiState());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/20">
            <AvatarImage src={user?.avatar || undefined} alt={user?.fullName} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-sm text-white">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left xl:block">
            <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push('/admin/profile')}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/admin/settings')}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Change Password</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
