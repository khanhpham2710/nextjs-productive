import { SubscriptionUser } from "@/types/extended";
import { UserPermission as UserPermissionType } from "@prisma/client";
import MoreOptions from "./MoreOptions";

export interface Props {
  userRole: UserPermissionType;
  user: {
    id: string;
    image?: string | null | undefined;
    username: string;
  };
  workspaceId: string;
  onSetworkspacesubscribers: React.Dispatch<
    React.SetStateAction<SubscriptionUser[]>
  >;
}

function TasksRow({
  user,
  userRole,
  workspaceId,
  onSetworkspacesubscribers,
}: Props) {
  return (
    <li className="w-full grid grid-cols-3 items-center grid-rows-1 gap-4 p-4 border-b last:border-b-0 text-sm sm:text-base h-16">
      <MoreOptions
        workspaceId={workspaceId}
        userId={user.id}
        userRole={userRole}
        onSetworkspacesubscribers={onSetworkspacesubscribers}
      />
    </li>
  );
}

export default TasksRow;
