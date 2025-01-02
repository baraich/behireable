"use client";

import { Menu } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function MobileMenu() {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-muted/50 rounded-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white border-b p-4 flex flex-col gap-4">
          <a 
            href="#how-it-works" 
            className="hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            How It Works
          </a>
          <a 
            href="#pricing" 
            className="hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </a>
          <a 
            href="#testimonials" 
            className="hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Testimonials
          </a>

          {isSignedIn ? (
            <div className="flex flex-col gap-4">
              <Link 
                href="/dashboard" 
                className="hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <SignInButton mode="modal">
                <button className="w-full text-left hover:text-primary transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-primary w-full text-center">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 