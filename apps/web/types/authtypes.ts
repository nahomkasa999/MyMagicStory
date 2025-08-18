import z from "zod";

export const signupSchema = z.object({
    name: z.string().nullable(),
    id: z.uuid(), 
    email: z.email(),
    role: z.enum(["ADMIN", "USER"]), 
    avatarUrl: z.string().optional(),
});

export const userResponseSchema = z.object(
    {
    message : z.string(),
    data: z.object({
    id: z.uuid(),
    name: z.string().nullable(),
    email: z.email(),
    role: z.enum(["ADMIN", "USER"]),
    createdAt: z.date(),
    updatedAt: z.date(),
    })
});
