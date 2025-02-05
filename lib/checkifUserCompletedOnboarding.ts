import { redirect } from "next/navigation";
import { auth } from "./auth";
import { Session } from "next-auth";

const checkifUserCompletedOnboarding = async (currentPath: string) : Promise<Session> => {
  const session = await auth();
  if (!session) redirect("/");

  if (session.user.completedOnboarding && currentPath === "/onboarding")
    redirect("/dashboard");
  if (!session.user.completedOnboarding && currentPath !== "/onboarding") {
    redirect("/onboarding?error=not-completed-onboarding");
  }

  return session;
};

export default checkifUserCompletedOnboarding;
