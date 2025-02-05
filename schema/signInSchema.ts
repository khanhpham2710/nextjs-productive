import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().nonempty("Please enter password")
  // .min(10, "Password must be at least 10 characters"),
});

export type SignInSchema = z.infer<typeof signInSchema>;