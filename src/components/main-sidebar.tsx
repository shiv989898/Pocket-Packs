'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppLogo } from './app-logo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useUser } from '@/contexts/user-provider';
import { LayoutDashboard, PackageOpen, Layers3, Store, LogOut, Wallet, Gem } from 'lucide-react';
import { Separator } from './ui/separator';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/open-packs', label: 'Open Packs', icon: PackageOpen },
  { href: '/dashboard/collection', label: 'Collection', icon: Layers3 },
  { href: '/dashboard/store', label: 'Store', icon: Store },
];

export function MainSidebar() {
  const pathname = usePathname();
  const { currency, packs } = useUser();

  return (
    <SidebarProvider>
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
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <Separator className="my-2" />
          <div className="flex flex-col gap-2 p-2 text-sm text-foreground/80 group-data-[collapsible=icon]:items-center">
            <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-accent" />
                <span className="font-semibold group-data-[collapsible=icon]:hidden">{currency.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
                <Gem className="h-5 w-5 text-accent" />
                <span className="font-semibold group-data-[collapsible=icon]:hidden">{packs} Packs</span>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-foreground">User</span>
              <span className="text-xs text-muted-foreground">user@email.com</span>
            </div>
            <Link href="/" legacyBehavior passHref>
              <Button asChild variant="ghost" size="icon" className="ml-auto group-data-[collapsible=icon]:ml-0">
                <a>
                  <LogOut />
                </a>
              </Button>
            </Link>
          </div>
        </SidebarFooter>
      </Sidebar>
       <SidebarInset>
       {/* This is a placeholder for main content if we used this structure */}
      </SidebarInset>
    </SidebarProvider>
  );
}
