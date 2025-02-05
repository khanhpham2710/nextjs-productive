import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import InviteUsers from "@/components/invite/InviteUsers";
import TaskContainer from "@/components/tasks/editable/container/TaskContainer";
import { AutosaveIndicatorProvider } from "@/context/AutosaveIndicator";
import { getTask, getUserWorkspaceRole, getWorkspace } from "@/lib/api";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import { notFound, redirect } from "next/navigation";

interface Params {
    params: {
      workspace_id: string;
      task_id: string;
    };
  }
  
async function EditTask({ params }: Params) {
    const { workspace_id, task_id } = await params

    const session = await checkifUserCompletedOnboarding(
      `/dashboard/workspace/${workspace_id}/tasks/task/${task_id}`
    );
  
    const [workspace, userRole, task] = await Promise.all([
      getWorkspace(workspace_id, session.user.id),
      getUserWorkspaceRole(workspace_id, session.user.id),
      getTask(task_id, session.user.id),
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
            <AddTaskShortcut userId={session.user.id} />
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
  };
  
  export default EditTask;