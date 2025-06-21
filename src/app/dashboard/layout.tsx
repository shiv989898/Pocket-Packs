import { MainSidebar } from "@/components/main-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className="overflow-auto p-4 sm:p-6 md:p-8">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
