import AddTaskShortcut from '@/components/addTaskShortcut/AddTaskShortcut';
import AssignedToMeContainer from '@/components/assigned-to-me/AssignedToMeContainer';
import DashboardHeader from '@/components/header/DashboardHeader';
import checkifUserCompletedOnboarding from '@/lib/checkifUserCompletedOnboarding';

async function AssignedToMe() {
    const session = await checkifUserCompletedOnboarding(
        "/dashboard/assigned-to-me"
      );
    
      return (
        <>
          <DashboardHeader>
            <AddTaskShortcut userId={session.user.id} />
          </DashboardHeader>
          <main>
            <AssignedToMeContainer userId={session.user.id} />
          </main>
        </>
      );
}

export default AssignedToMe
