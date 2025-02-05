import AdditionalInfoSection from "@/components/onboarding/AdditionalInfoSection";
import SummarySection from "@/components/onboarding/SummarySection";
import { OnboardingFormProvider } from "@/context/OnboardingForm";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-next-intl-locale');

  return {
    title: pathname == "vi" ? "Khởi đầu" : "Onboarding",
  };
}

const Onboarding = async () => {
  const session = await checkifUserCompletedOnboarding("/onboarding");


  return (
    <OnboardingFormProvider session={session}>
      <AdditionalInfoSection profileImage={session.user.image} />
      <SummarySection />
    </OnboardingFormProvider>
  );
}

export default Onboarding