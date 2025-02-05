"use client";

import ActiveLink from "@/components/ui/active-link";
import { Workspace } from "@prisma/client";
import { LockKeyhole, SunMoon, User2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import SettingsWorkspace from "./SettingsWorkspace";
import { HeaderLink } from "@/lib/constants";

const settingsFields: HeaderLink[] = [
  {
    href: "/dashboard/settings",
    Icon: User2,
    title: "SETTINGS.ACCOUNT",
  },
  {
    href: "/dashboard/settings/security",
    Icon: LockKeyhole,
    title: "SETTINGS.SECURITY",
  },
  {
    href: "/dashboard/settings/theme",
    Icon: SunMoon,
    title: "SETTINGS.THEME",
  },
];

interface Props {
  userAdminWorkspaces: Workspace[];
}

function Settings({ userAdminWorkspaces }: Props) {
  const t = useTranslations("SIDEBAR");
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <p className="text-xs sm:text-sm uppercase text-muted-foreground">
          {t("SETTINGS.GENERAL")}
        </p>
        <div className="flex flex-col gap-2 w-full mt-2">
          {settingsFields.map((settingField, i) => {
            const Icon = settingField.Icon;
            return (
              <ActiveLink
                key={i}
                href={settingField.href}
                variant={"ghost"}
                size={"sm"}
                className="flex justify-start w-full items-center gap-2"
              >
                {Icon && <Icon size={20} />}
                {t(settingField.title)}
              </ActiveLink>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs sm:text-sm uppercase text-muted-foreground">
          {t("SETTINGS.WORKSPACE")}
        </p>
        <div className="flex flex-col gap-2 w-full mt-2">
          {userAdminWorkspaces.map((workspace) => (
            <SettingsWorkspace
              key={workspace.id}
              href="/dashboard/settings/workspace"
              workspace={workspace}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
