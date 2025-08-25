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
  getTemplatesRoute,
  getTemplatesHandler,
  getOneTemplateRoute,
  getOneTemplateHandler,
  updateTemplateRoute,
  updateTemplateHandler,
  deleteOneTemplateRoute,
  deleteOneTemplateHandler,
  deleteManyTemplatesRoute,
  deleteManyTemplatesHandler,
} from "./routes/template.js"; // Import all new template routes and handlers
import {
  getAllTemplatesRoute,
  getAllTemplatesHandler,
} from "./routes/user/choiceTemplate.js";
import {
  getUserStorybooksRoute,
  getUserStorybooksHandler,
} from "./routes/user/storybooks.js";
import { checkoutRoute, checkoutHandler } from "./routes/payment/stripeCheckout.js";
import { buyBookHandler, buyBookRoute } from "./routes/payment/onetimePayment.js";
import { verifyAndGenerateHandler, verifyAndGenerateRoute } from "./routes/payment/verifyandcontinuePdf.js";
import { stripeWebhookHandler, stripeWebhookRoute } from "./routes/payment/webhooks.js";
import { getProjectPdfRoute, getProjectPdfHandler } from "./routes/projectspdf.js";
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

// All template routes are now authenticated
app.use("/templates/*", supabaseAuth);
app.use("/template", supabaseAuth)
app.use("/user/storybooks", supabaseAuth)
app.use("/user/templates", supabaseAuth)
app.use("/post-data/*", supabaseAuth)
app.use("/project/*", supabaseAuth)
//stirpe authenticated
app.use("/payment/*", supabaseAuth)

//authentication
app.openapi(CreateUserInDB, CreateUserInDBHandler );

app.openapi(getUsersRoute,  getUsersHandler);
app.openapi(createPostRoute, createPostHandler);
app.openapi(getSecureImageUrlRoute, getSecureImageUrlHandler);

// --- All Template CRUD Routes ---
// The path for all templates should be /templates, not /template
app.openapi(createTemplateRoute, createTemplateHandler);
app.openapi(getTemplatesRoute, getTemplatesHandler);
app.openapi(getOneTemplateRoute, getOneTemplateHandler);
app.openapi(updateTemplateRoute, updateTemplateHandler);
app.openapi(deleteOneTemplateRoute, deleteOneTemplateHandler);
app.openapi(deleteManyTemplatesRoute, deleteManyTemplatesHandler);
// --- End of Template CRUD Routes ---

app.openapi(getAllTemplatesRoute, getAllTemplatesHandler);
app.openapi(getUserStorybooksRoute, getUserStorybooksHandler);

// dashbaord story book generation place.
app.openapi(getProjectPdfRoute, getProjectPdfHandler);
//stripe
app.openapi(checkoutRoute, checkoutHandler);
app.openapi(buyBookRoute, buyBookHandler);
app.openapi(verifyAndGenerateRoute, verifyAndGenerateHandler);
app.openapi(stripeWebhookRoute, stripeWebhookHandler);


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