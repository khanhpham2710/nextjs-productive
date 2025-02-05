import { cn } from "@/lib/utils";
import { CalendarItem } from "@/types/extended";
import dayjs, { Dayjs } from "dayjs";
import isSameOArfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useEffect, useState } from "react";
import CalendarTasks from "./CalendarTasks";
dayjs.extend(isSameOArfter);
dayjs.extend(isSameOrBefore);

interface Props {
    day: Dayjs;
    monthIndex: number;
    calendarItems: CalendarItem[];
  }
  

export default function Day({ day, monthIndex, calendarItems }: Props) {
    const isPreviousMonth = day.month() !== monthIndex;
    const [tasks, setTasks] = useState<CalendarItem[]>([]);
  
    useEffect(() => {
      const filterTasks = calendarItems.filter(dayInfo => {
        const startDate = dayjs(dayInfo.taskDate?.from);
        const endDate = dayInfo.taskDate?.to ? dayjs(dayInfo.taskDate?.to) : null;
  
        if (startDate.isSame(day) && !endDate) return dayInfo;
        else if (day.isSameOrAfter(startDate) && day.isSameOrBefore(endDate)) {
          return dayInfo;
        }
      });
  
      setTasks(filterTasks);
    }, [day, calendarItems]);

    return (
      <div
        className={cn(
          `border border-border border-black dark:border-white flex flex-col transition-opacity duration-200 bg-background py-1 px-1.5 ${
            day.format("ddd") === "Sat" || day.format("ddd") === "Sun"
              ? "bg-accent dark:bg-popover/50"
              : ""
          } ${isPreviousMonth ? "opacity-25 dark:opacity-25" : ""}`
        )}
      >
        <div className="flex flex-col items-end mb-2">
          <p
            className={`text-sm p-1 mt-1 text-center ${
              day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
                ? "transition-colors duration-200 bg-primary text-white dark:text-black w-7 rounded-full"
                : ""
            }`}
          >
            {day.format("DD")}
          </p>
        </div>
        <CalendarTasks calendarItems={tasks} />
      </div>
    );
}
