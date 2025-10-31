import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { ModeToggle } from '@/components/mode-toggle';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen>
            <AppSidebar />
            <main className="flex-1 w-full min-w-0 min-h-screen bg-background">
                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 h-16 px-6 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger />
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <ModeToggle />
                    </div>
                </div>
                <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">{children}</div>
            </main>
        </SidebarProvider>
    );
}
