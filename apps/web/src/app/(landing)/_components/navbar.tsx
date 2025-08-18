"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/hooks/session";

export function Navbar() {
  const { user } = useSession();

  return (
    <nav className="bg-background border-b-2">
      
      <div className="container mx-auto max-w-[1080px] px-5 py-4 md:px-10 flex justify-between items-center">
        <Link href="/" className="text-primary text-2xl font-serif font-bold">
          MyMagicalStory
        </Link>

        <div className="flex space-x-8 font-sans text-neutral-700">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/create" className="hover:text-primary">
            Create Story
          </Link>
          <a href="#" className="hover:text-primary">
            Pricing
          </a>
          <a href="#" className="hover:text-primary">
            Contact
          </a>
        </div>

        {user ? (
          <p className="text-sm text-neutral-600">{user.email}</p>
        ) : (
          <div className="flex space-x-4">
            <Link href="/signin">
              <Button>Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
    

  );
}
