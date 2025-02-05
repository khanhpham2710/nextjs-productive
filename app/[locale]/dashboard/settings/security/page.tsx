import DashboardHeader from "@/components/header/DashboardHeader";
import SecurityCard from "@/components/settings/security/SecurityCard";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";

async function SecuritySettings() {
  const session = await checkifUserCompletedOnboarding("/dashboard/settings");

  return (
    <>
      <DashboardHeader>
        {/* <AddTaskShortcut userId={session.user.id} /> */}
      </DashboardHeader>
      <SecurityCard provider={session.user.provider}/>
    </>
  );
}

export default SecuritySettings;
