"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";
import { usePathname } from "@/i18n/routing";

interface Props {
  href: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
  size?: "default" | "sm" | "lg" | "icon" | null;
  children?: React.ReactNode;
  include?: string;
  workspaceIcon?: boolean;
  disableActiveStateColor?: boolean;
}

const ActiveLink = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      href,
      className,
      variant = "default",
      size = "default",
      children,
      include,
      workspaceIcon,
      disableActiveStateColor = false,
      ...props
    }: Props,
    ref
  ) => {
    const pathname = usePathname();
    const router = useRouter();
    const handleClick = () => {
      router.push(href);
    };

    return (
      <div
        onClick={handleClick}
        className={cn(
          `${buttonVariants({ variant, size })} ${
            href === pathname || (include && pathname.includes(include))
              ? workspaceIcon
                ? "font-semibold border-secondary-foreground border-2"
                : disableActiveStateColor
                ? ""
                : "bg-secondary font-semibold"
              : ""
          }`,
          className,"cursor-pointer"
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ActiveLink.displayName = "ActiveLink";

export default ActiveLink;
