'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/features/auth/components';
import { Menu } from 'lucide-react';

interface DashboardHeaderProps {
  user?: {
    fullName?: string;
    email?: string;
    avatar?: string;
  };
  navigationItems: Array<{ name: string; href: string }>;
  onMenuClick: () => void;
}

export function DashboardHeader({
  user,
  navigationItems,
  onMenuClick,
}: DashboardHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 px-6 backdrop-blur-sm dark:bg-slate-950/80">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1">
        <h1 className="text-lg font-semibold">
          {navigationItems.find((item) => item.href === pathname)?.name ||
            'Dashboard'}
        </h1>
      </div>

      {/* User Menu */}
      <UserMenu user={user} />
    </header>
  );
}
