import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import InviteUsers from "@/components/invite/InviteUsers";
import MindMap from "@/components/mindMaps/MindMap";
import { AutosaveIndicatorProvider } from "@/context/AutosaveIndicator";
import { AutoSaveMindMapProvider } from "@/context/AutoSaveMindMap";
import { getMindMap, getUserWorkspaceRole, getWorkspace } from "@/lib/api";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import { notFound, redirect } from "next/navigation";

interface Params {
  params: {
    workspace_id: string;
    mind_map_id: string;
  };
}

export default async function EditMindMapPage({ params }: Params) {
  const { workspace_id, mind_map_id } = await params;
  const session = await checkifUserCompletedOnboarding(
    `/dashboard/workspace/${workspace_id}/tasks/task/${mind_map_id}`
  );

  const [workspace, userRole, mindMap] = await Promise.all([
    getWorkspace(workspace_id, session.user.id),
    getUserWorkspaceRole(workspace_id, session.user.id),
    getMindMap(mind_map_id, session.user.id),
  ]);

  if (!workspace || !userRole || !mindMap) notFound();

  const canEdit = userRole === "ADMIN" || userRole === "OWNER" ? true : false;
  if (!canEdit)
    redirect(`/dashboard/workspace/${workspace_id}/tasks/task/${mind_map_id}`);

  return (
    <AutosaveIndicatorProvider>
      <AutoSaveMindMapProvider>
        <DashboardHeader showBackBtn hideBreadCrumb showingSavingStatus>
          {(userRole === "ADMIN" || userRole === "OWNER") && (
            <InviteUsers workspace={workspace} />
          )}
          <AddTaskShortcut userId={session.user.id} />
        </DashboardHeader>
        <main className="flex flex-col gap-2 h-full">
          <MindMap
            initialInfo={mindMap}
            workspaceId={workspace_id}
            canEdit={canEdit}
            initialActiveTags={mindMap.tags}
          />
        </main>
      </AutoSaveMindMapProvider>{" "}
    </AutosaveIndicatorProvider>
  );
}
