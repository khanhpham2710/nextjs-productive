"use client";

import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { getMonth } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../common/LoadingScreen";
import ClientError from "../error/ClientError";
import CalendarHeader from "./CalendarHeader";
import { CalendarItem } from "@/types/extended";
import CalendarGrid from "./CalendarGrid";
import { useSession } from "next-auth/react";

function Calendar() {
  const [currMonth, setCurrMonth] = useState(getMonth());
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const { data: session } = useSession()

  useEffect(() => {
    setCurrMonth(getMonth(monthIndex));
  }, [monthIndex]);

  const changeMonthHandler = useCallback((change: "next" | "prev") => {
    if (change === "next") setMonthIndex((prev) => prev + 1);
    else setMonthIndex((prev) => prev - 1);
  }, []);

  const resetMonthHandler = useCallback(() => {
    if (monthIndex === dayjs().month()) return;
    setMonthIndex(dayjs().month());
  }, [monthIndex]);

  const {
    data: calendarItems,
    isLoading,
    isError,
  } = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/calendar/get?userId=${session!.user.id}`);

      if (!res.ok) throw new Error();

      const data = (await res.json()) as CalendarItem[];
      return data;
    },
    queryKey: ["getCalendarItems", session],
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError)
    return (
      <ClientError hrefToGoOnReset="/dashboard/calendar" message={"error"} />
    );

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center">
      <CalendarHeader
        monthIndex={monthIndex}
        onChangeMonthHandler={changeMonthHandler}
        onResetMonthHandler={resetMonthHandler}
      />
      <CalendarGrid
        currMonth={currMonth}
        monthIndex={monthIndex}
        calendarItems={calendarItems!}
      />
    </div>
  );
}

export default Calendar;
