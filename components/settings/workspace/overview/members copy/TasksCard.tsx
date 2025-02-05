"use client"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import TasksTable from "./TasksTable";
import { SettingsWorkspace } from "@/types/extended";


export interface Props {
  workspace: SettingsWorkspace;
  workspaceId: string;
}

function TasksCard({ workspace, workspaceId }: Props) {
    const t = useTranslations("EDIT_WORKSPACE.TASKS");
    return (
      <Card className="bg-background border-none shadow-none">
        <CardHeader>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            {t("TITLE")}
          </h1>
          <CardDescription className="text-base break-words">
            {t("DESC")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TasksTable workspace={workspace} workspaceId={workspaceId} />
        </CardContent>
      </Card>
    );
}

export default TasksCard
