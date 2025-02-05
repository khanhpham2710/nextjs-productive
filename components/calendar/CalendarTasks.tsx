"use client";

import { CalendarItem } from "@/types/extended";
import { useMemo } from "react";
import CalendarTask from "./CalendarTask";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import ShowMore from "./ShowMore";
import { useMediaQuery } from "@react-hook/media-query";

interface Props {
  calendarItems: CalendarItem[];
}

export default function CalendarTasks({ calendarItems }: Props) {
  const visibleItems = useMemo(() => {
    return calendarItems.slice(0, 2);
  }, [calendarItems]);
  
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  if (isSmallScreen) {
    return (
      <div className="relative flex flex-col items-center justify-center py-1 h-full overflow-y-clip min-h-9">
        {calendarItems.length >= 1 && (
          <ShowMore
            small
            leftItemsAmount={calendarItems.length}
            calendarItems={calendarItems}
          />
        )}
      </div>
    );
  } else {
    return (
      <ScrollArea className="w-full h-full min-h-10">
        <div className="relative flex flex-col gap-1.5 py-1 h-full overflow-y-clip">
          {visibleItems.map((calendarItem) => (
            <CalendarTask key={calendarItem.taskId} dayInfo={calendarItem} />
          ))}
          {calendarItems.length > 2 && (
            <ShowMore
              leftItemsAmount={calendarItems.length - visibleItems.length}
              calendarItems={calendarItems}
            />
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }
}
