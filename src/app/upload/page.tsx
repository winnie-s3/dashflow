import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { UploadCsv } from "@/components/dashboard/UploadCsv";

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex min-h-screen">
          <Sidebar />

          <section className="flex-1 p-6 md:p-8">
            <UploadCsv />
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}