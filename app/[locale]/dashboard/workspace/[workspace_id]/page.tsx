
import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import InviteUsers from "@/components/invite/InviteUsers";
import FilterContainer from "@/components/workspaceMainPage/filter/FilterContainer";
import RecentActivityContainer from "@/components/workspaceMainPage/recentActivity/RecentActivityContainer";
import { LeaveWorkspace } from "@/components/workspaceMainPage/shortcuts/leaveWorkspace/LeaveWorkspace";
import { ShortcutContainer } from "@/components/workspaceMainPage/shortcuts/ShortcutContainer";
import { FilterByUsersAndTagsInWorkspaceProvider } from "@/context/FilterByUsersAndTagsInWorkspace";
import { getUserWorkspaceRole, getWorkspaceWithChatId, } from "@/lib/api";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

interface Params {
  params: Promise<{
    workspace_id: string;
  }>;
}

const getWorkspace = cache(getWorkspaceWithChatId);
const getSession = cache(checkifUserCompletedOnboarding)

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { workspace_id } = await params
  
  const session = await getSession(`/dashboard/settings/workplace/${workspace_id}`)
  const workspace = await getWorkspace(workspace_id, session.user.id);

  return {
    title: workspace.name,
  };
}

async function Workspace({ params }: Params) {
  const { workspace_id } = await params
  const session = await checkifUserCompletedOnboarding(
    `/dashboard/settings/workplace/${workspace_id}`
  );

  const [workspace, userRole] = await Promise.all([
    getWorkspaceWithChatId(workspace_id, session.user.id),
    getUserWorkspaceRole(workspace_id, session.user.id),
  ]);

  if (!workspace || !userRole) notFound();

  return (
    <>
      <FilterByUsersAndTagsInWorkspaceProvider>
      <DashboardHeader
        addManualRoutes={[
          {
            name: "DASHBOARD",
            href: "/dashboard",
            useTranslate: true,
          },
          {
            name: workspace.name,
            href: `/dashboard/workspace/${workspace_id}`,
          },
        ]}
      >
        {(userRole === "ADMIN" || userRole === "OWNER") && (
          <InviteUsers workspace={workspace} />
        )}
        {userRole !== "OWNER" && <LeaveWorkspace workspace={workspace} />}
        <AddTaskShortcut />
      </DashboardHeader>
      <main className="flex flex-col gap-2 w-full">
        <ShortcutContainer workspace={workspace} userRole={userRole} />
        <FilterContainer sessionUserId={session.user.id} />
        <RecentActivityContainer
          userId={session.user.id}
          workspaceId={workspace.id}
        />
      </main>
    </FilterByUsersAndTagsInWorkspaceProvider>
    </>
  );
}

export default Workspace;
