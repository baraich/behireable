"use client";

import { LightbulbIcon } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="container flex items-center justify-between py-6 border-b">
      <div className="flex items-center gap-2">
        <LightbulbIcon className="w-7 h-7 text-primary" />
        <span className="font-bold text-2xl">BeHireable</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm">
        <a href="#how-it-works" className="hover:text-primary transition-colors">
          How It Works
        </a>
        <a href="#pricing" className="hover:text-primary transition-colors">
          Pricing
        </a>
        <a href="#testimonials" className="hover:text-primary transition-colors">
          Testimonials
        </a>

        {isSignedIn ? (
          <div className="flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <button className="hover:text-primary transition-colors">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary">
                Get Started
              </button>
            </SignUpButton>
          </div>
        )}
      </div>

      <MobileMenu />
    </nav>
  );
} 