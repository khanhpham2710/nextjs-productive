import { z } from "zod";

export const additionalUserInfoFirstPart = z.object({
  name: z
    .string()
    .refine((username) => /^[a-zA-Z0-9\u00C0-\u1EF9\u1EA0-\u1ECF\u1E00-\u1E3F]+$/.test(username), {
      message: "SCHEMA.USERNAME.SPECIAL_CHARS",
    })
    .optional(),

  surname: z
    .string()
    .refine((username) => /^[a-zA-Z0-9\u00C0-\u1EF9\u1EA0-\u1ECF\u1E00-\u1E3F]+$/.test(username), {
      message: "SCHEMA.USERNAME.SPECIAL_CHARS",
    })
    .optional(),
});

export type AdditionalUserInfoFirstPart = z.infer<
  typeof additionalUserInfoFirstPart
>;
