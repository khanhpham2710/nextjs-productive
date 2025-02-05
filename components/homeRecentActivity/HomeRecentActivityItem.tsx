"use client"

import { HomeRecentActivity } from "@/types/extended";
import { Card, CardContent } from "../ui/card";
import ReadOnlyEmoji from "../common/ReadOnlyEmoji";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { useMemo } from "react";
import UserHoverInfoCard from "../common/UserHoverInfoCard";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { StarSvg } from "../svg/StarSvg";
import { useRouter } from "next/navigation";

interface Props {
  activityItem: HomeRecentActivity;
}

export default function HomeRecentActivityItem({
  activityItem: {
    emoji,
    link,
    title,
    type,
    updated,
    workspaceId,
    workspaceName,
    starred,
  },
}: Props) {
  const format = useFormatter();
  const router = useRouter();
  const dateTime = new Date(updated.at);
  const now = new Date();

  const t = useTranslations("STARRED");
  const c = useTranslations("COMMON");

  const itemTypeSentence = useMemo(() => {
    return type === "mindMap"
      ? c("EDITED_ITEM_SENTENCE.MIND_MAP")
      : c("EDITED_ITEM_SENTENCE.TASK");
  }, [c, type]);

  return (
    <Link href={link}>
      <Card className="bg-background border-none hover:bg-accent transition-colors duration-200 p-2">
        <CardContent className="flex w-full justify-between sm:items-center p-2 sm:p-2 pt-0">
          <div className="flex flex-row sm:gap-4 gap-2 w-full">
            <ReadOnlyEmoji
              className="sm:h-16 sm:w-16 h-12 w-12"
              selectedEmoji={emoji}
            />
            <div className="w-full">
              <div className="flex items-center">
                <h2 className="text-lg sm:text-2xl font-semibold">
                  {!title && type === "mindMap" && t("DEFAULT_NAME.MIND_MAP")}
                  {!title && type === "task" && t("DEFAULT_NAME.TASK")}
                  {title && title}
                </h2>
                {starred && <StarSvg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
              {updated.by && (
                <div className="flex flex-col md:flex-row md:items-center md:gap-1">
                  <p className="text-muted-foreground">{itemTypeSentence}</p>{" "}
                  {format.relativeTime(dateTime, now)}{" "}
                  {c("EDITED_ITEM_SENTENCE.BY")}
                  <div className="flex items-center gap-1 translate-y-[1px]">
                    <UserHoverInfoCard className="px-0 text-md" user={updated.by} />
                    <div>
                      {c("EDITED_ITEM_SENTENCE.IN")}{" "}
                      <div
                        className={cn(
                          `${buttonVariants({
                            variant: "link",
                          })} px-0`
                        )}
                        onClick={() => {
                          router.push(`/dashboard/workspace/${workspaceId}`);
                        }}
                      >
                        {workspaceName}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
