import { PomodoroSettings } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { useTranslations } from "next-intl";
import SettingsForm from "./SettingsForm";

interface Props {
  pomodoroSettings: PomodoroSettings;
}

export default function SettingsContainer({ pomodoroSettings }: Props) {
  const t = useTranslations("POMODORO.SETTINGS.CARD");
  return (
    <Card className="bg-background border-none shadow-none">
      <CardHeader>
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          {t("TITLE")}
        </h1>
        <CardDescription className="text-base">{t("DESC")}</CardDescription>
      </CardHeader>
      <CardContent className="max-w-2xl">
        <SettingsForm pomodoroSettings={pomodoroSettings} />
      </CardContent>
    </Card>
  );
}
