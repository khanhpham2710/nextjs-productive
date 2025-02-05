import { UserAvatar } from "@/components/ui/user-avatar";
import { useUserActivityStatus } from "@/context/UserActivityStatus";
import { useMessage } from "@/store/conversation/messages";
import { ExtendedMessage } from "@/types/extended";
import { useFormatter } from "next-intl";
import { RefObject, useMemo, useRef, useState } from "react";
import EditedBadge from "./EditedBadge";
import Options from "./Options";
import AdditionalResource from "./AdditionalResource";
import EditMessage from "./EditMessage";
import { showUserInformation } from "@/lib/utils";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

interface Props {
  message: ExtendedMessage;
  sessionUserId: string;
}

export default function Message({ message, sessionUserId }: Props) {
  const {
    content,
    additionalResources,
    createdAt,
    edited,
    id,
    sender,
    updatedAt,
  } = message;
  const format = useFormatter();
  const dateTime = new Date(createdAt);
  const now = new Date();

  const messageRef = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const changeEditModeHandler = (editing: boolean) => {
    setIsEditing(editing);
  };

  const { checkIfUserIsActive } = useUserActivityStatus();
  const isActive = useMemo(() => {
    return checkIfUserIsActive(sender.id);
  }, [sender.id, checkIfUserIsActive]);

  useOnClickOutside(messageRef as RefObject<HTMLElement>, () => {
    const emojiBtn = document.getElementById("edit-message-emoji-selector");
    const dataStateValue = emojiBtn?.getAttribute("data-state");

    if (dataStateValue !== "open") setIsEditing(false);
  });
  const { messages } = useMessage((state) => state);

  const showUser = useMemo(
    () => showUserInformation(messages, id),
    [id, messages]
  );

  return (
    <div
      ref={messageRef}
      className={`flex justify-between items-start w-full ${
        showUser ? "" : "mt-[-0.8rem]"
      }`}
    >
      <div className="flex flex-col gap-1 w-full">
        <div className="flex gap-2 items-start w-full">
          {showUser && (
            <div className="relative">
              <UserAvatar className="w-10 h-10" profileImage={sender.image} />
              {isActive && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-border border-2 shadow-sm bg-primary"></div>
              )}
            </div>
          )}

          <div
            className={`flex flex-col justify-center ${
              showUser ? "" : "ml-12"
            } ${isEditing ? "w-full" : "w-fit"}`}
          >
            {showUser && (
              <div className="flex flex-wrap gap-1 items-center">
                <p className="text-primary">{sender.username}</p>
                <p className="text-muted-foreground text-xs">
                  {format.relativeTime(dateTime, now)}
                </p>
              </div>
            )}

            {!isEditing ? (
              <div className="flex flex-wrap gap-1 items-end">
                <p className="break-all">{content}</p>
                {edited && <EditedBadge updatedAt={updatedAt!} />}
              </div>
            ) : (
              <EditMessage
                content={content}
                messageInfo={message}
                onChangeEdit={changeEditModeHandler}
              />
            )}

            <div className="flex flex-col gap-2 mt-2">
              {additionalResources.map((resource) => (
                <AdditionalResource key={resource.id} file={resource} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {sender.id === sessionUserId && !isEditing && (
        <div>
          <Options onChangeEdit={changeEditModeHandler} message={message} />
        </div>
      )}
    </div>
  );
}
