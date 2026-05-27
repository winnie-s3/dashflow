import { Sidebar } from "@/components/dashboard/Sidebar";
import { UploadCsv } from "@/components/dashboard/UploadCsv";

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <UploadCsv />
        </section>
      </div>
    </main>
  );
}