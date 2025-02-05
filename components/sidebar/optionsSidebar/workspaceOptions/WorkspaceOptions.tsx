"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import WorkspaceOption from "./WorkspaceOption";
import { PencilRuler, Workflow } from "lucide-react";
import UsersContainer from "./usersList/UsersContainer";
import NewTask from "./actions/NewTask";
import { WorkspaceShortcuts } from "@/types/extended";
import NewMindMap from "./actions/NewMindMap";

interface Props {
  workspaceId: string;
}

function WorkspaceOptions({ workspaceId }: Props) {
  const t = useTranslations("SIDEBAR.WORKSPACE_OPTIONS");

  const { data: workspaceShortcuts, isLoading } = useQuery({
    queryFn: async () => {
      const res = await fetch(
        `/api/workspace/get/workspace_shortcuts?workspaceId=${workspaceId}`
      );

      if (!res.ok) return null;

      const data = await res.json();
      return data as WorkspaceShortcuts;
    },
    queryKey: ["getWorkspaceShortcuts", workspaceId],
  });



  return (
    <div>
      <div>
        <p>{t("SHORTCUTS")}</p>
        {!isLoading && workspaceShortcuts && (
          <div>
            <WorkspaceOption
              workspaceId={workspaceId}
              href={`tasks/task`}
              fields={workspaceShortcuts.tasks}
              defaultName={t("DEFAULT_NAME.TASK")}
            >
              <PencilRuler size={16} />
              {t("TASKS")}
            </WorkspaceOption>
            <WorkspaceOption
              workspaceId={workspaceId}
              href={`mind-maps/mind-map`}
              fields={workspaceShortcuts.mindMaps}
              defaultName={t("DEFAULT_NAME.MIND_MAP")}
            >
              <Workflow size={16} />
              {t("MIND_MAPS")}
            </WorkspaceOption>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs sm:text-sm uppercase text-muted-foreground">
          {t("ACTIONS")}
        </p>
        <div className="flex flex-col gap-2 w-full mt-2">
          <NewTask workspaceId={workspaceId} />
          <NewMindMap workspaceId={workspaceId} />
        </div>
      </div>
      <UsersContainer />
    </div>
  );
}

export default WorkspaceOptions;
