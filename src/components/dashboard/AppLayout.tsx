import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileHeader } from "@/components/dashboard/MobileHeader";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex min-h-screen w-full overflow-x-hidden">
          <Sidebar />

          <div className="flex min-h-screen min-w-0 flex-1 flex-col">
            <MobileHeader />

            <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 md:p-8">
              {children}
            </section>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}