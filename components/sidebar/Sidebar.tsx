import { getUserAdminWorkspaces, getWorkspaces } from "@/lib/api";
import { auth } from "@/lib/auth";
import SidebarContainer from "./SidebarContainer";

export const Sidebar = async () => {
    const session = await auth();
    if (!session) return null;
  
    const [userWorkspaces, userAdminWorkspaces] = await Promise.all([
      getWorkspaces(session.user.id),
      getUserAdminWorkspaces(session.user.id),
    ]);
    
    return (
      <SidebarContainer
        userWorkspaces={userWorkspaces ? userWorkspaces : []}
        userAdminWorkspaces={userAdminWorkspaces ? userAdminWorkspaces : []}
        userId={session.user.id}
      />
    );
};