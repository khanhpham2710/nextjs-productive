import AddTaskShortcut from '@/components/addTaskShortcut/AddTaskShortcut';
import DashboardHeader from '@/components/header/DashboardHeader';
import PomodoroContainer from '@/components/pomodoro/timer/PomodoroContainer';
import { getUserPomodoroSettings } from '@/lib/api';
import checkifUserCompletedOnboarding from '@/lib/checkifUserCompletedOnboarding';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Pomodoro',
}

export default async function page() {
    const session = await checkifUserCompletedOnboarding(`/dashboard/pomodoro`);

    const pomodoroSettings = await getUserPomodoroSettings(session.user.id);
    if (!pomodoroSettings) notFound();
  
    return (
      <>
        <DashboardHeader>
          <AddTaskShortcut userId={session.user.id} />
        </DashboardHeader>
        <main className="flex flex-col gap-2 h-full items-center">
          <PomodoroContainer pomodoroSettings={pomodoroSettings} />
        </main>
      </>
    );
}
