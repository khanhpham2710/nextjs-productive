import AddTaskShortcut from '@/components/addTaskShortcut/AddTaskShortcut';
import AssignedToMeContainer from '@/components/assigned-to-me/AssignedToMeContainer';
import DashboardHeader from '@/components/header/DashboardHeader';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-next-intl-locale');

  return {
    title: pathname == "vi" ? "Bàn giao cho tôi" :"Assigned to me",
  };
}

async function AssignedToMe() {
    
      return (
        <>
          <DashboardHeader>
            <AddTaskShortcut />
          </DashboardHeader>
          <main>
            <AssignedToMeContainer  />
          </main>
        </>
      );
}

export default AssignedToMe
