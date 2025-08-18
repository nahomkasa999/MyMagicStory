"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Settings, Shield } from "lucide-react";

interface AdminNavbarProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function AdminNavbar({ user }: AdminNavbarProps) {
  return (
    <nav className="bg-background border-b">
      <div className="w-[80%] mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/Admindashboard" className="text-primary text-base font-serif font-bold flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Admin Dashboard
        </Link>
        
        <div className="flex space-x-4 font-sans text-neutral-700 text-sm">
          <Link href="/Admindashboard" className="hover:text-primary">Overview</Link>
          <Link href="/Admindashboard/createtemplate" className="hover:text-primary">Create Template</Link>
          <Link href="#" className="hover:text-primary">Users</Link>
          <Link href="#" className="hover:text-primary">Storybooks</Link>
          <Link href="#" className="hover:text-primary">Settings</Link>
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
                variant="destructive" 
                className="text-xs"
              >
                Admin
              </Badge>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}