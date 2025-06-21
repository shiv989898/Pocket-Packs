import { MainSidebar } from "@/components/main-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <MainSidebar />
      <main className="flex-1 overflow-auto bg-background p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
