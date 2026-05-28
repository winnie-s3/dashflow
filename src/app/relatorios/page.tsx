import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ReportsClient } from "@/components/dashboard/ReportsClient";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar />

          <section className="flex-1 p-6 md:p-8">
            <ReportsClient />
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}