import {
  getInitialMessages,
  getUserWorkspaceRole,
  getWorkspaceWithChatId,
} from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import ChatContainer from "@/components/chat/ChatContainer";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import DashboardHeader from "@/components/header/DashboardHeader";
import InviteUsers from "@/components/invite/InviteUsers";
import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import { Metadata } from "next";
import { cache } from "react";

interface Params {
  params: Promise<{
    workspace_id: string;
    chat_id: string;
  }>;
}

const getWorkspace = cache(getWorkspaceWithChatId);
const getSession = cache(checkifUserCompletedOnboarding)

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { workspace_id,chat_id } = await params
  
  const session = await getSession(`/dashboard/workspace/${workspace_id}/chat/${chat_id}`)
  const workspace = await getWorkspace(workspace_id, session.user.id);

  return {
    title: workspace.name,
  };
}

const Chat = async ({ params }: Params) => {
  const { workspace_id, chat_id } = await params
  const session = await getSession(`/dashboard/workspace/${workspace_id}/chat/${chat_id}`)

  const [workspace, userRole, initialMessages] = await Promise.all([
    getWorkspace(workspace_id, session.user.id),
    getUserWorkspaceRole(workspace_id, session.user.id),
    getInitialMessages(session.user.id, chat_id),
  ]);

  if (!workspace) return notFound();

  const conversationId = workspace.conversation.id;

  if (conversationId !== chat_id)
    redirect("/dashboard/errors?error=no-conversation");

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
            name: "CHAT",
            href: `/dashboard/workspace/${workspace_id}/chat/${chat_id}`,
            useTranslate: true,
          },
        ]}
      >
        {(userRole === "ADMIN" || userRole === "OWNER") && (
          <InviteUsers workspace={workspace} />
        )}
        <AddTaskShortcut />
      </DashboardHeader>
      <main className="h-full w-full max-h-fit">
        <ChatContainer
          chatId={conversationId}
          workspaceId={workspace.id}
          initialMessages={initialMessages ? initialMessages : []}
          sessionUserId={session.user.id}
          workspaceName={workspace?.name}
        />
      </main>
    </>
  );
};

export default Chat;
