import checkifUserCompletedOnboarding from "@/lib/checkifUserCompletedOnboarding";
import { prisma } from "@/lib/db";
import { NotifyType } from "@prisma/client";
import { redirect } from "next/navigation";

interface Params {
  params: Promise<{
    invite_code: string;
  }>;
  searchParams: Promise<{
    role: string;
    shareCode: ValidRole;
  }>;
}

type ValidRole = "admin" | "editor" | "viewer" | null | undefined;

interface InviteCodeValidWhere {
  inviteCode: string;
  adminCode?: string;
  readOnlyCode?: string;
  canEditCode?: string;
}

async function Workspace({ params, searchParams }: Params) {
  const { invite_code } = await params;
  const { role, shareCode } = await searchParams;

  const session = await checkifUserCompletedOnboarding(
    `/dashboard/invite/${invite_code}`
  );

  if (!role || !shareCode || !invite_code)
    redirect("/dashboard/errors?error=no-data");

  if (role !== "admin" && role !== "editor" && role !== "viewer") {
    redirect("/dashboard/errors?error=wrong-role");
  }

  let inviteCodeValidWhere: InviteCodeValidWhere = {
    inviteCode: invite_code,
  };

  switch (role) {
    case "admin": {
      inviteCodeValidWhere = {
        ...inviteCodeValidWhere,
        adminCode: shareCode,
      };
      break;
    }
    case "editor": {
      inviteCodeValidWhere = {
        ...inviteCodeValidWhere,
        canEditCode: shareCode,
      };
      break;
    }
    case "viewer": {
      inviteCodeValidWhere = {
        ...inviteCodeValidWhere,
        readOnlyCode: shareCode,
      };
      break;
    }
    default:
      return redirect("/dashboard/errors?error=wrong-role");
  }

  const inviteCodeValid = await prisma.workspace.findUnique({
    where: {
      ...inviteCodeValidWhere,
    },
  });

  if (!inviteCodeValid)
    redirect("/dashboard/errors?error=outdated-invite-code");

  const workspaceUsers = await prisma.subscription.findMany({
    where: {
      workspaceId: inviteCodeValid.id,
    },
    select: {
      userId: true,
    },
  });

  const notificationsData = workspaceUsers.map((user) => ({
    notifyCreatorId: session.user.id,
    userId: user.userId,
    workspaceId: inviteCodeValid.id,
    notifyType: NotifyType.NEW_USER_IN_WORKSPACE,
  }));

  await prisma.notification.createMany({
    data: notificationsData,
  });

  const existingWorkspace = await prisma.workspace.findFirst({
    where: {
      inviteCode: invite_code,
      subscribers: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (existingWorkspace)
    redirect(`/dashboard/workspace/${existingWorkspace.id}`);

  const userRole = () => {
    switch (role) {
      case "admin":
        return "ADMIN";
      case "editor":
        return "CAN_EDIT";
      case "viewer":
        return "READ_ONLY";
      default:
        return redirect("/dashboard/errors?error=wrong-role");
    }
  };

  await prisma.subscription.create({
    data: {
      userId: session.user.id,
      workspaceId: inviteCodeValid.id,
      userRole: userRole(),
    },
  });

  redirect(`/dashboard/workspace/${inviteCodeValid.id}`);
}

export default Workspace;
