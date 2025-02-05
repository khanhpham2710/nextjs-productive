import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAutosaveIndicator } from "@/context/AutosaveIndicator";
import { useAutoSaveMindMap } from "@/context/AutoSaveMindMap";
import { cn } from "@/lib/utils";
import { MindMapItemColors } from "@/types/enums";
import { Check, MoreHorizontal, Palette, Pencil, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import {
  Handle,
  NodeResizeControl,
  OnResizeEnd,
  Position,
  useReactFlow,
} from "@xyflow/react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  nodeId: string;
  children: React.ReactNode;
  className?: string;
  color?: MindMapItemColors;
  isEditing: boolean;
  onIsEdit: () => void;
}

const colors = [
  MindMapItemColors.BLUE,
  MindMapItemColors.CYAN,
  MindMapItemColors.DEFAULT,
  MindMapItemColors.EMERALD,
  MindMapItemColors.FUCHSIA,
  MindMapItemColors.GREEN,
  MindMapItemColors.INDIGO,
  MindMapItemColors.LIME,
  MindMapItemColors.ORANGE,
  MindMapItemColors.PINK,
  MindMapItemColors.PINK,
  MindMapItemColors.PURPLE,
  MindMapItemColors.RED,
];

export default function NodeWrapper({
  nodeId,
  children,
  className,
  color = MindMapItemColors.DEFAULT,
  isEditing,
  onIsEdit,
}: Props) {
  const [currColor, setCurrColor] = useState<MindMapItemColors | undefined>(
    color
  );
  const { setNodes } = useReactFlow();
  const { onSetStatus } = useAutosaveIndicator();
  const { onSave } = useAutoSaveMindMap();
  const t = useTranslations("MIND_MAP.NODE");

  const debouncedMindMapInfo = useDebouncedCallback(() => {
    onSetStatus("pending");
    onSave();
  }, 3000);

  const onSaveNode = useCallback(
    (color: MindMapItemColors) => {
      setNodes((prevNodes) => {
        const nodes = prevNodes.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, color } } : node
        );
        return nodes;
      });
      onSetStatus("unsaved");
      debouncedMindMapInfo();
    },
    [setNodes, nodeId, debouncedMindMapInfo, onSetStatus]
  );

  const onDeleteNode = useCallback(() => {
    setNodes((prevNodes) => {
      const nodes = prevNodes.filter((node) => node.id !== nodeId);
      return nodes;
    });
    onSetStatus("unsaved");
    debouncedMindMapInfo();
  }, [setNodes, onSetStatus, debouncedMindMapInfo, nodeId]);

  const onColorSelect = useCallback(
    (newColor: MindMapItemColors) => {
      setCurrColor(newColor);
      onSaveNode(newColor);
    },
    [onSaveNode]
  );

  const onResize : OnResizeEnd = useCallback(()=>{
      console.log("resize")
      onSetStatus("unsaved");
      debouncedMindMapInfo();
    },[debouncedMindMapInfo, onSetStatus])

  const nodeColor = useCallback((color: MindMapItemColors) => {
    switch (color) {
      case MindMapItemColors.PURPLE:
        return "!bg-purple-600 hover:bg-purple-500 text-white";
      case MindMapItemColors.GREEN:
        return "!bg-green-600 hover:bg-green-500 text-white";
      case MindMapItemColors.RED:
        return "!bg-red-600 hover:bg-red-500 text-white";
      case MindMapItemColors.BLUE:
        return "!bg-blue-600 hover:bg-blue-500 text-white";
      case MindMapItemColors.CYAN:
        return "!bg-cyan-600 hover:bg-cyan-500 text-white";
      case MindMapItemColors.EMERALD:
        return "!bg-emerald-600 hover:bg-emerald-500 text-white";
      case MindMapItemColors.INDIGO:
        return "!bg-indigo-600 hover:bg-indigo-500 text-white";
      case MindMapItemColors.LIME:
        return "!bg-lime-600 hover:bg-limes-500 text-white";
      case MindMapItemColors.ORANGE:
        return "!bg-orange-600 hover:bg-orange-500 text-white";
      case MindMapItemColors.FUCHSIA:
        return "!bg-fuchsia-600 hover:bg-fuchsia-500 text-white";
      case MindMapItemColors.PINK:
        return "!bg-pink-600 hover:bg-pink-500 text-white";
      case MindMapItemColors.YELLOW:
        return "!bg-yello-600 hover:bg-yellow-500 text-white";
      default:
        return "!bg-secondary hover:bg-secondary-500";
    }
  }, []);



  return (
    <div
      className={cn(
        `h-full text-xs px-3 py-1.5 rounded-sm shadow-sm flex items-start justify-between transition-colors duration-200 gap-2 ${nodeColor(
          currColor!
        )}`,
        className
      )}
    >
      <div className={`h-full ${isEditing ? "w-full" : "w-[90%]"} text-lg`}>
        {children}
        <>
          <Handle
            type="target"
            position={Position.Left}
            className={`transition-colors !border-popover duration-200 p-1 bg-red-300`}
          />
          <Handle
            type="source"
            position={Position.Right}
            className={`transition-colors !border-popover duration-200 p-1 bg-red-300`}
          />
          {!isEditing && (
            <NodeResizeControl
              style={controlStyle}
              minWidth={100}
              minHeight={50}
              onResizeEnd={onResize}
            >
              <ResizeIcon />
            </NodeResizeControl>
          )}
        </>
      </div>
      {!isEditing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={`w-6 h-6 hover:bg-transparent ${
                currColor === MindMapItemColors.DEFAULT
                  ? ""
                  : "text-white hover:text-white"
              }`}
              variant={"ghost"}
              size={"icon"}
            >
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={-10} align="start">
            <DropdownMenuItem
              onClick={() => {
                onIsEdit();
              }}
              className="cursor-pointer gap-2"
            >
              <Pencil size={16} />
              <span>{t("EDIT")}</span>
            </DropdownMenuItem>{" "}
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <Palette size={16} />
                  <span>{t("COLOR")}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent
                    className="hover:bg-popover"
                    sideOffset={10}
                  >
                    <DropdownMenuItem className="grid grid-cols-4 gap-2 focus:bg-popover">
                      {colors.map((color, i) => (
                        <Button
                          key={i}
                          onClick={() => {
                            onColorSelect(color);
                          }}
                          className={`w-5 h-5 p-1 rounded-full ${nodeColor(
                            color
                          )}`}
                        >
                          {color === currColor && (
                            <Check
                              className={`${
                                color !== MindMapItemColors.DEFAULT
                                  ? "text-white"
                                  : ""
                              }`}
                              size={16}
                            />
                          )}
                        </Button>
                      ))}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                onDeleteNode();
              }}
              className="cursor-pointer gap-2"
            >
              <Trash size={16} />
              {t("DELETE")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

const controlStyle = {
  background: "transparent",
  border: "none",
};

function ResizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#ff0071"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: "absolute", right: 5, bottom: 5 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}
