import z from "zod";

export const signInSchema = z.object({
    identifier: z
        .string()
        .min(1, { message: "Please provide you email" })
        .email({ message: "Please provide valid email address" }),
    password: z
        .string()
        .min(1, { message: "Please provide password" })
        .min(8, { message: "Password should atleast 8 chars long" }),
});
