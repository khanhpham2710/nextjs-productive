
import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import Theme  from "@/components/settings/theme/Theme";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";

const ThemeSettings = async () => {
  const session = await checkifUserCompletedOnboarding("/dashboard/settings");

  return (
    <>
      <DashboardHeader>
        <AddTaskShortcut userId={session.user.id} />
      </DashboardHeader>
      <Theme />
    </>
  );
};

export default ThemeSettings;