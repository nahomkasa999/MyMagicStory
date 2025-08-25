# My Magic Story

My Magic Story is a web application that allows users to create, customize, and purchase personalized storybooks. It features a user-friendly interface for designing books, a secure payment system, and an administrative dashboard for managing content and users.

## Features

-   **User Authentication:** Secure sign-up and sign-in functionality.
-   **Storybook Creation:** A step-by-step process to create personalized storybooks with custom text and images.
-   **Template Selection:** A variety of templates for users to choose from.
-   **PDF Generation:** On-the-fly PDF generation for storybook previews and final products.
-   **Payment Integration:** Secure payment processing using Stripe.
-   **Admin Dashboard:** A comprehensive dashboard for administrators to manage templates, users, and content.

## Folder Structure

The project is a monorepo managed by Turborepo, containing the frontend and backend applications.

```
.
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   └── schema.prisma  # Database schema for Prisma ORM.
│   │   ├── src/
│   │   │   ├── db/
│   │   │   │   └── index.ts  # Database client initialization.
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts  # Authentication middleware.
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts  # Authentication routes.
│   │   │   │   ├── CreateStoryBook.ts  # Route for creating storybooks.
│   │   │   │   ├── payment/  # Stripe payment routes.
│   │   │   │   ├── projectspdf.ts # Routes for handling project PDFs
│   │   │   │   ├── secure-image-url.ts # Routes for generating secure image URLs
│   │   │   │   ├── template.ts # Routes for managing templates
│   │   │   │   └── user.ts # User-related routes
│   │   │   ├── services/
│   │   │   │   ├── pdf/  # PDF generation services.
│   │   │   │   └── utility.ts # Utility functions
│   │   │   ├── supabase/
│   │   │   │   └── client.ts  # Supabase client initialization.
│   │   │   ├── app.ts  # Main application file (Hono).
│   │   │   ├── frontend.ts # Frontend-specific API routes
│   │   │   └── index.ts  # Server entry point.
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/
│       ├── public/  # Static assets.
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/  # Authentication pages (signin, signup).
│       │   │   ├── (dashboard)/  # User and admin dashboard pages.
│       │   │   ├── (landing)/  # Landing page.
│       │   │   ├── layout.tsx  # Root layout.
│       │   │   └── page.tsx  # Root page.
│       │   ├── components/
│       │   │   └── ui/  # UI components (buttons, cards, etc.).
│       │   ├── hooks/  # Custom React hooks.
│       │   ├── lib/
│       │   │   ├── supabase/
│       │   │   │   └── supabaseClient.ts  # Supabase client for the frontend.
│       │   │   └── utils.ts  # Utility functions.
│       │   └── providers/  # React context providers.
│       ├── middleware.ts  # Next.js middleware.
│       ├── next.config.ts  # Next.js configuration.
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── eslint-config/  # Shared ESLint configurations.
│   ├── shared/  # Shared types and schemas between apps.
│   └── typescript-config/  # Shared TypeScript configurations.
├── prompts/ # Prompts for AI models
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── turbo.json
```

## Supabase Setup

This project uses Supabase for database and storage.

### Storage Bucket

You need to create a Supabase storage bucket to handle file uploads.

1.  Go to your Supabase project dashboard.
2.  Navigate to the "Storage" section.
3.  Click "New bucket".
4.  Enter the bucket name: `storybook-pdfs`
5.  Set the bucket to be **public**.
6.  Create the bucket.

you also need privet buckts called storybook-previews, storybook-images, storybook-finals

## Environment Variables

You need to set up environment variables for both the frontend and backend.

### Backend (`apps/api/.env`)

```
DATABASE_URL="your-supabase-database-url"
DIRECT_URL="your-supabase-direct-url"
SUPABASE_URL="your-supabase-project-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
GEMINI_API_KEY="your-google-gemini-api-key"
REPLICATE_API_TOKEN="your-replicate-api-token"
CLOUDINARY_URL="your-cloudinary-url"
```

### Frontend (`apps/web/.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [pnpm](https://pnpm.io/)

### Installation

1.  Clone the repository:
    ```sh
    git clone git@github.com:walidboulanouar/MyMagicalStory.git
    cd my-magic-story
    ```

2.  Install dependencies:
    ```sh
    pnpm install
    ```

### Running the Development Servers

To start the development servers for both the frontend and backend, run the following command from the root of the project:

```sh
pnpm dev
```

-   The frontend will be available at `http://localhost:3000`.
-   The backend will be available at `http://localhost:3001`.

### Building the Project

To build all apps and packages, run the following command:

```sh
pnpm build
