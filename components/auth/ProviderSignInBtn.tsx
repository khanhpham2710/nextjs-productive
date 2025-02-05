"use client";
import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useProviderLoginError } from "@/hooks/useProviderLoginError";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  providerName: "google" | "github";
  onLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function ProviderSignInBtn({
  children,
  providerName,
  onLoading,
  ...props
}: Props) {
  const [showLoggedInfo, setShowLoggedInfo] = useState(false);
  const locale = useLocale();
  useProviderLoginError(showLoggedInfo);

  const signInHandler = async () => {
    onLoading(true);
    setShowLoggedInfo(true);
    try {
      await signIn(providerName, { callbackUrl: `/${locale}/onboarding` });
    } catch (err) {
        console.error(err)
    }
    onLoading(false);
  };

  return (
    <Button
      onClick={signInHandler}
      {...props}
      variant={"secondary"}
      type="button"
    >
      {children}
    </Button>
  );
}

export default ProviderSignInBtn;
