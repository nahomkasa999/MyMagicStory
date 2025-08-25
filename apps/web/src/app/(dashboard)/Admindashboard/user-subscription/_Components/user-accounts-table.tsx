import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Settings, Edit, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type UserAccount = {
  id: number;
  email: string;
  name: string;
  plan: "Pro" | "Starter" | "Free" | "Cancelled" | "Trialing" | "Suspended"; // Added more plan types based on filter
  status: "Active" | "Suspended" | "Inactive"; // Added Inactive for completeness
  signupDate: string;
  lastActivity: string;
  projectsUsed: number;
  projectsLimit: number;
};

interface UserAccountsTableProps {
  users: UserAccount[];
}

export function UserAccountsTable({ users }: UserAccountsTableProps) {
  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Subscription Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sign-up Date</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead>Projects Used</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.email}</div>
                    <div className="text-sm text-muted-foreground">{user.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{user.plan}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.status === "Active" ? "default" : "destructive"}
                  className={user.status === "Active" ? "bg-green-500 hover:bg-green-500" : (user.status === "Suspended" ? "bg-red-500 hover:bg-red-500" : "")}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{user.signupDate}</TableCell>
              <TableCell>{user.lastActivity}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {user.projectsUsed}/{user.projectsLimit}
                  </span>
                  <Progress value={(user.projectsUsed / user.projectsLimit) * 100} className="w-16 h-2" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Eye className="h-3 w-3" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Settings className="h-3 w-3" />
                      {user.status === "Suspended" ? "Activate Account" : "Suspend Account"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Edit className="h-3 w-3" />
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Plus className="h-3 w-3" />
                      Adjust Quota
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
