"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Settings } from "lucide-react";
import { LogoutConfirmation } from './logoutComformation';

interface DashboardNavbarProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    plan: "free" | "paid";
  };
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  const planColors = {
    free: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    paid: "bg-green-100 text-green-800 hover:bg-green-200"
  };

  const planLabels = {
    free: "Free",
    paid: "Paid"
  };

  return (
    <nav className="bg-background border-b">
      <div className="w-[70%] mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-primary text-xl font-serif font-bold">
          MyMagicalStory
        </Link>
          
        <div className="flex space-x-6 font-sans text-neutral-700 text-sm">
          <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
          <Link href="/create" className="hover:text-primary">Create Story</Link>
          <Link href="#" className="hover:text-primary">Library</Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{user.name}</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${planColors[user.plan]}`}
              >
                {planLabels[user.plan]}
              </Badge>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Link href="/dashboard/account">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setShowLogoutDialog(true)}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmation
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />
    </nav>
  );
}