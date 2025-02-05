import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
} from "@xyflow/react";
import EdgeLabel from "./EdgeLabel";
import { EdgeColor } from "@/types/enums";

export default function CustomStraight({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
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
