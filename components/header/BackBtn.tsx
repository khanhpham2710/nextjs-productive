"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon } from "lucide-react";

function BackBtn() {
  const router = useRouter();
  const t = useTranslations("COMMON");

  const handleBack = async () => {
    router.back();
    router.refresh();
  };

  return (
    <Button
      onClick={handleBack}
      className="gap-1 flex justify-center items-center "
      variant={"secondary"}
      size={"sm"}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:inline-block">{t("BACK_BTN")}</span>
    </Button>
  );
}

export default BackBtn;
