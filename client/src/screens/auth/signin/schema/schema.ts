import z from "zod";

export const signinSchema = z.object({
  email: z.string().min(1, "Email is Required").email("Invalid email"),
  password: z.string().min(8, "Password must be at least 6 characters"),
});

 export type SignInFormData = z.infer<typeof signinSchema>;
