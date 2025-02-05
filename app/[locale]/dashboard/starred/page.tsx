import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import StarredContainer from "@/components/starred/StarredContainer";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-next-intl-locale');

  return {
    title: pathname == "vi" ? "Yêu thích" :"Star",
  };
}

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
