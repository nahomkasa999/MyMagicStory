"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserAccountHeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    plan: "free" | "paid";
  };
}

export function UserAccountHeader({ user }: UserAccountHeaderProps) {
  const planColors = {
    free: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    paid: "bg-green-100 text-green-800 hover:bg-green-200"
  };

  const planLabels = {
    free: "Free",
    paid: "Paid"
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-semibold">{user.name}</h2>
                <Badge
                  variant="secondary"
                  className={`text-xs ${planColors[user.plan]}`}
                >
                  {planLabels[user.plan]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}