import AddTaskShortcut from '@/components/addTaskShortcut/AddTaskShortcut';
import Calendar from '@/components/calendar/Calendar';
import DashboardHeader from '@/components/header/DashboardHeader';
import checkifUserCompletedOnboarding from '@/lib/checkifUserCompletedOnboarding';
import React from 'react'

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
