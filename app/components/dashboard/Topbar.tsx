"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function DashboardTopbar() {
  const pathname = usePathname();
  
  // Function to get the current page title
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/dashboard/resumes") return "My Resumes";
    return "Dashboard";
  };

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-4">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "bg-zinc-900 border border-zinc-800",
              userButtonPopoverActionButton: "hover:bg-zinc-800",
              userButtonPopoverActionButtonText: "text-zinc-300",
              userButtonPopoverFooter: "hidden"
            }
          }}
        />
      </div>
    </header>
  );
} 