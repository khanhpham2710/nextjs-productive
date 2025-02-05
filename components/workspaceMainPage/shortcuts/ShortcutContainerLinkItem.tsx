"use client";

import { buttonVariants } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  title: string;
  Icon: LucideIcon;
  href: string;
}

export const ShortcutContainerLinkItem = ({
  Icon,
  title,
  href,
}: Props) => {
  return (
    <Link
      href={href}
      className={`${buttonVariants({
        variant: "outline",
      })} text-sm md:text-base w-full !h-14 p-2 rounded-lg shadow-sm flex justify-center items-center gap-1 md:gap-2`}
    >
      <Icon size={16} />
      <h4 className="break-words">{title}</h4>
    </Link>
  );
};
