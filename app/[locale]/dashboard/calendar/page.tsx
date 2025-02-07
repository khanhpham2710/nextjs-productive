import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import Calendar from "@/components/calendar/Calendar";
import DashboardHeader from "@/components/header/DashboardHeader";
import { Metadata } from "next";
import { headers } from "next/headers";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get("x-next-intl-locale");

  return {
    title: pathname == "vi" ? "Lịch" : "Calendar",
  };
}

async function CalendarPage() {
  return (
    <>
      <DashboardHeader>
        <AddTaskShortcut />
      </DashboardHeader>
      <main className="h-full">
        <Calendar />
      </main>
    </>
  );
}

export default CalendarPage;
