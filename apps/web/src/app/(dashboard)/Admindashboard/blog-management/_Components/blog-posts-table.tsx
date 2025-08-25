import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, ExternalLink, Settings, Calendar, Trash2 } from "lucide-react";

export type BlogPost = {
  id: number;
  title: string;
  author: string;
  category: string;
  status: "published" | "draft" | "scheduled";
  publishDate: string | null;
  lastUpdated: string;
};

interface BlogPostsTableProps {
  posts: BlogPost[];
}

export function BlogPostsTable({ posts }: BlogPostsTableProps) {
  return (
    <Card className="px-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Publication Date</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>{post.category}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    post.status === "published" ? "default" : post.status === "draft" ? "secondary" : "outline"
                  }
                  className={
                    post.status === "published"
                      ? "bg-green-500 hover:bg-green-500" // Added hover for consistency
                      : post.status === "scheduled"
                        ? "bg-blue-500 hover:bg-blue-500" // Added hover for consistency
                        : ""
                  }
                >
                  {post.status}
                </Badge>
              </TableCell>
              <TableCell>{post.publishDate || "Not scheduled"}</TableCell>
              <TableCell>{post.lastUpdated}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Edit className="h-3 w-3" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <ExternalLink className="h-3 w-3" />
                      View Live Post
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Settings className="h-3 w-3" />
                      Toggle Publish
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Calendar className="h-3 w-3" />
                      Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
