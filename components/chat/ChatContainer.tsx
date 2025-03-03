"use client"

import { ExtendedMessage } from "@/types/extended";
import { useEffect, useRef } from "react";
import Header from "./Header/Header";
import MessagesContainer from "./messages/MessagesContainer";
import NewMessageContainer from "./newMessage/NewMessageContainer";
import { MESSAGES_LIMIT } from "@/lib/constants";
import { useMessage } from "@/store/conversation/messages";

interface Props {
  workspaceId: string;
  chatId: string;
  initialMessages: ExtendedMessage[];
  sessionUserId: string;
  workspaceName: string;
}

export default function ChatContainer({
    workspaceId,
    chatId,
    initialMessages,
    sessionUserId,
    workspaceName,
  }: Props) {
    const initState = useRef(false);

    const hasMore = initialMessages.length >= MESSAGES_LIMIT;
  
    useEffect(() => {
      if (!initState.current) {
        useMessage.setState({
          messages: initialMessages.reverse(),
          hasMore,
          initialMessagesLoading: false,
        });
      }
      initState.current = true;
    }, [hasMore, initialMessages]);
  
    return (
      <div className="w-full h-full flex flex-col justify-between border border-border rounded-md shadow-sm relative">
        <Header workspaceName={workspaceName} />
        <MessagesContainer
          chatId={chatId}
          sessionUserId={sessionUserId}
        />
        <NewMessageContainer chatId={chatId} workspaceId={workspaceId} />
      </div>
    );
}
