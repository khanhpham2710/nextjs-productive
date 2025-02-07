import AdditionalInfoSection from "@/components/onboarding/AdditionalInfoSection";
import SummarySection from "@/components/onboarding/SummarySection";
import { OnboardingFormProvider } from "@/context/OnboardingForm";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get("x-next-intl-locale");

  return {
    title: pathname == "vi" ? "Khởi đầu" : "Onboarding",
  };
}

const Onboarding = async () => {
  const session = await auth();

  if (!session) redirect("/");

  if (session.user.completedOnboarding)
    redirect("/dashboard");

  return (
    <OnboardingFormProvider session={session}>
      <AdditionalInfoSection profileImage={session.user.image} />
      <SummarySection />
    </OnboardingFormProvider>
  );
};

export default Onboarding;
