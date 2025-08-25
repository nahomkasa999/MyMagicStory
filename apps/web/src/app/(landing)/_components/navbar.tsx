"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "@/app/hooks/session"

export function Navbar() {
  const { user } = useSession()

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto max-w-[1080px] px-5 py-4 md:px-10 flex justify-between items-center">
        <Link href="/" className="text-primary text-2xl font-serif font-bold">
          MyMagicalStory
        </Link>

        <div className="flex space-x-8 font-sans text-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/create" className="hover:text-primary transition-colors">
            Create Story
          </Link>
          <a href="#" className="hover:text-primary transition-colors">
            Pricing
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Contact
          </a>
        </div>

        {user ? (
          <p className="text-sm text-muted-foreground">{user.email}</p>
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
  )
}
