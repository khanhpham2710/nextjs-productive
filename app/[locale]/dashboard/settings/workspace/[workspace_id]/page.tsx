import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import InviteUsers from "@/components/invite/InviteUsers";
import WorkspaceTab from "@/components/settings/workspace/WorkspaceTab";
import { getWorkspaceSettings } from "@/lib/api";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import { notFound } from "next/navigation";

interface Params {
  params: Promise<{
    workspace_id: string;
  }>;
}

async function Workspace({ params }: Params) {
  const { workspace_id } = await params;
  const session = await checkifUserCompletedOnboarding(
    `/dashboard/settings/workplace/${workspace_id}`
  );
  const workspace = await getWorkspaceSettings(workspace_id, session.user.id);
  if (!workspace) notFound();

  const user = workspace.subscribers.find(
    (subscriber) => subscriber.user.id === session.user.id
  );

  return (
    <>
      <DashboardHeader
        className="mb-2 sm:mb-0"
        addManualRoutes={[
          {
            name: "DASHBOARD",
            href: "/dashboard",
            useTranslate: true,
          },
          {
            name: "Settings",
            href: "/dashboard/settings",
          },
          {
            name: workspace.name,
            href: "/",
          },
        ]}
      >
        {(user?.userRole === "ADMIN" || user?.userRole === "OWNER") && (
          <InviteUsers workspace={workspace} />
        )}
        <AddTaskShortcut userId={session.user.id} />
      </DashboardHeader>
      <main className="flex flex-col gap-2">
        <WorkspaceTab workspace={workspace} workspaceId={workspace.id} userRole={user?.userRole}/>
      </main>
    </>
  );
}

export default Workspace;
