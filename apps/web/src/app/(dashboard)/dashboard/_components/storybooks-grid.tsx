"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MoreHorizontal, Eye, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface Storybook {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  createdAt: string;
  status: "completed" | "draft" | "processing";
  pageCount: number;
}

interface StorybooksGridProps {
  storybooks: Storybook[];
}

export function StorybooksGrid({ storybooks }: StorybooksGridProps) {
  const statusColors = {
    completed: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800"
  };

  const statusLabels = {
    completed: "Completed",
    draft: "Draft",
    processing: "Processing"
  };

  if (storybooks.length === 0) {
    return (
      <Card className="p-4 text-center">
        <div className="flex flex-col items-center space-y-2">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-semibold">No storybooks yet</h3>
            <p className="text-xs text-muted-foreground">Create your first magical storybook to get started!</p>
          </div>
          <Button size="sm" className="h-6 text-xs">Create Storybook</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {storybooks.map((storybook) => (
        <Card key={storybook.id} className="group hover:shadow-sm transition-shadow duration-200">
          {/* Header with Title, Status, and Three-dot Menu */}
          <CardHeader className="p-2 pb-1">
            <div className="flex items-start justify-between gap-1">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm line-clamp-2 leading-tight mb-1">
                  {storybook.title}
                </CardTitle>
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-1 py-0 h-4 ${statusColors[storybook.status]}`}
                >
                  {statusLabels[storybook.status]}
                </Badge>
              </div>
              
              {/* Three-dot Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem className="text-xs">
                    <Eye className="h-3 w-3 mr-2" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs">
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          {/* Content with Image */}
          <CardContent className="p-2 pt-0">
            <div className="aspect-[4/3] bg-muted rounded-sm overflow-hidden">
              {storybook.coverImage ? (
                <Image
                  src={storybook.coverImage}
                  alt={storybook.title}
                  width={150}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}