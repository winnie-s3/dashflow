import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <DashboardClient />
        </section>
      </div>
    </main>
  );
}