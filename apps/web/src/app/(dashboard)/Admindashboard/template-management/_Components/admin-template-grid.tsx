"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Eye } from "lucide-react"

export type Template = {
  id: string
  name: string
  status: "published" | "draft"
  thumbnail: string
}

const statusColors: Record<Template["status"], string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
}

export function TemplateGrid({ templates }: { templates: Template[] }) {
  return (
    <div className="w-[70%] m-auto grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="overflow-hidden hover:border-b-orange-300 transition-transform"
        >
          <div className="relative w-full" style={{ paddingTop: "120%" }}> 
            <img
              src={template.thumbnail || "https://placehold.co/400x560"}
              alt={template.name}
              className="absolute top-0 left-0 h-full w-full object-cover"
            />
            <Badge
              className={`absolute top-2 right-2 ${statusColors[template.status]} capitalize`}
              variant="secondary"
            >
              {template.status}
            </Badge>
          </div>

          <CardHeader className="flex items-center justify-between px-3 py-2">
            <CardTitle className="text-sm font-medium truncate">
              {template.name}
            </CardTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-7 w-7">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}