"use client";

import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loadingState";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  Icon: LucideIcon;
  isLoading: boolean;
  onClick: () => void;
}

export const ShortcutContainerBtnItem = ({
  Icon,
  title,
  isLoading,
  onClick,
}: Props) => {
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      variant={"outline"}
      className={`text-sm md:text-base w-full h-14 p-2 rounded-lg shadow-sm flex justify-center items-center gap-1 md:gap-2`}
    >
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <Icon size={16} />
          <h4 className="break-words">{title}</h4>
        </>
      )}
    </Button>
  );
};