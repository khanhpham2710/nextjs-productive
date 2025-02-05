import { useTruncateText } from "@/hooks/useTruncateText";
import { UserAvatar } from "../ui/user-avatar";
import { BellDot, CircleX } from "lucide-react";
import { UserNotification } from "@/types/extended";
import { useFormatter, useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCreateNotifyItemDay } from "@/hooks/useCreateNotifyItemDay";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { HoverCard, HoverCardTrigger } from "../ui/hover-card";
import { HoverCardContent } from "@radix-ui/react-hover-card";

interface Props {
  notify: UserNotification;
}

export default function NotificationItem({
  notify: {
    notifyCreator: { username },
    clicked,
    createdDate,
    workspace,
    newUserRole,
    taskId,
    mindMapId,
    notifyType,
    id,
  },
}: Props) {
  const name = useTruncateText(username, 20);
  const m = useTranslations("MESSAGES");
  const t = useTranslations("NOTIFICATIONS");
  const queryClient = useQueryClient();

  const format = useFormatter();
  const dateTime = new Date(createdDate);
  const now = new Date();

  const { toast } = useToast();

  const { link, textContent } = useCreateNotifyItemDay(
    notifyType,
    newUserRole,
    workspace,
    taskId,
    mindMapId
  );

  const { mutate: updateToClickStatus } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/notifications/set-click/by-id`, { id });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["getUserNotifications"] });
      const previousNotifications = queryClient.getQueryData<
        UserNotification[]
      >(["getUserNotifications"]);

      const checkedPreviousNotifications =
        previousNotifications && previousNotifications.length > 0
          ? previousNotifications
          : [];

      const updatedNotifications = checkedPreviousNotifications.map(
        (notify) => {
          if (notify.id === id) {
            return {
              ...notify,
              clicked: true,
            };
          } else return notify;
        }
      );

      queryClient.setQueryData(["getUserNotifications"], updatedNotifications);

      return { checkedPreviousNotifications };
    },
    onError: (err: AxiosError, _, context) => {
      queryClient.setQueryData(
        ["getUserNotifications"],
        context?.checkedPreviousNotifications
      );

      toast({
        title: m("ERRORS.CANT_UPDATE_SEEN_NOTIFY"),
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserNotifications"] });
    },
    mutationKey: ["updateToClickStatus"],
  });

  const { mutate: clearNotification } = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/notifications/delete/by-id`, { id });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["getUserNotifications"] });
      return queryClient.getQueryData<UserNotification[]>([
        "getUserNotifications",
      ]);
    },
    onError: () => {
      toast({
        title: m("ERRORS.CANT_UPDATE_SEEN_NOTIFY"),
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserNotifications"] });
    },
    mutationKey: ["clearNotifications"],
  });

  return (
    <div className="flex gap-4">
      <Link href={link}>
        <div className="flex gap-4">
          <div>
            <UserAvatar className="w-10 h-10" size={12} />
          </div>
          <div className="w-full text-sm flex flex-col gap-1">
            <p>
              <span className="font-bold">{name} </span>
              {textContent}
            </p>
            <p
              className={`text-xs transition-colors duration-200 ${
                clicked ? "text-muted-foreground" : "text-primary font-bold"
              } `}
            >
              {format.relativeTime(dateTime, now)}
            </p>
          </div>
        </div>
      </Link>
      <HoverCard>
        <HoverCardTrigger asChild>
          {clicked ? (
            <CircleX
              className="h-5 w-5 text-primary cursor-pointer"
              onClick={() => {
                clearNotification();
              }}
            />
          ) : (
            <BellDot
              size={16}
              onClick={() => {
                updateToClickStatus();
              }}
            />
          )}
        </HoverCardTrigger>
        <HoverCardContent className="mb-2 p-2 w-32 text-sm bg-white border rounded-md shadow-lg text-gray-700">
          {clicked ? t("CLEAR") : t("MARK")}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
