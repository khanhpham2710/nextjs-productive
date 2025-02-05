import AccountInfo from "@/components/account/AccountInfo";
import DeleteAccount from "@/components/account/DeleteAccount";
import Heading from "@/components/account/Heading";
import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import { Separator } from "@/components/ui/separator";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding"
import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-next-intl-locale');

  return {
    title: pathname == "vi" ? "Cài đặt" :"Settings",
  };
}

const Settings = async () => {
  const session = await checkifUserCompletedOnboarding("/dashboard/settings");

  return (
    <>
      <DashboardHeader>
        <AddTaskShortcut userId={session.user.id} />
      </DashboardHeader>
      <main>
        <Heading />
        <AccountInfo session={session} />
        <div className="p-4 sm:p-6">
          <Separator />
        </div>
        <DeleteAccount userEmail={session.user.email!} />
      </main>
    </>
  );
};

export default Settings;