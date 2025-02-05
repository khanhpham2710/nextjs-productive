"use client";

import { useLocale } from "next-intl";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface Props {
  asChild?: boolean;
  className?: string;
  children: React.ReactNode;
  onSelectedEmoji: (emoji: string) => void;
  align?: "start" | "center" | "end";
  id?: string;
  onOpenChange?: (open: boolean) => void;
}

interface OnSelect {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}

function EmojiSelector({
  asChild,
  className,
  children,
  onSelectedEmoji,
  align,
  id,
}: Props) {
  const { theme, systemTheme } = useTheme();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const emojiTheme = useMemo(() => {
    switch (theme) {
      case "dark":
        return "dark";
      case "light":
        return "light";
      case "system":
        return systemTheme;
    }
  }, [theme, systemTheme]);

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        id={id}
        asChild={asChild}
        className={cn(
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-lg",
          className
        )}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent asChild align={align}>
        <div className="z-50 emoji-picker">
          <Picker
            data={data}
            emojiSize={20}
            emojiButtonSize={32}
            theme={emojiTheme}
            locale={locale}
            onEmojiSelect={(e: OnSelect) => {
              onSelectedEmoji(e.unified);
              setOpen(false);
            }}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default EmojiSelector;
