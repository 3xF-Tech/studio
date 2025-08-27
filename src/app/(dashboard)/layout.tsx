
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  UserCircle,
  FileText,
  MessageSquare,
  Users,
  Newspaper,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { AuthProvider, useAuth } from '@/lib/firebase/auth.tsx';
import { logout } from '@/lib/firebase/auth.ts';
import { useRouter } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'secretary', 'finance', 'marketing', 'readonly', 'professional'] },
  { href: '/calendar', label: 'Agenda', icon: Calendar, roles: ['admin', 'secretary', 'professional'] },
  { href: '/crm', label: 'Pacientes', icon: Users, roles: ['admin', 'secretary', 'professional'] },
  { href: '/campaigns', label: 'Campanhas', icon: MessageSquare, roles: ['admin', 'marketing'] },
  { href: '/reports', label: 'Relatórios', icon: FileText, roles: ['admin', 'finance'] },
  { href: '/blog', label: 'Publicações', icon: Newspaper, roles: ['admin', 'marketing'] },
];

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, userRole, auth } = useAuth(); // Get auth instance from context
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await logout(auth); // Pass auth instance to logout
      router.push('/login');
    }
  };
  
  if (!user) {
    return null; // Or a loading spinner
  }

  const allowedMenuItems = menuItems.filter(item => item.roles.includes(userRole || ''));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2">
              <Icons.Logo className="w-8 h-8 text-sidebar-primary" />
              <span className="text-lg font-headline font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                Carvalhal
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {allowedMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={{ children: item.label, side: 'right' }}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
                 <SidebarMenuItem>
                    <Link href="/settings" legacyBehavior passHref>
                        <SidebarMenuButton 
                         isActive={pathname === '/settings'}
                         tooltip={{ children: 'Configurações', side: 'right' }}>
                            <Settings />
                            <span>Configurações</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip={{ children: 'Sair', side: 'right' }} onClick={handleLogout}>
                        <LogOut />
                        <span>Sair</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
             <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              {/* You can add a title here if needed */}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <UserCircle className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta ({userRole})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">Configurações</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Suporte</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 bg-muted/40">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthProvider>
  );
}
