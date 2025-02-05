import Welcoming from "@/components/common/Welcoming";
import DashboardHeader from "@/components/header/DashboardHeader";
import HomeRecentActivityContainer from "@/components/homeRecentActivity/HomeRecentActivityContainer";
import { getInitialHomeRecentActivity } from "@/lib/api";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";

const Dashboard = async () => {
  const session = await checkifUserCompletedOnboarding("/dashboard");

  const initialRecentActivity = await getInitialHomeRecentActivity(
    session.user.id
  );

  return (
    <>
      <DashboardHeader />
      <main className="h-full w-full">
        <Welcoming
          hideOnDesktop
          className="px-4 py-2"
          username={session.user.username!}
          name={session.user.name}
          surname={session.user.surname}
        />
        <HomeRecentActivityContainer
          userId={session.user.id}
          initialData={initialRecentActivity ? initialRecentActivity : []}
        />
      </main>
    </>
  );
};

export default Dashboard;
