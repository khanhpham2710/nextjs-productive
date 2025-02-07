import { Sidebar } from "@/components/sidebar/Sidebar";
import { ToggleSidebarProvider } from "@/context/ToggleSidebar";
import { UserActivityStatusProvider } from "@/context/UserActivityStatus";
import { UserEditableWorkspacesProvider } from "@/context/UserEditableWorkspaces";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session || !session.user) redirect("/login");

  return (
    <UserActivityStatusProvider>
      <UserEditableWorkspacesProvider>
        <ToggleSidebarProvider>
          <div className="flex min-h-screen w-full overflow-hidden">
            <Sidebar />
            <div className="relative p-4 md:p-6 lg:px-10 flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-background">
              {children}
            </div>
          </div>
        </ToggleSidebarProvider>
      </UserEditableWorkspacesProvider>
    </UserActivityStatusProvider>
  );
};

export default DashboardLayout;
