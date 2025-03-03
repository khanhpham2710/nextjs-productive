"use client";

import ActiveLink from "@/components/ui/active-link";
import { CustomColors, Workspace } from "@prisma/client";
import Image from "next/image";
import { useMemo } from "react";

interface Props {
  workspaceFilterParam: string | null;
  workspace: Workspace;
  href: string;
  currentType: string;
}

function AssignedToMeWorkspace({
  workspace: { id, color, image, name },
  workspaceFilterParam,
  href,
  currentType,
}: Props) {
  const workspaceColor = useMemo(() => {
    switch (color) {
      case CustomColors.PURPLE:
        return "bg-purple-600 hover:bg-purple-500";
      case CustomColors.GREEN:
        return "bg-green-600 hover:bg-green-500";
      case CustomColors.RED:
        return "bg-red-600 hover:bg-red-500";
      case CustomColors.BLUE:
        return "bg-blue-600 hover:bg-blue-500";
      case CustomColors.CYAN:
        return "bg-cyan-600 hover:bg-cyan-500";
      case CustomColors.EMERALD:
        return "bg-emerald-600 hover:bg-emerald-500";
      case CustomColors.INDIGO:
        return "bg-indigo-600 hover:bg-indigo-500";
      case CustomColors.LIME:
        return "bg-lime-600 hover:bg-lime-500";
      case CustomColors.ORANGE:
        return "bg-orange-600 hover:bg-orange-500";
      case CustomColors.FUCHSIA:
        return "bg-fuchsia-600 hover:bg-fuchsia-500";
      case CustomColors.PINK:
        return "bg-pink-600 hover:bg-pink-500";
      case CustomColors.YELLOW:
        return "bg-yellow-600 hover:bg-yellow-500";
      default:
        return "bg-green-600 hover:bg-green-500";
    }
  }, [color]);

  return (
    <ActiveLink
      href={`${href}?workspace=${id}&type=${currentType}`}
      disableActiveStateColor
      variant={"ghost"}
      size={"sm"}
      className={`w-full flex justify-start items-center gap-2 overflow-hidden ${
        workspaceFilterParam === id ? "bg-secondary font-semibold" : ""
      }`}
    >
      {image ? (
        <Image
          priority
          src={image}
          alt="workspace image"
          height={300}
          width={300}
          className="h-7 w-7 object-cover rounded-md"
        />
      ) : (
        <div
          className={`rounded-md text-white font-bold h-7 w-7 flex justify-center items-center ${workspaceColor}`}
        >
          <p>{name[0].toUpperCase()}</p>
        </div>
      )}
      <p>{name}</p>
    </ActiveLink>
  );
}

export default AssignedToMeWorkspace;
