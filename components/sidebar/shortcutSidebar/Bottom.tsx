"use client";

import { LocaleSwitcher } from "@/components/switchers/LocaleSwitcher";
import ActiveLink from "@/components/ui/active-link";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { usePathname } from "@/i18n/routing";
import { LogOutIcon, Settings2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

function Bottom() {
  const t = useTranslations("SIDEBAR");
  const lang = useLocale();
  const logOutHandler = () => {
    signOut({
      callbackUrl: `${window.location.origin}/${lang}`,
    });
  };

  const isSetting = usePathname() == '/dashboard/settings'

  return (
    <div className="flex flex-col gap-4">
      <LocaleSwitcher
        textSize="text-lg"
        alignHover="start"
        alignDropdown="start"
        variant={"ghost"}
        size={"icon"}
      />
      <HoverCard openDelay={250} closeDelay={250}>
        <HoverCardTrigger tabIndex={1}>
          <Button onClick={logOutHandler} variant={"ghost"} size={"icon"}>
            <LogOutIcon />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent align="start">
          <span>{t("MAIN.LOG_OUT_HOVER")}</span>
        </HoverCardContent>
      </HoverCard>
      <HoverCard openDelay={250} closeDelay={250}>
        <HoverCardTrigger tabIndex={1} className="cursor-pointer">
          <ActiveLink
            include="settings"
            variant={"ghost"}
            size={"icon"}
            href="/dashboard/settings"
            className={isSetting ? 'bg-blue-600' : ""}
          >
            <Settings2 className={isSetting ? "text-white" : ""}/>
          </ActiveLink>
        </HoverCardTrigger>
        <HoverCardContent align="start">
          <span>{t("MAIN.SETTINGS_HOVER")}</span>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default Bottom;
