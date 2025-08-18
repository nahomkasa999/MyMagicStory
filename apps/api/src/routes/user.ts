import type { Context } from "hono";
import { createRoute, } from "@hono/zod-openapi";

export const getUsersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Users"],
  responses: {
    200: {
      description: "Users fetched successfully",
    },
    401: {
      description: "Unauthorized",
    },
  },
});
export const getUsersHandler = async (c: Context) => {
  const user = c.get("user")
  console.log(user)
  return c.json({"Hellow" : "we have made it this far"});
};
