import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BlogManagementHeaderProps {
  onCreatePost: () => void;
}

export function BlogManagementHeader({ onCreatePost }: BlogManagementHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
        <p className="text-muted-foreground">Create, publish, and manage your blog content</p>
      </div>
      <Button className="gap-2" onClick={onCreatePost}>
        <Plus className="h-4 w-4" />
        Create New Post
      </Button>
    </div>
  );
}
