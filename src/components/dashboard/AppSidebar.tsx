'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useAuthStore } from '@/store';
import { useLocale } from '@/hooks/useLocale';
import { useTranslations } from 'next-intl';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
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

export function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const { direction } = useLocale();
    const t = useTranslations('Sidebar');
    const sidebarSide = direction === 'rtl' ? 'right' : 'left';

    const menuItems = [
        {
            title: t('dashboard'),
            url: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            title: t('categories'),
            url: '/categories',
            icon: FolderOpen,
        },
        {
            title: t('products'),
            url: '/products',
            icon: Package,
        },
        {
            title: t('profile'),
            url: '/profile',
            icon: User,
        },
    ];

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
        <Sidebar collapsible="icon" side={sidebarSide}>
            <SidebarHeader className="border-b border-sidebar-border h-16 px-2 flex items-center justify-center group-data-[collapsible=icon]:px-2">
                <div className="flex items-center gap-2 w-full group-data-[collapsible=icon]:justify-center">
                    <Store className="h-6 w-6 text-sidebar-primary shrink-0" />
                    <h1 className="fz-20 font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                        {t('title')}
                    </h1>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    {/* <SidebarGroupLabel className="fz-12 px-4">
                        Navigation
                    </SidebarGroupLabel> */}
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
                            <span>{t('logout')}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
