import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import type { Context } from "hono"
import { prisma } from "../db/index.js";


const signupSchema = z.object({
    name: z.string().nullable(),
    id: z.uuid(), 
    email: z.email(),
    role: z.enum(["ADMIN", "USER"]), 
    avatarUrl: z.string().optional(),
});

const userResponseSchema = z.object(
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

export const CreateUserInDB = createRoute({
    method: "post",
    path: "/signup",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: signupSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "user created successfully",
            content: {
                "application/json": {
                    schema: userResponseSchema,
                },
            },
        },
        500: {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        error: z.string(),
                    }),
                },
            },
        },
    },
})

export const CreateUserInDBHandler = async (c: Context) => {
    
    try {
        const body = await c.req.json()
        const validatedBody = signupSchema.parse(body)
        const {id, name, email, role, avatarUrl} = validatedBody
        console.log(id)
        const user = await prisma.user.create({
            data: {
                id,
                name,
                email,
                role,
                avatarUrl,
            },
            
        })
        
        const responseData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as "ADMIN" | "USER",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
        
        return c.json({ message: "User created successfully", data: responseData }, 200);
    } catch (error) {
        console.error("Error processing request in CreateUserInDBHandler:", error);
        return c.json({ message: "An error occurred.", error: (error as Error).message }, 500);
    }

}
