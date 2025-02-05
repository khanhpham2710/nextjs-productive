"use client";
import React, { createContext, useCallback, useContext, useState } from "react";
import { ReactFlowInstance, ReactFlowJsonObject } from '@xyflow/react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useAutosaveIndicator } from "./AutosaveIndicator";


interface AutoSaveMindMapContext {
  onSave: () => void;
  setRfInstance: React.Dispatch<React.SetStateAction<ReactFlowInstance | null>>;
  onSetIds: (mindMapId: string, workspaceId: string) => void;
}

interface Props {
  children: React.ReactNode;
}

export const AutoSaveMindMapCtx = createContext<AutoSaveMindMapContext | null>(
  null
);

export const AutoSaveMindMapProvider = ({ children }: Props) => {
  const [rfInstance, setRfInstance] = useState<null | ReactFlowInstance>(null);
  const [ids, setIds] = useState<null | {
    mindMapId: string;
    workspaceId: string;
  }>(null);
  const { onSetStatus } = useAutosaveIndicator();
  
  const m = useTranslations("MESSAGES.ERRORS")

  const { toast } = useToast();
  const queryClient = useQueryClient()

  const { mutate: updateMindMap } = useMutation({
    mutationFn: async (flow: ReactFlowJsonObject) => {
      await axios.post(`/api/mind_maps/update`, {
        content: flow,
        mindMapId: ids?.mindMapId,
        workspaceId: ids?.workspaceId,
      });
    },
    onSuccess: () => {
      onSetStatus("saved");
      queryClient.invalidateQueries({queryKey: [ids?.mindMapId]})
    },
    onError: () => {
      onSetStatus("unsaved");
      toast({
        title: m("SAVING_MINDMAP"),
        variant: "destructive",
      });
    },
  });

  const onSave = useCallback(() => {
    if (rfInstance && ids) {
      const flow = rfInstance?.toObject();
      updateMindMap(flow);
    }
  }, [rfInstance, updateMindMap, ids]);

  const onSetIds = useCallback((mindMapId: string, workspaceId: string) => {
    setIds({ mindMapId, workspaceId });
  }, []);

  return (
    <AutoSaveMindMapCtx.Provider value={{ setRfInstance, onSave, onSetIds }}>
      {children}
    </AutoSaveMindMapCtx.Provider>
  );
};

export const useAutoSaveMindMap = () => {
  const ctx = useContext(AutoSaveMindMapCtx);
  if (!ctx) throw new Error("invalid use");

  return ctx;
};