import AdditionalInfoSection from "@/components/onboarding/AdditionalInfoSection";
import SummarySection from "@/components/onboarding/SummarySection";
import { OnboardingFormProvider } from "@/context/OnboardingForm";
import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";


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