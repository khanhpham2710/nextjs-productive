import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import SecurityCard from "@/components/settings/security/SecurityCard";

async function SecuritySettings() {

  return (
    <>
      <DashboardHeader>
        <AddTaskShortcut />
      </DashboardHeader>
      <SecurityCard />
    </>
  );
}

export default SecuritySettings;
