import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import InviteUsers from "@/components/invite/InviteUsers";
import ReadOnlyContent from "@/components/tasks/readOnly/ReadOnlyContent";
import { getTask, getUserWorkspaceRole, getWorkspace } from "@/lib/api";
import changeCodeToEmoji from "@/lib/changeCodeToEmoji";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

interface Params {
  params: Promise<{
    workspace_id: string;
    task_id: string;
  }>;
}

const getWorkspaceName = cache(getWorkspace);
const getTaskName = cache(getTask);
const getSession = cache(checkifUserCompletedOnboarding)

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { workspace_id, task_id } = await params;
  
  const session = await getSession(`/dashboard/workspace/${workspace_id}/tasks/task/${task_id}`)
  const workspace = await getWorkspaceName(workspace_id, session.user.id);
  const task = await getTaskName(task_id, session.user.id)

  return {
    title: task.title ? workspace.name + " | " + task.title : workspace.name,
  };
}

async function Task({ params }: Params) {
  const { workspace_id, task_id } = await params;

  const session = await getSession(
    `/dashboard/workspace/${workspace_id}/tasks/task/${task_id}`
  );

  const [workspace, userRole, task] = await Promise.all([
    getWorkspaceName(workspace_id, session.user.id),
    getUserWorkspaceRole(workspace_id, session.user.id),
    getTaskName(task_id, session.user.id),
  ]);

  if (!workspace || !userRole || !task) notFound();

  return (
    <>
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
          {
            name: `${task.title ? task.title : "UNTITLED"}`,
            emoji: changeCodeToEmoji(task.emoji),
            href: "/",
            useTranslate: task.title ? false : true,
          },
        ]}
      >
        {(userRole === "ADMIN" || userRole === "OWNER") && (
          <InviteUsers workspace={workspace} />
        )}
        <AddTaskShortcut userId={session.user.id} />
      </DashboardHeader>
      <main className="flex flex-col gap-2">
        <ReadOnlyContent
          taskId={task_id}
          session={session}
          userRole={userRole}
        />
      </main>
    </>
  );
}

export default Task;
