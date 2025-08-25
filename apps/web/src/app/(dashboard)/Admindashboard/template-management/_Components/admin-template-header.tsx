"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Removed DropdownMenu imports as status filter is removed
import { Search, Plus } from "lucide-react" // Removed Filter icon

interface TemplateManagementHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Removed statusFilter and setStatusFilter props
  onCreateTemplate: () => void;
}

export function TemplateManagementHeader({
  searchQuery,
  setSearchQuery,
  // Removed statusFilter, setStatusFilter from destructuring
  onCreateTemplate
}: TemplateManagementHeaderProps) {
  return (
    <div className="space-y-6 w-[70%] m-auto mb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Management</h1>
          <p className="text-muted-foreground">Create, edit, and manage your story templates</p>
        </div>
        <Button className="gap-2" onClick={onCreateTemplate}>
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* Removed DropdownMenu for status filtering */}
      </div>
    </div>
  )
}
