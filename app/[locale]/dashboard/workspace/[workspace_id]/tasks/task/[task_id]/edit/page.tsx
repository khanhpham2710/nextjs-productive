import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import InviteUsers from "@/components/invite/InviteUsers";
import TaskContainer from "@/components/tasks/editable/container/TaskContainer";
import { AutosaveIndicatorProvider } from "@/context/AutosaveIndicator";
import { getTask, getUserWorkspaceRole, getWorkspace } from "@/lib/api";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

interface Params {
  params: Promise<{
    workspace_id: string;
    task_id: string;
  }>;
}

const getWorkspaceName = cache(getWorkspace);
const getTaskName = cache(getTask);
const getSession = cache(checkifUserCompletedOnboarding);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { workspace_id, task_id } = await params;

  const session = await getSession(
    `/dashboard/workspace/${workspace_id}/tasks/task/${task_id}/edit`
  );
  const workspace = await getWorkspaceName(workspace_id, session.user.id);
  const task = await getTaskName(task_id, session.user.id);

  return {
    title: task.title ? workspace.name + " | " + task.title : workspace.name,
  };
}

async function EditTask({ params }: Params) {
  const { workspace_id, task_id } = await params;

  const session = await getSession(
    `/dashboard/workspace/${workspace_id}/tasks/task/${task_id}/edit`
  );

  const [workspace, userRole, task] = await Promise.all([
    getWorkspaceName(workspace_id, session.user.id),
    getUserWorkspaceRole(workspace_id, session.user.id),
    getTaskName(task_id, session.user.id),
  ]);

  if (!workspace || !userRole || !task) notFound();

  const canEdit =
    userRole === "ADMIN" || userRole === "OWNER" || userRole === "CAN_EDIT"
      ? true
      : false;

  if (!canEdit)
    redirect(`/dashboard/workspace/${workspace_id}/tasks/task/${task_id}`);

  return (
    <>
      <AutosaveIndicatorProvider>
        <DashboardHeader showBackBtn hideBreadCrumb showingSavingStatus>
          {(userRole === "ADMIN" || userRole === "OWNER") && (
            <InviteUsers workspace={workspace} />
          )}
          <AddTaskShortcut />
        </DashboardHeader>
        <main className="flex flex-col gap-2">
          <TaskContainer
            taskId={task_id}
            workspaceId={workspace_id}
            initialActiveTags={task.tags}
            title={task.title}
            content={task.content as unknown as JSON}
            emoji={task.emoji}
            from={task?.taskDate?.from}
            to={task?.taskDate?.to}
          />
        </main>
      </AutosaveIndicatorProvider>
    </>
  );
}

export default EditTask;
