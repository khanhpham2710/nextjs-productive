import ClientError from "@/components/error/ClientError";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LoadingState } from "@/components/ui/loadingState";
import { FilterXIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import CommandContainer from "./FilterCommand/CommandContainer";
import { useFilterByUsersAndTagsInWorkspace } from "@/context/FilterByUsersAndTagsInWorkspace";

interface Props {
    sessionUserId: string;
  }

export default function Filter({ sessionUserId }: Props) {
    const { isError, isLoading } = useFilterByUsersAndTagsInWorkspace();
    const t = useTranslations("WORKSPACE_MAIN_PAGE.FILTER");
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"sm"}
            className="text-white flex gap-2 items-center rounded-lg dark:text-black"
          >
            <FilterXIcon size={16} /> {t("FILTER_BTN")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit" align="start">
          {isLoading ? (
            <div className="h-16 flex items-center justify-center">
              <LoadingState />
            </div>
          ) : isError ? (
            <ClientError
              className="bg-popover mt-0 sm:mt-0 md:mt-0"
              message="Error getting tags"
            />
          ) : (
            <CommandContainer sessionUserId={sessionUserId} />
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
}
