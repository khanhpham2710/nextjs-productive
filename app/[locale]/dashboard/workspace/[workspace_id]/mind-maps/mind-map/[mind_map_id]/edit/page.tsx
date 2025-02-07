import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import InviteUsers from "@/components/invite/InviteUsers";
import MindMap from "@/components/mindMaps/MindMap";
import { AutosaveIndicatorProvider } from "@/context/AutosaveIndicator";
import { AutoSaveMindMapProvider } from "@/context/AutoSaveMindMap";
import { getMindMap, getUserWorkspaceRole, getWorkspace } from "@/lib/api";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

interface Params {
  params: Promise<{
    workspace_id: string;
    mind_map_id: string;
  }>;
}

const getWorkspaceName = cache(getWorkspace);
const getMindMapName = cache(getMindMap);
const getSession = cache(checkifUserCompletedOnboarding);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { workspace_id, mind_map_id } = await params;

  const session = await getSession(
    `/dashboard/workspace/${workspace_id}/tasks/task/${mind_map_id}/edit`
  );
  const workspace = await getWorkspaceName(workspace_id, session.user.id);
  const mindMap = await getMindMapName(mind_map_id, session.user.id);

  return {
    title: mindMap.title ? workspace.name + " | " + mindMap.title : workspace.name,
  };
}

export default async function EditMindMapPage({ params }: Params) {
  const { workspace_id, mind_map_id } = await params;
  const session = await getSession(
    `/dashboard/workspace/${workspace_id}/tasks/task/${mind_map_id}`
  );

  const [workspace, userRole, mindMap] = await Promise.all([
    getWorkspaceName(workspace_id, session.user.id),
    getUserWorkspaceRole(workspace_id, session.user.id),
    getMindMapName(mind_map_id, session.user.id),
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
          <AddTaskShortcut />
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
