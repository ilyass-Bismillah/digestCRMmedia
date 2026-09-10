import React from 'react';
import { Header } from '@/components/dashboard/Header';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileSidebar } from '@/components/dashboard/MobileSidebar';
import { GlobalModals } from '@/components/dashboard/GlobalModals';
import { AuthGuard } from '@/components/dashboard/AuthGuard';
import { DashboardProvider } from '@/lib/dashboard-context';
import { AuthProvider } from '@/lib/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <DashboardProvider>
          <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-[#931B58]/20 selection:text-[#931B58]">
            {/* Top Navigation Bar with deep magenta brand theme */}
            <Header />

            <div className="flex flex-1 w-full">
              {/* Left Desktop Sidebar */}
              <Sidebar />

              {/* Mobile Sheet Navigation */}
              <MobileSidebar />

              {/* Main Content Area */}
              <main className="flex-1 w-full overflow-x-hidden p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
                <div className="mx-auto max-w-7xl">
                  {children}
                </div>
              </main>
            </div>

            {/* Global Action Modals (Add Client, Task, Ticket, Payout, Search) */}
            <GlobalModals />
          </div>
        </DashboardProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
