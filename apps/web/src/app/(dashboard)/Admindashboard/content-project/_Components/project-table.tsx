import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Eye, FileText, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";

export type Project = {
  id: string;
  title: string;
  user: string;
  status: "COMPLETED" | "PENDING" | "FAILED" | "DRAFT"; // Added DRAFT for completeness
  generationDate: string;
  pageCount: number;
  fileSize: string;
};

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Title</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Project ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Generation Date</TableHead>
            <TableHead>Page Count</TableHead>
            <TableHead>File Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>{project.user}</TableCell>
              <TableCell className="font-mono text-sm">{project.id}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    project.status === "COMPLETED"
                      ? "default"
                      : project.status === "PENDING"
                        ? "secondary"
                        : "destructive"
                  }
                  className={
                    project.status === "COMPLETED"
                      ? "bg-green-500 hover:bg-green-500"
                      : project.status === "PENDING"
                        ? "bg-yellow-500 hover:bg-yellow-500"
                        : project.status === "DRAFT"
                          ? "bg-blue-500 hover:bg-blue-500" // Added style for DRAFT
                          : ""
                  }
                >
                  <div className="flex items-center gap-1">
                    {project.status === "COMPLETED" && <CheckCircle className="h-3 w-3" />}
                    {project.status === "PENDING" && <Clock className="h-3 w-3" />}
                    {project.status === "FAILED" && <XCircle className="h-3 w-3" />}
                    {project.status === "DRAFT" && <FileText className="h-3 w-3" />} {/* Icon for DRAFT */}
                    {project.status}
                  </div>
                </Badge>
              </TableCell>
              <TableCell>{project.generationDate}</TableCell>
              <TableCell>{project.pageCount}</TableCell>
              <TableCell>{project.fileSize}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Download className="h-3 w-3" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Download className="h-3 w-3" />
                      Download Previews
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Eye className="h-3 w-3" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <FileText className="h-3 w-3" />
                      View Raw Data
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash2 className="h-3 w-3" />
                      Delete Project
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
