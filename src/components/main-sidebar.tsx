'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppLogo } from './app-logo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useUser } from '@/contexts/user-provider';
import { LayoutDashboard, PackageOpen, Layers3, Store, LogOut, Wallet, Gem } from 'lucide-react';
import { Separator } from './ui/separator';
import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/open-packs', label: 'Open Packs', icon: PackageOpen },
  { href: '/dashboard/collection', label: 'Collection', icon: Layers3 },
  { href: '/dashboard/store', label: 'Store', icon: Store },
];

export function MainSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, currency, packs, username } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    try {
        await signOut(auth);
        toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
        router.push('/');
    } catch (error) {
        toast({ title: 'Logout Failed', description: 'There was an error logging out.', variant: 'destructive' });
    }
  };

  const renderStat = (value: string | number) => {
    if (!isClient || loading) {
        return <Skeleton className="h-5 w-full" />;
    }
    return value;
  };

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader>
        <div className="flex w-full items-center justify-between p-2">
          <AppLogo />
          <SidebarTrigger className="hidden md:flex"/>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Separator className="my-2" />
        <div className="flex flex-col gap-2 p-2 text-sm text-foreground/80 group-data-[collapsible=icon]:items-center">
          <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-accent" />
              <div className="font-semibold group-data-[collapsible=icon]:hidden w-16">
                {renderStat(currency.toLocaleString())}
              </div>
          </div>
          <div className="flex items-center gap-2">
              <Gem className="h-5 w-5 text-accent" />
              <div className="font-semibold group-data-[collapsible=icon]:hidden w-16">
                 {renderStat(`${packs} Packs`)}
              </div>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL ?? "https://placehold.co/100x100.png"} alt={username} data-ai-hint="person avatar" />
            <AvatarFallback>{username ? username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-foreground">{loading ? <Skeleton className="h-5 w-20" /> : username}</span>
            <span className="text-xs text-muted-foreground">{loading ? <Skeleton className="h-4 w-28 mt-1" /> : user?.email}</span>
          </div>
          <Button asChild variant="ghost" size="icon" className="ml-auto group-data-[collapsible=icon]:ml-0" onClick={handleLogout}>
            <div>
              <LogOut />
            </div>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
