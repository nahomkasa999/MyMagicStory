.
├── .gitignore
├── .npmrc
├── .kilocode/
├── .vscode/
├── apps/
│   ├── api/
│   │   ├── .gitignore
│   │   ├── .npmrc
│   │   ├── package.json
│   │   ├── photo_gen_1.png
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   │       ├── migration_lock.toml
│   │   │       ├── 20250816083719_init/
│   │   │       │   └── migration.sql
│   │   │       └── 20250822051551_subscription/
│   │   │           └── migration.sql
│   │   ├── src/
│   │   │   ├── app.ts
│   │   │   ├── frontend.ts
│   │   │   ├── index.ts
│   │   │   ├── db/
│   │   │   │   └── index.ts
│   │   │   ├── generated/
│   │   │   │   └── prisma/
│   │   │   │       └── runtime/
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts
│   │   │   ├── routes/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── CreateStoryBook.ts
│   │   │   │   ├── pdf-preview.ts
│   │   │   │   ├── secure-image-url.ts
│   │   │   │   ├── template.ts
│   │   │   │   └── user/
│   │   │   │       ├── choiceTemplate.ts
│   │   │   │       └── storybooks.ts
│   │   │   ├── services/
│   │   │   │   └── pdf/
│   │   │   │       ├── generator.ts
│   │   │   │       ├── index.ts
│   │   │   │       ├── preview.ts
│   │   │   │       ├── README.md
│   │   │   │       └── types.ts
│   │   │   └── supabase/
│   │   │       └── client.ts
│   │   └── tools/
│   │       └── pdfjs-dist/
│   │           ├── LICENSE
│   │           ├── README.md
│   │           └── ... (omitted for brevity)
│   └── web/
│       ├── .gitignore
│       ├── middleware.ts
│       ├── next.config.ts
│       ├── package.json
│       ├── postcss.config.mjs
│       ├── public/
│       └── src/
│           ├── app/
│           │   ├── (auth)/
│           │   │   ├── layout.tsx
│           │   │   ├── _hook/
│           │   │   │   └── useAuth.ts
│           │   │   ├── forgot-password/
│           │   │   │   └── page.tsx
│           │   │   ├── reset-password/
│           │   │   │   └── page.tsx
│           │   │   ├── signin/
│           │   │   │   └── page.tsx
│           │   │   └── signup/
│           │   │       └── page.tsx
│           │   ├── (dashboard)/
│           │   │   ├── Admindashboard/
│           │   │   │   ├── layout.tsx
│           │   │   │   ├── page.tsx
│           │   │   │   └── _components/
│           │   │   │       ├── admin-dashboard-layout.tsx
│           │   │   │       ├── admin-navbar.tsx
│           │   │   │       ├── revenue-tracking.tsx
│           │   │   │       ├── storybook-statistics.tsx
│           │   │   │       └── user-statistics.tsx
│           │   │   └── dashboard/
│           │   │       ├── _components/
│           │   │       │   └── dashboard-layout.tsx
│           │   │       ├── _hooks/
│           │   │       ├── account/
│           │   │       ├── choicetemplate/
│           │   │       │   └── _hooks/
│           │   │       └── create/
│           │   │           └── [id]/
│           │   │               ├── _components/
│           │   │               └── _hooks/
│           │   ├── (landing)/
│           │   │   └── _components/
│           │   ├── check/
│           │   └── hooks/
│           ├── components/
│           │   └── ui/
│           ├── lib/
│           │   └── supabase/
│           ├── providers/
│           └── types/
├── packages/
│   ├── eslint-config/
│   ├── shared/
│   │   └── src/
│   │       └── types/
│   └── typescript-config/
└── prompts/
