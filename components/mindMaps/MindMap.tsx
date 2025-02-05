"use client";

import { Button } from "../ui/button";
import { Tag } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Sheet } from "../ui/sheet";
import EdgeOptions from "./EdgeOptions";
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Edge,
  EdgeTypes,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  Panel,
  ReactFlowJsonObject,
  NodeChange,
  Controls,
  MiniMap,
} from "@xyflow/react";
import { Separator } from "../ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { PlusSquare, Save } from "lucide-react";
import CustomBezier from "./labels/CustomBezier";
import CustomStraight from "./labels/CustomStraight";
import CustomStepSharp from "./labels/CustomStepSharp";
import { ExtendedMindMap } from "@/types/extended";
import { useAutoSaveMindMap } from "@/context/AutoSaveMindMap";
import { useDebouncedCallback } from "use-debounce";
import { EdgeOptionsSchema } from "@/schema/edgeOptionSchema";
import LoadingScreen from "../common/LoadingScreen";
import TextNode from "./nodes/TextNode";
import EditInfo from "./edit/EditInfo";
import { useAutosaveIndicator } from "@/context/AutosaveIndicator";
import { MindMapTagsSelector } from "./MindMapTagsSelector";
import { DeleteAllNodes } from "./DeleteAllNodes";

const edgeTypes: EdgeTypes = {
  customBezier: CustomBezier,
  customStraight: CustomStraight,
  customStepSharp: CustomStepSharp,
};

interface Props {
  initialInfo: ExtendedMindMap;
  workspaceId: string;
  canEdit: boolean;
  initialActiveTags: Tag[];
}

export default function MindMap({
  initialInfo,
  workspaceId,
  canEdit,
  initialActiveTags,
}: Props) {
  const [clickedEdge, setClickedEdge] = useState<Edge | null>(null);
  const [openSheet, setOpenSheet] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const nodeTypes = useMemo(() => ({ textNode: TextNode }), []);
  const [isMounted, setIsMounted] = useState(false);
  const [isEditable, setIsEditable] = useState(canEdit);
  const t = useTranslations("MIND_MAP");

  const { setRfInstance, onSave, onSetIds } = useAutoSaveMindMap();
  const { onSetStatus, status } = useAutosaveIndicator();

  const debouncedMindMapInfo = useDebouncedCallback(() => {
    onSetStatus("pending");
    onSave();
  }, 3000);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const { content } = initialInfo;
    if (content) {
      const { nodes = [], edges = [] } =
        content as unknown as ReactFlowJsonObject;
      setNodes(nodes);
      setEdges(edges);
    }
    onSetIds(initialInfo.id, workspaceId);
  }, [initialInfo, initialInfo.id, workspaceId, onSetIds]);

  const onAddNode = useCallback(() => {
    const newNode = {
      id: Math.random().toString(),
      type: "textNode",
      position: { x: 0, y: 0 },
      data: { text: "test", color: 12 },
    };

    setNodes((nds) => nds.concat(newNode));
    onSetStatus("unsaved");
    debouncedMindMapInfo();
  }, [debouncedMindMapInfo, onSetStatus]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => {
      setNodes((nds) => {
        return applyNodeChanges(changes, nds);
      });
      if (changes[0].type == "remove") {
        const id = changes[0].id;
        setEdges((prevEdges) => {
          const edges = prevEdges.filter(
            (edge) => edge.source != id && edge.target != id
          );
          return edges;
        });
        debouncedMindMapInfo();
      }
    },
    [debouncedMindMapInfo]
  );

  useEffect(() => {
    setIsEditable(canEdit);
  }, [canEdit]);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => {
      return applyEdgeChanges(changes, eds);
    });
  }, []);

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      if (!isEditable) return;
      setClickedEdge(edge);
      setOpenSheet(true);
    },
    [isEditable]
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      onSetStatus("unsaved");
      debouncedMindMapInfo();
    },
    [debouncedMindMapInfo, onSetStatus]
  );

  const onSaveChange = useCallback(
    (data: EdgeOptionsSchema) => {
      const { animated, edgeId, label, color, type, target, source } = data;
      setEdges((prevEdges) => {
        const edges = prevEdges.map((edge) =>
          edge.id === edgeId
            ? {
                ...edge,
                data: {
                  label,
                  color,
                },
                type,
                animated,
                target: target ? target : edge.target,
                source: source ? source : edge.source,
              }
            : edge
        );

        return edges;
      });
      setOpenSheet(false);
      onSetStatus("unsaved");
      debouncedMindMapInfo();
    },
    [debouncedMindMapInfo, onSetStatus]
  );

  const onDeleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((prevEdges) => {
        const edges = prevEdges.filter((edge) => edge.id !== edgeId);
        return edges;
      });
      setOpenSheet(false);
      onSetStatus("unsaved");
      debouncedMindMapInfo();
    },
    [debouncedMindMapInfo, onSetStatus]
  );

  const onNodeDrag = useCallback(() => {
    onSetStatus("unsaved");
    debouncedMindMapInfo();
  }, [debouncedMindMapInfo, onSetStatus]);

  if (!isMounted) return <LoadingScreen />;

  return (
    <div className="w-full h-full flex flex-col">
      {clickedEdge && (
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <EdgeOptions
            clickedEdge={clickedEdge}
            isOpen={openSheet}
            onSave={onSaveChange}
            onDeleteEdge={onDeleteEdge}
          />
        </Sheet>
      )}

      <div className="h-full">
        <ReactFlow
          fitView
          onInit={setRfInstance}
          onNodeDrag={onNodeDrag}
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          connectOnClick={isEditable}
          edgesReconnectable={isEditable}
          edgesFocusable={isEditable}
          nodesDraggable={isEditable}
          nodesConnectable={isEditable}
          nodesFocusable={isEditable}
          elementsSelectable={isEditable}
          proOptions={{
            hideAttribution: true,
          }}
        >
          {isEditable && (
            <Panel
              position="top-left"
              className="bg-background z-50 shadow-sm border rounded-sm py-0.5 px-3"
            >
              <div className="flex gap-2 w-full items-center">
                <HoverCard openDelay={250} closeDelay={250}>
                  <HoverCardTrigger asChild>
                    <Button variant={"ghost"} size={"icon"} onClick={onAddNode}>
                      <PlusSquare size={22} />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent align="start">
                    {t("HOVER_TIP.ADD_TITLE")}
                  </HoverCardContent>
                </HoverCard>

                <EditInfo
                  workspaceId={workspaceId}
                  title={initialInfo.title}
                  mapId={initialInfo.id}
                  emoji={initialInfo.emoji}
                />

                <HoverCard openDelay={250} closeDelay={250}>
                  <HoverCardTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => {
                        onSetStatus("pending");
                        onSave();
                      }}
                      disabled={status === "pending" || status === "saved"}
                    >
                      <Save size={22} />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent align="start" sideOffset={8}>
                    {t("HOVER_TIP.SAVE")}
                  </HoverCardContent>
                </HoverCard>

                <DeleteAllNodes
                  workspaceId={workspaceId}
                  mindMapId={initialInfo.id}
                />

                <div className="h-8">
                  <Separator orientation="vertical" />
                </div>

                <MindMapTagsSelector
                  initialActiveTags={initialActiveTags}
                  mindMapId={initialInfo.id}
                  isMounted={isMounted}
                  workspaceId={workspaceId}
                />
              </div>
            </Panel>
          )}

          <Background />
          <Controls className="text-black" />
          <MiniMap nodeStrokeWidth={3} />
        </ReactFlow>
      </div>
    </div>
  );
}
