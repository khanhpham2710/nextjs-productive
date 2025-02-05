"use client"

import React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { FileWarning, Save } from 'lucide-react';
import { LoadingState } from '../ui/loadingState';
import { useAutosaveIndicator } from '@/context/AutosaveIndicator';

function SavingStatus() {
    const { status } = useAutosaveIndicator();
    const t = useTranslations("COMMON.SAVING_STATUS");
  
    return (
      <HoverCard openDelay={250} closeDelay={250}>
        <HoverCardTrigger asChild>
          <div
            className={cn(
              `px-3 h-9 py-1.5 flex justify-center items-center rounded-md font-semibold gap-2 text-sm bg-primary text-white dark:text-black ${
                status === "pending" ? "bg-yellow-400" : ""
              } ${status === "unsaved" ? "bg-red-500" : ""}`
            )}
          >
            {status === "saved" && (
              <>
                <Save size={18} />
                <p className="hidden sm:inline-block">{t("SAVED")}</p>
              </>
            )}
            {status === "pending" && (
              <>
                <LoadingState />
                <p className="hidden sm:inline-block">{t("SAVING")}</p>
              </>
            )}
            {status === "unsaved" && (
              <>
                <FileWarning size={18} />
                <p className="hidden sm:inline-block">{t("UNSAVED")}</p>
              </>
            )}
          </div>
        </HoverCardTrigger>
        <HoverCardContent align="start">
          We save your files automatically
        </HoverCardContent>
      </HoverCard>
    );
}

export default SavingStatus
