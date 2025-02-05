import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { SettingsWorkspace } from "@/types/extended";
import { useTranslations } from "next-intl";
import EditorWorkspaceDataForm from "./EditorWorkspaceDataForm";
import EditorWorkspaceImage from "./EditorWorkspaceImage";

export interface Props {
    workspace: SettingsWorkspace;
  }

function EditWorkspaceCard({ workspace }: Props) {
    const t = useTranslations("EDIT_WORKSPACE");
    return (
      <Card className="bg-background border-none shadow-none">
        <CardHeader>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            {t("TITLE")}
          </h1>
          <CardDescription className="text-base break-words">
            {t("DESC")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditorWorkspaceImage workspace={workspace} />
          <EditorWorkspaceDataForm workspace={workspace} />
        </CardContent>
      </Card>
    );
}

export default EditWorkspaceCard
