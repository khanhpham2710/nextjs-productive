"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { LoadingState } from "@/components/ui/loadingState";
import Warning from "@/components/ui/warning";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionUser } from "@/types/extended";
import { UserPermission as UserPermissionType } from "@prisma/client";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  userRole: UserPermissionType;
  userId: string;
  workspaceId: string;
  onSetworkspacesubscribers: React.Dispatch<
    React.SetStateAction<SubscriptionUser[]>
  >;
}

function MoreOptions({
  userRole,
  userId,
  workspaceId,
  onSetworkspacesubscribers,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations("EDIT_WORKSPACE.MEMBERS.OPTIONS");
  const m = useTranslations("MESSAGES");

  const { toast } = useToast();
  const router = useRouter();

  const adminOrOwner =
    userRole == UserPermissionType.ADMIN ||
    userRole == UserPermissionType.OWNER;

  console.log(adminOrOwner);

  const { mutate: deleteUserFromWorkspace, isPending } = useMutation({
    mutationFn: async () => {
      await axios.post("/api/workspace/users/remove", {
        userId: userId,
        workspaceId,
      });
    },
    onError: (err: AxiosError) => {
      const error = err?.response?.data ? err.response.data : "ERRORS.DEFAULT";

      toast({
        title: m(error),
        variant: "destructive",
      });
    },
    onSuccess: async () => {
      onSetworkspacesubscribers((current) =>
        current.filter((currentSubscribers) => {
          if (currentSubscribers.user.id !== userId) return currentSubscribers;
        })
      );
      router.refresh();
      setIsOpen(false);
    },
    mutationKey: ["deleteUserFromWorkspace"],
  });

  return (
    <div className="flex justify-end">
      {userRole !== "OWNER" && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="text-primary hover:text-primary"
                variant={"ghost"}
                size={"icon"}
              >
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent align="end" sideOffset={-8}>
                <DialogTrigger className="w-full">
                  <DropdownMenuItem className="cursor-pointer">
                    {adminOrOwner ? t("REMOVE_BTN") : t("LEAVE_BTN")}
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {adminOrOwner ? t("REMOVE.TITLE") : t("LEAVE.TITLE")}
                </DialogTitle>
              </DialogHeader>
              <Warning blue>
                <p>{adminOrOwner ? t("REMOVE.NOTE") : t("LEAVE.NOTE")}</p>
              </Warning>

              <Button
                onClick={() => {
                  deleteUserFromWorkspace();
                }}
                disabled={isPending}
                size={"lg"}
                variant={"secondary"}
              >
                {isPending ? (
                  <LoadingState loadingText={t("REMOVE.BTN_PENDING")} />
                ) : adminOrOwner ? (
                  t("REMOVE.BTN")
                ) : (
                  t("LEAVE.BTN")
                )}
              </Button>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </div>
  );
}

export default MoreOptions;
