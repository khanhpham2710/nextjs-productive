"use client";

import { ExtendedMindMap, UserInfo } from "@/types/extended";
import { UserPermission } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useEffect, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Info, Star } from "lucide-react";
import LinkTag from "@/components/tasks/editable/tag/LinkTag";
import UserHoverInfoCard from "@/components/common/UserHoverInfoCard";
import { Separator } from "@/components/ui/separator";
import MindMapCardPreviewOptions from "./MindMapCardPreviewOptions";
import ReadOnlyEmoji from "@/components/common/ReadOnlyEmoji";
import MindMap from "../MindMap";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import LoadingScreen from "@/components/common/LoadingScreen";

interface Props {
  session: Session;
  workspace_id: string;
  mind_map_id: string;
  // children: React.ReactNode;
  userRole: UserPermission | null;
}

export default function MindMapPreviewCardWrapper({
  mind_map_id,
  session,
  workspace_id,
  userRole,
}: Props) {
  const [isSaved, setIsSaved] = useState(false);
  const t = useTranslations("MIND_MAP.PREVIEW");
  const format = useFormatter();
  const now = new Date();
  const [updater, setUpdater] = useState<UserInfo | null>(null);
  const [dateTime, setDateTime] = useState(new Date());

  const { data: mindMap } = useQuery({
    queryKey: [mind_map_id],
    queryFn: async () => {
      const res = await fetch(
        `/api/mind_maps/get/details/${mind_map_id}?userId=${session.user.id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await res.json();
      return data as ExtendedMindMap;
    },
  });

  useEffect(() => {
    if (mindMap) {
      const isSavedByUser =
        mindMap.savedMindMaps?.find(
          (mindMap) => mindMap.userId === session.user.id
        ) !== undefined;
      setIsSaved(isSavedByUser);
      setUpdater(mindMap.updatedBy);
      setDateTime(mindMap.createdAt);
    }
  }, [mindMap, session.user.id]);

  const onSetIsSaved = () => {
    setIsSaved((prev) => !prev);
  };

  if (!mindMap || !updater) {
    return <LoadingScreen />;
  }

  return (
    <Card className="h-full">
      <CardContent className="py-4 sm:py-6 flex flex-col gap-10 relative h-full">
        <div className="w-full flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
          <ReadOnlyEmoji selectedEmoji={mindMap?.emoji} />
          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between items-center">
              <div className="w-5/6">
                <p className="text-2xl font-semibold flex items-center gap-2">
                  {mindMap.title ? mindMap.title : t("NO_TITLE")}
                  {isSaved && <Star />}
                </p>
              </div>
              <div className="absolute top-5 right-5 sm:static">
                <MindMapCardPreviewOptions
                  isSaved={isSaved}
                  mindMapId={mindMap.id}
                  workspaceId={mindMap.workspaceId}
                  onSetIsSaved={onSetIsSaved}
                  userRole={userRole}
                />
              </div>
            </div>
            <div className="w-full gap-1 flex flex-wrap flex-row items-center">
              <div className="mr-2">
                <HoverCard openDelay={250} closeDelay={250}>
                  <HoverCardTrigger>
                    <Info size={16} className="w-4 h-4" />
                  </HoverCardTrigger>
                  <HoverCardContent className="max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-full">
                    {t("INFO")}
                  </HoverCardContent>
                </HoverCard>
              </div>
              {/* <AssignedToMindMapSelector
                mindMapId={mindMap.id}
                workspaceId={mindMap.workspaceId}
              /> */}
              {mindMap.tags &&
                mindMap.tags.map((tag) => <LinkTag key={tag.id} tag={tag} />)}
            </div>
          </div>
        </div>
        <div className="h-full w-full">
          <MindMap
            initialInfo={mindMap}
            workspaceId={workspace_id}
            canEdit={false}
            initialActiveTags={mindMap.tags}
          />
        </div>
      </CardContent>
      <CardFooter className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 text-xs mt-4 sm:mt-0">
        <div className="flex items-center">
          <p>{t("CREATOR_INFO")}</p>
          <UserHoverInfoCard user={mindMap.creator} />
        </div>
        <Separator className="hidden h-4 sm:block" orientation="vertical" />
        <div className="flex items-center">
          <p>{t("EDITOR_INFO")}</p>
          <UserHoverInfoCard user={updater} />
          <p>{format.relativeTime(dateTime, now)}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
