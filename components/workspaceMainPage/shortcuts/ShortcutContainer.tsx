"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPermission } from "@prisma/client";
import { MessagesSquare, PencilRuler, Workflow } from "lucide-react";
import { useNewTask } from "@/hooks/useNewTask";
import { useNewMindMap } from "@/hooks/useNewMindMap";
import { ShortcutContainerLinkItem } from "./ShortcutContainerLinkItem";
import { ExtendedWorkspace } from "@/types/extended";
import { ShortcutContainerBtnItem } from "./ShortcutContainerBtnItem";
import Permissionindicator from "./permissionIndicator/Permissionindicator";
import { useTranslations } from "next-intl";

interface Props {
  workspace: ExtendedWorkspace;
  userRole: UserPermission | null;
}

export const ShortcutContainer = ({ workspace, userRole }: Props) => {
  const { newTask, isPending: isNewTaskLoading } = useNewTask(workspace.id);
  const { newMindMap, isPending: isNewMindMapLoading } = useNewMindMap(
    workspace.id
  );
  const t = useTranslations("WORKSPACE");
  const adminOrOwner = userRole == "ADMIN" || userRole == "OWNER";

  return (
    <ScrollArea className="w-full">
      <div className={`grid w-full pb-4 mt-4 grid-cols-2 ${adminOrOwner ? "sm:grid-cols-5" : "sm:grid-cols-4"}  gap-2`}>
        <Permissionindicator
          userRole={userRole}
          workspaceName={workspace.name}
        />
        <ShortcutContainerLinkItem
          Icon={MessagesSquare}
          title={t("GROUP_CHAT")}
          href={`/dashboard/workspace/${workspace.id}/chat/${workspace.conversation.id}`}
        />
        <ShortcutContainerBtnItem
          Icon={PencilRuler}
          title={t("NEW_TASK")}
          isLoading={isNewTaskLoading}
          onClick={newTask}
        />
        <ShortcutContainerBtnItem
          Icon={Workflow}
          title={t("NEW_MIND_MAP")}
          isLoading={isNewMindMapLoading}
          onClick={newMindMap}
        />
        {adminOrOwner && (
          <ShortcutContainerLinkItem
            Icon={MessagesSquare}
            title={t("SETTINGS")}
            href={`/dashboard/settings/workspace/${workspace.id}`}
          />
        )}
      </div>
    </ScrollArea>
  );
};
