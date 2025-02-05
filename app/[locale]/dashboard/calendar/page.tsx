import AddTaskShortcut from '@/components/addTaskShortcut/AddTaskShortcut';
import Calendar from '@/components/calendar/Calendar';
import DashboardHeader from '@/components/header/DashboardHeader';
import checkifUserCompletedOnboarding from '@/lib/checkifUserCompletedOnboarding';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import React from 'react'


export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-next-intl-locale');

  return {
    title: pathname == "vi" ? "Lịch" :"Calendar",
  };
}

async function CalendarPage() {
    const session = await checkifUserCompletedOnboarding(
        "/dashboard/assigned-to-me"
      );
    
      return (
        <>
          <DashboardHeader>
            <AddTaskShortcut userId={session.user.id} />
          </DashboardHeader>
          <main className="h-full">
            <Calendar userId={session.user.id} />
          </main>
        </>
      );
}

export default CalendarPage;
