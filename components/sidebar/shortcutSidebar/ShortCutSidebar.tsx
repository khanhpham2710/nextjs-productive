import { Workspace } from "@prisma/client";
import Top from "./Top";
import Bottom from "./Bottom";
import Workspaces from "../workspace/Workspaces";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddWorkspace from "../workspace/newWorkspace/AddWorkSpace";

interface Props {
  userWorkspaces: Workspace[];
  createdWorkspaces: number;
}

export const ShortcutSidebar = ({
    userWorkspaces,
    createdWorkspaces,
  }: Props) => {
    return (
      <div className="border-r h-full flex flex-col justify-between items-center p-4 sm:py-6">
        <ScrollArea className="max-h-[35rem]">
          <div className="w-full space-y-3 p-1">
            <Top />
            <Workspaces
              userWorkspaces={userWorkspaces}
              href="/dashboard/workspace"
            />
            <AddWorkspace createdWorkspaces={createdWorkspaces} />
          </div>
        </ScrollArea>
        <Bottom />
      </div>
    );
  };