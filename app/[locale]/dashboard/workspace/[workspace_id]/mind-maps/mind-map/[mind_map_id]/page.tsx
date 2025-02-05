import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import InviteUsers from "@/components/invite/InviteUsers";
import MindMapPreviewCardWrapper from "@/components/mindMaps/preview/MindMapCardPreviewWrapper";
import { AutosaveIndicatorProvider } from "@/context/AutosaveIndicator";
import { AutoSaveMindMapProvider } from "@/context/AutoSaveMindMap";
import { getUserWorkspaceRole, getWorkspace } from "@/lib/api";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import { notFound } from "next/navigation";

interface Params {
  params: {
    workspace_id: string;
    mind_map_id: string;
  };
}

export default async function MindMapPage({ params }: Params) {
  const { workspace_id, mind_map_id } = await params;

  const session = await checkifUserCompletedOnboarding(
    `/dashboard/workspace/${workspace_id}/tasks/task/${mind_map_id}`
  );

  const [workspace, userRole] = await Promise.all([
    getWorkspace(workspace_id, session.user.id),
    getUserWorkspaceRole(workspace_id, session.user.id),
  ]);

  if (!workspace || !userRole) notFound();

  const canEdit = userRole === "ADMIN" || userRole === "OWNER" ? true : false;

  return (
    <AutosaveIndicatorProvider>
      <AutoSaveMindMapProvider>
        <DashboardHeader showBackBtn hideBreadCrumb>
          {canEdit && <InviteUsers workspace={workspace} />}
          <AddTaskShortcut userId={session.user.id} />
        </DashboardHeader>
        <main className="flex flex-col gap-2 h-full mb-4">
          <MindMapPreviewCardWrapper
            session={session}
            userRole={userRole}
            workspace_id={workspace_id}
            mind_map_id={mind_map_id}
          />
        </main>
      </AutoSaveMindMapProvider>{" "}
    </AutosaveIndicatorProvider>
  );
}
