"use client";

import ClientError from "@/components/error/ClientError";
import { LoadingState } from "@/components/ui/loadingState";
import { useFilterByUsersAndTagsInWorkspace } from "@/context/FilterByUsersAndTagsInWorkspace";
import { WorkspaceRecentActivity } from "@/types/extended";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import NoData from "./NoData";
import RecentActivityItem from "./RecentActivityItem";
import NoFilteredData from "./NoFilteredData";

interface Props {
  userId: string;
  workspaceId: string;
}

export default function RecentActivityContainer({
  userId,
  workspaceId,
}: Props) {
  const t = useTranslations("WORKSPACE_MAIN_PAGE.RECENT_ACTIVITY");
  const {
    data: recentActivity,
    isError,
    isLoading,
  } = useQuery<WorkspaceRecentActivity[]>({
    queryFn: async () => {
      const res = await fetch(
        `/api/workspace/get/workspace_home_page?userId=${userId}&workspaceId=${workspaceId}`
      );

      if (!res.ok) {
        const error = (await res.json()) as string;
        throw new Error(error);
      }

      const response = await res.json();

      return response as WorkspaceRecentActivity[];
    },
    queryKey: ["getWorkspaceRecentActivity", workspaceId],
  });

  const [filteredRecentActivity, setFilteredRecentActivity] = useState<
    WorkspaceRecentActivity[]
  >([]);

  const { filterAssignedUsers, filterTags } =
    useFilterByUsersAndTagsInWorkspace();

  useEffect(() => {
    if (!recentActivity) return;

    const filteredActivity: WorkspaceRecentActivity[] = [];
    const filterUserIds = filterAssignedUsers.map((user) => user.id);
    const filterTagIds = filterTags.map((tag) => tag.id);

    recentActivity.forEach((activity) => {
      const hasMatchingUsers =
        filterUserIds.length === 0 ||
        (filterUserIds.length > 0 &&
          activity.assignedTo.some((assignedToItem) =>
            filterUserIds.includes(assignedToItem.userId)
          ));

      const hasMatchingTags =
        filterTagIds.length === 0 ||
        (filterTagIds.length > 0 &&
          activity.tags.some((tag) => filterTagIds.includes(tag.id)));

      if (hasMatchingTags && hasMatchingUsers) {
        filteredActivity.push(activity);
      }
    });

    setFilteredRecentActivity(filteredActivity);
  }, [recentActivity, filterAssignedUsers, filterTags]);

  const activityItems = useMemo(() => {
    return filterAssignedUsers.length !== 0 || filterTags.length !== 0
      ? filteredRecentActivity
      : recentActivity;
  }, [recentActivity, filterAssignedUsers, filterTags, filteredRecentActivity]);

  if (isError) {
    return <ClientError message={t("ERROR")} />;
  } else {
    return (
      <div className="w-full flex flex-col gap-2">
        {isLoading ? (
          <div className="w-full flex items-center justify-center mt-20 sm:mt-32">
            <LoadingState className="w-10 h-10 sm:h-11 sm:w-11" />
          </div>
        ) : recentActivity && recentActivity.length > 0 ? (
          activityItems && activityItems.length > 0 ? (
            activityItems.map((activity) => (
              <RecentActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <NoFilteredData />
          )
        ) : (
          <NoData />
        )}
      </div>
    );
  }
}
