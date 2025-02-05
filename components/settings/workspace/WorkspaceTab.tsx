import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Users2 } from "lucide-react";
import DeleteWorkspace from "./overview/DeleteWorkspace";
import EditWorkspaceCard from "./overview/edit/EditWorkspaceCard";
import MembersCard from "./overview/members/MembersCard";
import { SettingsWorkspace } from "@/types/extended";
import { UserPermission } from "@prisma/client";
import TasksTab from "./TasksTab";

export interface Props {
    workspace: SettingsWorkspace;
    workspaceId: string;
    userRole: UserPermission | undefined
  }

function WorkspaceTab({ workspace, workspaceId, userRole }: Props) {
    return (
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="mr-2 flex items-center gap-2">
              <Layers size={18} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="members" className="mr-2 flex items-center gap-2">
              <Users2 size={18} />
              Members
            </TabsTrigger>
            <TabsTrigger value="tasks" className="mr-2 flex items-center gap-2">
              <Users2 size={18} />
              Tasks
            </TabsTrigger>
          </TabsList>
          <TabsContent tabIndex={1} value="overview">
            <EditWorkspaceCard workspace={workspace} />
            <div className="py-4 smLpy-6">
              <Separator />
            </div>
            <DeleteWorkspace workspace={workspace} userRole={userRole}/>
          </TabsContent>
          <TabsContent value="members">
            <MembersCard workspace={workspace} workspaceId={workspaceId} />
          </TabsContent>
          <TabsContent value="tasks">
            <TasksTab workspace={workspace} workspaceId={workspaceId} />
          </TabsContent>
        </Tabs>
      );
}

export default WorkspaceTab
