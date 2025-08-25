cna you make a good job description,

the job is that the a Crud website Archtect expert it will be provided with the schema and stack to use and he must build the website

when he do so  he must follow the following thing
 -> the companies custom, file structure, and stack.

"
the person uses hono / node.js, tanstack for fethcing, better-fetch(search internet to know about this like its a type safe fethcing similar to fetcher but for type script), frontend is Next.js, all all calls to the back end are made by hooks, 
"

so the person main responsiblity will be to see the database, and then plan the flow all in json

e.g this website will have this this this pages according to your input, and looking at the database this page needs this and this and this tables information, 

so the frontend is will expect this kind of data (zod schema), and the backend should send this kind of data,

inorder the backend to send this data the backend will make a request to the this and this table aggreate(if need ...).. and prepare the data to be send to the frontend in this way,

or if we provided the frontend expectation of datas,

the person should make the backend abel to send that json to the fornend. planing how to change the database tabel information to the json the fronend what's is his job.

next he will plan how to use good fetching habit for using tanstack, prevent common pet falls like route fetches, not caching data and freshnes.... 
and also when using tanstack he must use the better-fetch...
"
then he must come up with a good comprehensive types, both for the frontend and the backend
"
this is one example how we use betterfetch
"
"use client";

import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabaseClient";
import { createFetch, createSchema } from "@better-fetch/fetch";
import { z } from "zod";
import { toast } from "sonner";
import { signupSchema, userResponseSchema } from "../../../../types/authtypes";
import { useRouter } from "next/navigation";
import type { UserResponse } from "@supabase/supabase-js";

// --- API Schema and Fetch Instance ---
export const schema = createSchema({
  "/signup": {
    input: signupSchema,
    output: userResponseSchema,
  },
});

const $fetch = createFetch({
  baseURL: "http://localhost:3001",
  schema,
});

// --- Mutation Functions ---
interface SignupArgs {
  username: string;
  email: string;
  password: string;
}

async function signupUser({ username, email, password }: SignupArgs) {
  toast("Signing up...");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });
  if (error) {
    throw error;
  }
  return data;
}

interface LoginArgs {
  email: string;
  password: string;
}

async function loginUser({ email, password }: LoginArgs) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
}

interface ResetPasswordArgs {
  email: string;
}

async function resetPasswordEmail({ email }: ResetPasswordArgs) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) {
    throw error;
  }
}

interface ChangePasswordArgs {
  currentPassword: string;
  newPassword: string;
}

async function changePasswordUser({ currentPassword, newPassword }: ChangePasswordArgs) {
  // First verify current password by attempting to sign in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    throw new Error("No user found");
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    throw new Error("Current password is incorrect");
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }
}

async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

// --- React Query Hook ---//
export function useAuth() {
  const router = useRouter();

  const signup = useMutation({
    mutationFn: signupUser,
    onSuccess: async (supabaseResponse) => {
      const user = supabaseResponse.user;
      if (!user) {
        toast.error("No user returned from Supabase");
        return;
      }
      try {
        await $fetch("/signup", {
          body: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.username ?? null,
            role: "USER",
            avatarUrl: user.user_metadata?.avatar_url ?? undefined,
          },
        });
        toast.success(
          "Signed up successfully. Please check your email to confirm."
        );
      } catch (error: any) {
        console.log(error)
        toast.success(
          "Signed up successfully. Please check your email to confirm."
        );
      }
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Signing up failed. Internal error");
    },
  });

  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      toast.success("Login successful!");
    },
    onError: () => {
      toast.error("Login failed. Please check your credentials");
    },
  });

  const resetPassword = useMutation({
    mutationFn: resetPasswordEmail,
    onSuccess: () => {
      toast.success("Password reset email sent! Check your inbox.");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Failed to send reset email. Please try again.");
    },
  });

  const changePassword = useMutation({
    mutationFn: changePasswordUser,
    onSuccess: () => {
      toast.success("Password updated successfully!");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(
        err.message || "Failed to update password. Please try again."
      );
    },
  });

  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success("Logged out successfully!");
      router.push("/");
    },
    onError: (err: any) => {
      console.error(err);
      toast.error("Failed to logout. Please try again.");
    },
  });

  return { signup, login, resetPassword, changePassword, logout };
}
"
but the tanstack query can be improved to handle different htings,
"

mostly our file structure follows that of Next.js guide

(group) e.g (dashboard)
   _ Components(components for dashboard)
  _hooks (the place were it diffines the to get things from the backedn in type safe way)
  create ( another route)
   _Coponents
  _ hooks
  layout.tsx
 page.tsx
  layout.tsx (dashboard layout)
  page.tsx (dashabord page.tsx)

for the backend we are using hono, so ya most things happen in the src. 
fro the backend its appreaciated if it uses classes to plan things so that the class can be changed fast to real thing

e.g 
 like this
```typescript
// Import necessary libraries for PDF generation, database, and image handling.
import type { LayoutJSON, PageRenderData, LegacyPage } from "./types.js";
import { layoutJsonSchema, legacyLayoutJsonSchema } from "./types.js";
// ... other imports

// Initialize external services like Replicate for AI and Supabase for storage.
const replicate = new Replicate(/* ... */);
const supabase = createClient(/* ... */);

// Declare the PDFPageGenerator class to handle PDF page creation.
export class PDFPageGenerator {
  // Holds the final, validated layout for the PDF.
  layout: LayoutJSON;
  // Stores the initial story template data.
  storyTemplate: any;
  // Flag to check if the user has a full subscription.
  subscription: boolean;
  // The unique ID for the current project.
  projectId: string;
  // Optional images uploaded from the frontend.
  frontendImages?: File[];
  // Stores URLs for images to be used in generation.
  imageUrls: string[] = [];

  // Constructor: Initializes the generator with story data and project details.
  constructor(
    storyTemplate: any,
    isFullGeneration: boolean,
    projectId: string,
    frontendImages?: File[]
  ) {
    // It tries to parse the modern layout format first.
    // If that fails, it assumes a legacy format and converts it.
  }

  // Converts an old layout format to the new, structured format.
  private convertLegacyLayout(legacyLayout: any): LayoutJSON {
    // Maps legacy pages to a new format with default styles.
  }

  // Prepares image URLs for the story.
  private async prepareImageUrls(): Promise<void> {
    // 1. If new images were uploaded, it sends them to Supabase storage.
    // 2. It then fetches all image URLs (new and existing) for the project.
    // 3. It creates signed URLs for them to be used by the image generation AI.
  }

  // Main method to generate the content for each page.
  async generatePages(
    pagesAlreadyGenerated: number = 0
  ): Promise<{ layout: LayoutJSON; pages: PageRenderData[] }> {
    // 1. Prepare all image URLs.
    await this.prepareImageUrls();

    // 2. Determine which pages to process based on subscription status and previous progress.
    //    - Free users get a limited number of pages.
    let pagesToProcess = [...this.layout.pages];
    
    // 3. Filter out the pages that need image generation.
    const imagePages = /* ... */;

    // 4. Concurrently generate images for the image pages using the Replicate AI.
    //    - It includes a retry mechanism in case of failure.
    const imageResults = await pMap(imagePages, /* ... */);

    // 5. Assemble the final page data.
    //    - For text pages, it adds the text content.
    //    - For image pages, it adds the path to the generated image.
    //    - If image generation failed, it adds a placeholder error message.
    for (const page of pagesToProcess) {
      // ... logic to assemble pages
    }

    // 6. Return the final layout and the generated page data.
    return { layout: this.layout, pages: allPages };
  }
}
```
We want to structure our code so that each responsibility is separated clearly. The idea is to have a dedicated class that handles all CRUD operations for a specific resource (in this case, blogs), while other concerns like validation are handled in their own classes. This keeps the code maintainable, testable, and scalable.

1. CRUD Class

Create a BlogCrud class responsible only for database interactions and transformations required for storage. It should not handle validation or other business logic.

Example methods:

createBlog(input: BlogCreateInput): BlogType

updateBlog(id: string, input: BlogUpdateInput): BlogType

deleteBlog(id: string): boolean

getBlog(id: string): BlogType | null

Each method receives input, performs the necessary Prisma or database operations, and returns the output in the expected format.

2. Validation Class

Create a separate BlogValidator class responsible for input validation. This class ensures that data coming from the frontend meets the required structure and rules.

Example methods:

validateCreate(input: unknown): BlogCreateInput

validateUpdate(input: unknown): BlogUpdateInput

By separating validation, we keep the CRUD class focused and reusable.

3. API Route Usage

The API route acts as a coordinator. The flow should be:

Receive the request.

Validate the input using BlogValidator.

Call the appropriate method in BlogCrud.

Return the result as the API response.

Example:

const input = BlogValidator.validateCreate(req.body)
const result = new BlogCrud().createBlog(input)
return res.json(result)

Why This Works

Single Responsibility: Each class does one thing—CRUD or validation—making code easier to maintain and extend.

Reusability: BlogCrud can be used in multiple contexts: API routes, background jobs, tests, etc.

Testability: Classes can be tested independently or together, which simplifies writing unit and integration tests.

Scalability: When the app grows, additional business logic can be added in separate service classes without bloating CRUD or validator classes.

Mental Model

Think of it like an assembly line:

Validator → ensures input is correct and safe.

CRUD class → handles all database operations.

API route → orchestrates validation and CRUD, and returns the response.

This pattern keeps responsibilities clear, code clean, and makes future changes easier.