import z from "zod"

export const signUpSchema = z.object({
	email: z.string().min(1, { message: "please provide email" }).email({ message: "Please enter a vaild email " }),
	password: z.string().min(1, { message: "Please provide password" }).min(8, { message: "Password should be 8 chars" }),
	passwordconformation: z.string().min(1, { message: "Please confirm password" }).min(8, { message: "Password should be 8 chars" }),
}).refine((data) => data.password === data.passwordconformation, {
	message: "Both the password fields are not matched",
	path: ["passwordconformation"],
})
