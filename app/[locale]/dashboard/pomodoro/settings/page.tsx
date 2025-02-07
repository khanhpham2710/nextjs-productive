import AddTaskShortcut from '@/components/addTaskShortcut/AddTaskShortcut';
import DashboardHeader from '@/components/header/DashboardHeader';
import SettingsContainer from '@/components/pomodoro/SettingsContainer';
import { getUserPomodoroSettings } from '@/lib/api';
import checkifUserCompletedOnboarding from '@/lib/checkifUserCompletedOnboarding';
import React from 'react'

export default async function PomodoroSettings() {
    const session = await checkifUserCompletedOnboarding(`/dashboard/pomodoro`);

    const pomodoroSettings = await getUserPomodoroSettings(session.user.id);
  
    return (
      <>
        <DashboardHeader>
          <AddTaskShortcut />
        </DashboardHeader>
        <main className="flex flex-col gap-2 h-full">
          <SettingsContainer pomodoroSettings={pomodoroSettings} />
        </main>
      </>
    );
}