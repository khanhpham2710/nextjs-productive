"use client";

import { supabase } from "@/lib/supabase";
import { UserActiveItemList } from "@/types/extended";
import { UserPermission } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface PresencePayload {
  online_at: string;
  userId: string;
}

interface PresenceState {
  [key: string]: PresencePayload[];
}

interface Props {
  children: React.ReactNode;
}

interface UserActivityStatus {
  isLoading: boolean;
  isError: boolean;

  allUsers: UserActiveItemList[];
  allActiveUsers: UserActiveItemList[];
  allInactiveUsers: UserActiveItemList[];

  getActiveUsersRoleType: (role: UserPermission) => UserActiveItemList[];
  checkIfUserIsActive: (id: string) => boolean;
  refetch: () => void;
}

export const UserActivityStatusCtx = createContext<UserActivityStatus | null>(
  null
);

export const UserActivityStatusProvider = ({ children }: Props) => {
  const [allInactiveUsers, setAllInactiveUsers] = useState<
    UserActiveItemList[]
  >([]);
  const [allActiveUsers, setAllActiveUsers] = useState<UserActiveItemList[]>(
    []
  );

  const params = useParams();
  const session = useSession();
  const workspaceId = params.workspace_id ? params.workspace_id : null;

  const {
    data: users,
    isError,
    isLoading,
    refetch,
  } = useQuery<UserActiveItemList[], Error>({
    queryFn: async () => {
      const res = await fetch(
        `/api/users/get-users?workspaceId=${workspaceId}`
      );

      if (!res.ok) {
        const error = (await res.json()) as string;
        throw new Error(error);
      }

      const response = await res.json();

      return response;
    },
    enabled: !!workspaceId,
    queryKey: ["getUserActivityStatus", workspaceId],
  });

  useEffect(() => {
    if (!session.data) return;
    const supabaseClient = supabase();
    const channel = supabaseClient.channel(`activity-status`);
    channel
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            userId: session.data.user.id,
          });
        }
      })
      .on("presence", { event: "sync" }, () => {
        const userIds: string[] = [];

        const activeUsers: UserActiveItemList[] = [];
        const inactiveUsers: UserActiveItemList[] = [];

        const state = channel.presenceState() as PresenceState;

        for (const id in state) {
          userIds.push(state[id][0].userId);
        }

        const uniqueIds = new Set(userIds);

        if (users) {
          users.forEach((user) => {
            if (uniqueIds.has(user.id)) {
              activeUsers.push(user);
            } else {
              inactiveUsers.push(user);
            }
          });
        }

        setAllActiveUsers(activeUsers);
        setAllInactiveUsers(inactiveUsers);
      });
  }, [session.data, users]);

  const getActiveUsersRoleType = useCallback(
    (role: UserPermission) => {
      return allActiveUsers.filter((user) => user.userRole === role);
    },
    [allActiveUsers]
  );

  const checkIfUserIsActive = useCallback(
    (id: string) => !!allActiveUsers?.find((user) => user.id === id),
    [allActiveUsers]
  );

  const info: UserActivityStatus = {
    isLoading,
    isError,
    allUsers: users ?? [],
    allActiveUsers,
    allInactiveUsers,
    getActiveUsersRoleType,
    checkIfUserIsActive,
    refetch,
  };

  return (
    <UserActivityStatusCtx.Provider value={info}>
      {children}
    </UserActivityStatusCtx.Provider>
  );
};

export const useUserActivityStatus = () => {
  const ctx = useContext(UserActivityStatusCtx);
  if (!ctx) throw new Error("invalid use");

  return ctx;
};
