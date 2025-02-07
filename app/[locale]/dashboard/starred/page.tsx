import AddTaskShortcut from "@/components/addTaskShortcut/AddTaskShortcut";
import DashboardHeader from "@/components/header/DashboardHeader";
import StarredContainer from "@/components/starred/StarredContainer";
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

  return (
    <>
      <DashboardHeader>
        <AddTaskShortcut />
      </DashboardHeader>
      <main>
        <StarredContainer />
      </main>
    </>
  );
}

export default Starred;
