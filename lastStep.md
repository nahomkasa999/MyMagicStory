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

"use client"

import { useState } from "react"
import {
  BarChart3,
  FileText,
  Users,
  FolderOpen,
  DollarSign,
  Activity,
  LayoutTemplate,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Archive,
  Trash2,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const sidebarItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    id: "dashboard",
  },
  {
    title: "Template Management",
    icon: LayoutTemplate,
    id: "templates",
  },
  {
    title: "Blog Management",
    icon: FileText,
    id: "blog",
  },
  {
    title: "User Management",
    icon: Users,
    id: "users",
  },
  {
    title: "Content & Projects",
    icon: FolderOpen,
    id: "projects",
  },
  {
    title: "Financial Tracking",
    icon: DollarSign,
    id: "financial",
  },
  {
    title: "System Health",
    icon: Activity,
    id: "system",
  },
]

const mockTemplates = [
  {
    id: 1,
    name: "Adventure Story",
    status: "published",
    preview: "/adventure-story-template-preview.png",
  },
  {
    id: 2,
    name: "Fairy Tale",
    status: "draft",
    preview: "/fairy-tale-template-preview.png",
  },
  {
    id: 3,
    name: "Mystery Book",
    status: "published",
    preview: "/mystery-book-template-preview.png",
  },
  {
    id: 4,
    name: "Educational Story",
    status: "archived",
    preview: "/educational-story-template-preview.png",
  },
  {
    id: 5,
    name: "Fantasy Adventure",
    status: "published",
    preview: "/fantasy-adventure-template-preview.png",
  },
  {
    id: 6,
    name: "Science Fiction",
    status: "draft",
    preview: "/science-fiction-template-preview.png",
  },
]

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || template.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Monitor your platform's performance and key metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12.5%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8.2%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Generated</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,678</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +23.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                +5.4%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user signups and project generations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registration</p>
                <p className="text-xs text-muted-foreground">john.doe@example.com - 2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Project generated</p>
                <p className="text-xs text-muted-foreground">"My Adventure Story" - 5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Subscription upgrade</p>
                <p className="text-xs text-muted-foreground">Premium plan - 12 minutes ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">API Response Time</span>
              <Badge variant="secondary">142ms</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Status</span>
              <Badge className="bg-green-500">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage Usage</span>
              <Badge variant="outline">67% (2.1TB)</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Jobs</span>
              <Badge variant="secondary">3 pending</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderTemplateManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage your story templates</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Status: {statusFilter === "all" ? "All" : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Templates</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("published")}>Published</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("draft")}>Draft</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("archived")}>Archived</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredTemplates.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <LayoutTemplate className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground text-center mb-6">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first template"}
          </p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Template
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-video bg-muted">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={`${template.name} preview`}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge
                    variant={
                      template.status === "published"
                        ? "default"
                        : template.status === "draft"
                          ? "secondary"
                          : "outline"
                    }
                    className={
                      template.status === "published"
                        ? "bg-green-500"
                        : template.status === "draft"
                          ? "bg-yellow-500"
                          : ""
                    }
                  >
                    {template.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <Eye className="h-3 w-3" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Copy className="h-3 w-3" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Archive className="h-3 w-3" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderPlaceholderSection = (title: string, description: string) => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Card className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
        <p className="text-muted-foreground text-center">
          This section is under development and will be available soon.
        </p>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboardOverview()
      case "templates":
        return renderTemplateManagement()
      case "blog":
        return renderPlaceholderSection("Blog Management", "Create, publish, and manage your blog content")
      case "users":
        return renderPlaceholderSection("User Management", "Manage user accounts and subscriptions")
      case "projects":
        return renderPlaceholderSection("Content & Projects", "View and manage generated projects")
      case "financial":
        return renderPlaceholderSection("Financial Tracking", "Monitor costs and revenue analytics")
      case "system":
        return renderPlaceholderSection("System Health", "Monitor system performance and logs")
      default:
        return renderDashboardOverview()
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutTemplate className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Admin Dashboard</span>
                <span className="text-xs text-muted-foreground">Story Platform</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeSection === item.id}
                        onClick={() => setActiveSection(item.id)}
                        className="w-full"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <span className="text-xs font-medium">AD</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Admin User</span>
                <span className="text-xs text-muted-foreground">admin@platform.com</span>
              </div>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Admin Dashboard</span>
              <span>/</span>
              <span className="text-foreground">
                {sidebarItems.find((item) => item.id === activeSection)?.title || "Dashboard"}
              </span>
            </div>
          </header>
          <main className="flex-1 p-6">{renderContent()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
