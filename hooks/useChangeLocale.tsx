"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useState, useTransition } from "react";

export const useChangeLocale = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (nextLocale: "vi" | "en") => {
    setIsLoading(true);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return { isLoading, isPending, onSelectChange };
};