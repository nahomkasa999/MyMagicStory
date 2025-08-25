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
import { MoreVertical, Pencil, Eye, Loader2 } from "lucide-react" 
import { useRouter } from 'next/navigation'; 
import { useTemplates } from "../_hooks/useTemplateStorybook"
import { toast } from 'sonner'; 
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type Template = {
  id: string
  title: string
  coverImageUrl: string
  layoutJson: any
  createdAt: string
  updatedAt: string
}

export function TemplateGrid({ templates }: { templates: Template[] }) {
  const router = useRouter(); 
  const { deleteTemplate, isDeleting } = useTemplates(); 

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [templateToDeleteId, setTemplateToDeleteId] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    router.push(`/Admindashboard/template-management/${id}`); 
  };

  // Function to open the confirmation dialog
  const confirmDelete = (templateId: string) => {
    setTemplateToDeleteId(templateId);
    setShowConfirmDialog(true);
  };

  const executeDelete = () => {
    if (templateToDeleteId) {
      deleteTemplate(templateToDeleteId);
      setTemplateToDeleteId(null); // Clear the ID after deletion attempt
      setShowConfirmDialog(false); // Close the dialog
    }
  };

  return (
    <div className="w-[70%] m-auto grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="overflow-hidden hover:border-b-orange-300 transition-transform cursor-pointer" 
          onClick={() => handleCardClick(template.id)} 
        >
          <div className="relative w-full" style={{ paddingTop: "120%" }}> 
            <img
              src={template.coverImageUrl || "https://placehold.co/400x560"}
              alt={template.title} 
              className="absolute top-0 left-0 h-full w-full object-cover"
            />
          </div>

          <CardHeader className="flex items-center justify-between px-3 py-2">
            <CardTitle className="text-sm font-medium truncate">
              {template.title}
            </CardTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7" 
                  onClick={(e) => e.stopPropagation()} 
                  disabled={isDeleting} 
                >
                  {isDeleting && templateToDeleteId === template.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreVertical className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-red-600" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    confirmDelete(template.id); // Call confirmDelete to open the dialog
                  }}
                  disabled={isDeleting} 
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
        </Card>
      ))}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              template and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeDelete} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
