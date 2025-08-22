import "dotenv/config";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createPostRoute,
  createPostHandler,
} from "./routes/CreateStoryBook.js";
import { getUsersRoute, getUsersHandler } from "./routes/user.js";
import {
  getSecureImageUrlRoute,
  getSecureImageUrlHandler,
} from "./routes/secure-image-url.js";
import { supabaseAuth } from "./middleware/auth.js";
import { CreateUserInDBHandler, CreateUserInDB } from "./routes/auth.js";
import {
  createTemplateRoute,
  createTemplateHandler,
} from "./routes/template.js";
import {
  getAllTemplatesRoute,
  getAllTemplatesHandler,
} from "./routes/user/choiceTemplate.js";
import {
  getUserStorybooksRoute,
  getUserStorybooksHandler,
} from "./routes/user/storybooks.js";
import {
  previewRoute,
  previewHandler,
  getPreviewsRoute,
  getPreviewsHandler,
} from "./routes/pdf-preview.js";
import { checkoutRoute, checkoutHandler } from "./routes/payment/stripeCheckout.js";
const app = new OpenAPIHono();

app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json(
    {
      error: "Internal Server Error",
      message: err.message || "Something went wrong",
    },
    500
  );
});

app.use("/template", supabaseAuth)
app.use("/user/storybooks", supabaseAuth)
app.use("/user/templates", supabaseAuth)
app.use("/post-data/*", supabaseAuth)

//dashbaord grid
app.use("/generate-previews", supabaseAuth)
app.use("/previews/*", supabaseAuth)

//stirpe authenticated
app.use("/api/*", supabaseAuth)

//authentication
app.openapi(CreateUserInDB, CreateUserInDBHandler )

app.openapi(getUsersRoute,  getUsersHandler)
app.openapi(createPostRoute, createPostHandler);
app.openapi(getSecureImageUrlRoute, getSecureImageUrlHandler);
app.openapi(createTemplateRoute, createTemplateHandler);
app.openapi(getAllTemplatesRoute, getAllTemplatesHandler);
app.openapi(getUserStorybooksRoute, getUserStorybooksHandler);

// dashbaord story book generation place.
app.openapi(previewRoute, previewHandler);
app.openapi(getPreviewsRoute, getPreviewsHandler);

//stripe
app.openapi(checkoutRoute, checkoutHandler)



app.get("/ui", swaggerUI({ url: "/doc" }));
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "MyMagicStory API",
    description: "API for MyMagicStory",
  },
});

export default app;
