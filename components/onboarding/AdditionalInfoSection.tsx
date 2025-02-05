"use client"

import { useOnboardingForm } from "@/context/OnboardingForm";
import FirstStep from "./steps/FirstStep";
import { lazy, Suspense } from "react";
import AppTitle from "../ui/app-title";
import { FormStepsInfo } from "./FormStepsInfo";
const SecondStep = lazy(() => import("./steps/SecondStep"));
const ThirdStep = lazy(() => import("./steps/ThirdStep"));
const Finish = lazy(() => import("./steps/Finish"));

interface Props {
  profileImage?: string | null;
}

export const AdditionalInfoSection = ({ profileImage }: Props) => {
  const { currentStep } = useOnboardingForm();

  return (
    <section className="w-full lg:w-1/2 bg-card min-h-full flex flex-col justify-between items-center p-4 md:p-6">
      <div className="mt-16 mb-8 w-full flex flex-col items-center">
        <AppTitle size={50} />
        {currentStep === 1 && <FirstStep profileImage={profileImage} />}
        {currentStep === 2 && (
          <Suspense fallback={"Loading ..."}>
            <SecondStep />
          </Suspense>
        )}
        {currentStep === 3 && (
          <Suspense fallback={"Loading ..."}>
            <ThirdStep />
          </Suspense>
        )}
        {currentStep === 4 && (
          <Suspense fallback={"Loading ..."}>
            <Finish />
          </Suspense>
        )}
      </div>
      <FormStepsInfo />
    </section>
  );
};

export default AdditionalInfoSection;
