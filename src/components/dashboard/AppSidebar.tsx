'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useAuthStore } from '@/store';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    User,
    LogOut,
    Store,
} from 'lucide-react';

const menuItems = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Categories',
        url: '/categories',
        icon: FolderOpen,
    },
    {
        title: 'Products',
        url: '/products',
        icon: Package,
    },
    {
        title: 'Profile',
        url: '/profile',
        icon: User,
    },
];

export function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/auth/login');
            setTimeout(() => {
                window.location.href = '/auth/login';
            }, 100);
        } catch (error) {
            console.error('Logout failed:', error);
            window.location.href = '/auth/login';
        }
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-sidebar-border px-2 py-4 group-data-[collapsible=icon]:px-2">
                <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                    <Store className="h-6 w-6 text-sidebar-primary shrink-0" />
                    <h1 className="fz-20 font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                        Sofra Dashboard
                    </h1>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="fz-12 px-4">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            onClick={() => router.push(item.url)}
                                            isActive={isActive}
                                            className="fz-14"
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-4">
                <div className="mb-3 px-2">
                    <p className="fz-14 font-medium text-sidebar-foreground truncate">
                        {user?.fullname || 'User'}
                    </p>
                    <p className="fz-12 text-sidebar-foreground/60 truncate">
                        {user?.email}
                    </p>
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} className="fz-14">
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
