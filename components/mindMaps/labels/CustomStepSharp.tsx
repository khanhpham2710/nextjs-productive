import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";
import EdgeLabel from "./EdgeLabel";
import { EdgeColor } from "@/types/enums";

export default function CustomStepSharp({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <EdgeLabel
          labelX={labelX}
          labelY={labelY}
          label={String(data?.label)}
          color={(data?.color as EdgeColor) || EdgeColor.DEFAULT}
        />
      </EdgeLabelRenderer>
    </>
  );
}
