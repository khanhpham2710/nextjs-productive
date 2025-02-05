"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { UserPermission } from "@prisma/client";
import { Star } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import TaskOptions from "./TaskOptions";
import { Separator } from "@/components/ui/separator";
import UserHoverInfoCard from "@/components/common/UserHoverInfoCard";
import LinkTag from "../editable/tag/LinkTag";
import { ExtendedTask } from "@/types/extended";
import ReadOnlyEmoji from "@/components/common/ReadOnlyEmoji";
import ReadOnlyCalendar from "./ReadOnlyCalendar";
import { Session } from "next-auth";
import LoadingScreen from "@/components/common/LoadingScreen";
import AssignedToTaskSelector from "../assignToTask/AssignedToTaskSelector";

interface Props {
  taskId: string;
  session: Session;
  userRole: UserPermission | null;
}

function ReadOnlyContent({ taskId, session, userRole }: Props) {
  const [isSaved, setisSaved] = useState(false);
  const t = useTranslations("TASK.EDITOR.READ_ONLY");

  const format = useFormatter();
  const now = new Date();

  const { data: task } = useQuery({
    queryKey: [taskId],
    queryFn: async () => {
      const res = await fetch(
        `/api/task/get/details/${taskId}?userId=${session.user.id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await res.json();
      return data as ExtendedTask;
    },
  });

  useEffect(() => {
    if (task) {
      const isSavedByUser =
        task.savedTask?.find((task) => task.userId === session.user.id) !==
        undefined;
      setisSaved(isSavedByUser);
    }
  }, [session.user.id, task]);

  if (!task) {
    return <LoadingScreen />;
  }

  const dateTime = task.updatedAt ? new Date(task.updatedAt) : now;

  const onSetIsSaved = () => {
    setisSaved((prev) => !prev);
  };

  return (
    <Card>
      <CardContent className="py-4 sm:py-6 flex flex-col gap-10 relative">
        <div className="w-full flex flex-col sm:flex-row items-start sm:gap-4 gap-2">
          <ReadOnlyEmoji selectedEmoji={task?.emoji} />
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between items-center">
              <div className="w-5/6">
                <p className="text-2xl font-semibold flex items-center gap-2">
                  {task?.title ? task.title : t("NO_TITLE")}{" "}
                  {isSaved && <Star />}
                </p>
              </div>
              <div className="absolute top-5 right-5 sm:static">
                <TaskOptions
                  onSetIsSaved={onSetIsSaved}
                  isSaved={isSaved}
                  taskId={task?.id}
                  workspaceId={task?.workspaceId}
                  userRole={userRole}
                />
              </div>
            </div>
            <div className="w-full gap-1 flex flex-wrap flex-row">
              <AssignedToTaskSelector
                taskId={task.id}
                workspaceId={task.workspaceId}
              />
              <ReadOnlyCalendar
                from={task?.taskDate?.from}
                to={task?.taskDate?.to}
              />
              {task?.tags &&
                task.tags.map((tag) => <LinkTag key={tag.id} tag={tag} />)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="w-full flex flex-col items-center justify-center gap-2 text-xs sm:flex-row">
        <div className="flex items-center">
          <p>{t("CREATOR_INFO")}</p>
          <UserHoverInfoCard user={task?.creator} />
        </div>
        <Separator className="hidden h-4 sm:block" orientation="vertical" />
        <div className="flex items-center">
          <p>{t("EDITOR_INFO")}</p>
          <UserHoverInfoCard user={task?.updatedBy} />
          {dateTime && <p>{format.relativeTime(dateTime, now)}</p>}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ReadOnlyContent;
