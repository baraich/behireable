"use client";

import { LightbulbIcon, LayoutDashboard, FileText, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Resumes",
    href: "#",
    icon: FileText,
    disabled: true,
    description: "Coming soon"
  }
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-800 text-white rounded-md shadow-lg border border-zinc-700"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        transform lg:transform-none transition-transform duration-200
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            <LightbulbIcon className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl text-white">BeHireable</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg
                      transition-colors
                      ${item.disabled ? 'cursor-not-allowed' : ''}
                      ${isActive 
                        ? 'bg-primary text-white' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }
                    `}
                    onClick={e => item.disabled && e.preventDefault()}
                  >
                    <item.icon className={`w-5 h-5 ${item.disabled ? 'opacity-40' : ''}`} />
                    <div className={item.disabled ? 'opacity-40' : ''}>
                      <div>{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-zinc-500">{item.description}</div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
} 