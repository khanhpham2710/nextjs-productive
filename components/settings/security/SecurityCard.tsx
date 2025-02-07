"use client"

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import Warning from "@/components/ui/warning";
import { useTranslations } from "next-intl";
import ChangePassword from "./ChangePassword";
import { useSession } from "next-auth/react";


function SecurityCard() {
    const t = useTranslations("SETTINGS.SECURITY");
    const { data: session } = useSession()

    return (
      <Card className="bg-background border-none shadow-none">
        <CardHeader>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            {t("TITLE")}
          </h1>
          {!session!.user.provider && <CardDescription className="text-base max-w-3xl break-words">
            {t("DESC")}
          </CardDescription>}
        </CardHeader>
        <CardContent>
          <Warning blue className="my-0 mb-6 sm:mb-10">
            <p>{t("WARNING.FIRST")} <span className="font-bold">{t("WARNING.SECOND")}.</span></p>
            {t("WARNING.THIRD")}
            <span className="font-bold">{t("WARNING.FOURTH")} </span>
            {t("WARNING.FIFTH")}
          </Warning>
          {!session!.user.provider && <ChangePassword />}
        </CardContent>
      </Card>
    );
}

export default SecurityCard
