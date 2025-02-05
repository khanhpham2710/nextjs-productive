import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import StarredContainer from "@/components/starred/StarredContainer";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";

async function Starred() {
  const session = await checkifUserCompletedOnboarding("/dashboard/starred");

  return (
    <>
      <DashboardHeader>
        <AddTaskShortcut userId={session.user.id} />
      </DashboardHeader>
      <main>
        <StarredContainer userId={session.user.id} />
      </main>
    </>
  );
}

export default Starred;
