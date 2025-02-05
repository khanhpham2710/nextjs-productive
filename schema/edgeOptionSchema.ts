import { z } from "zod";

export const edgeOptionsSchema = z.object({
  edgeId: z.string(),
  label: z.string().nullable(),
  type: z.enum(["customStraight", "customStepSharp", "customBezier"]),
  source: z.string().optional(),
  target: z.string().optional(),
  animated: z.boolean(),
  color: z.enum([
    "PURPLE",
    "RED",
    "GREEN",
    "BLUE",
    "PINK",
    "YELLOW",
    "ORANGE",
    "CYAN",
    "LIME",
    "EMERALD",
    "INDIGO",
    "FUCHSIA",
    "DEFAULT",
  ]),
});

export type EdgeOptionsSchema = z.infer<typeof edgeOptionsSchema>;
