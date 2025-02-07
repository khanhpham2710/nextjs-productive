
import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import Theme  from "@/components/settings/theme/Theme";

const ThemeSettings = async () => {

  return (
    <>
      <DashboardHeader>
        <AddTaskShortcut />
      </DashboardHeader>
      <Theme />
    </>
  );
};

export default ThemeSettings;