import DashboardSidebar from "@/app/components/dashboard/Sidebar";
import DashboardTopbar from "@/app/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardTopbar />
        <main className="flex-1 p-6 bg-zinc-950/50">
          {children}
        </main>
      </div>
    </div>
  );
} 