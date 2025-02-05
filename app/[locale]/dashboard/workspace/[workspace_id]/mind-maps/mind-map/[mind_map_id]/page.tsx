import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import InviteUsers from "@/components/invite/InviteUsers";
import MindMapPreviewCardWrapper from "@/components/mindMaps/preview/MindMapCardPreviewWrapper";
import { AutosaveIndicatorProvider } from "@/context/AutosaveIndicator";
import { AutoSaveMindMapProvider } from "@/context/AutoSaveMindMap";
import { getMindMap, getUserWorkspaceRole, getWorkspace } from "@/lib/api";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import { Metadata } from "next";
import { notFound } from "next/navigation";
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
    `/dashboard/workspace/${workspace_id}/tasks/task/${mind_map_id}`
  );
  const workspace = await getWorkspaceName(workspace_id, session.user.id);
  const mindMap = await getMindMapName(mind_map_id, session.user.id);

  return {
    title: mindMap.title ? workspace.name + " | " + mindMap.title : workspace.name,
  };
}

export default async function MindMapPage({ params }: Params) {
  const { workspace_id, mind_map_id } = await params;

  const session = await getSession(
    `/dashboard/workspace/${workspace_id}/mind-maps/mind-map/${mind_map_id}`
  );

  const [workspace, userRole] = await Promise.all([
    getWorkspaceName(workspace_id, session.user.id),
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
