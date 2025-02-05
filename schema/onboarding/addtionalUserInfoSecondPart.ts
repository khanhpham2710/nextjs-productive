import { z } from "zod";

export const additionalUserInfoSecondPart = z.object({
  useCase: z.enum(["WORK", "STUDY", "PERSONAL_USE"], {
    required_error: "SCHEMA.CHOOSE_ONE",
  }),
});

export type AdditionalUserInfoSecondPart = z.infer<
  typeof additionalUserInfoSecondPart
>;