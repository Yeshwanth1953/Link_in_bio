"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Link2,
  LayoutGrid,
  Palette,
  BarChart3,
  LogOut,
  Copy,
  Check,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import PhonePreview from "@/components/PhonePreview";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { profile, links, isSaving } = useDashboard();

  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth guard: Redirect if unauthenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
          <p className="text-slate-400 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${profile.username || ""}`
    : `/${profile.username || ""}`;

  const copyToClipboard = () => {
    if (!profile.username) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { name: "Links", href: "/dashboard", icon: LayoutGrid },
    { name: "Appearance", href: "/dashboard/appearance", icon: Palette },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-slate-950 border-r border-slate-800 p-6">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-md shadow-violet-500/20">
            <Link2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white font-sans tracking-wide">
            LinkInBio
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-violet-600/10 border border-violet-500/20 text-violet-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile & LogOut */}
        <div className="border-t border-slate-800 pt-6 mt-6 space-y-4">
          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover border border-slate-700"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate text-white">{session?.user?.name}</p>
              <p className="text-xs text-slate-500 truncate">@{profile.username || "loading"}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300 font-semibold rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Navigation - Mobile and Shared status */}
        <header className="bg-slate-950/40 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 md:gap-0">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 md:hidden text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg transition-all"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Title / Save status */}
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-white hidden md:block">
                Dashboard
              </h1>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700 text-[10px] text-slate-400">
                <span className={`h-1.5 w-1.5 rounded-full ${isSaving ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`}></span>
                <span>{isSaving ? "Saving..." : "Saved"}</span>
              </div>
            </div>
          </div>

          {/* Copy URL header action */}
          {profile.username && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden lg:inline max-w-48 truncate bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                {publicUrl}
              </span>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-all shadow-md shadow-violet-500/20"
                title="View Public Profile"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </header>

        {/* Sub-panels layout: Form editor on left, Live iPhone preview on right */}
        <main className="flex-1 flex overflow-hidden">
          {/* Scrollable form view */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
            {children}
          </div>

          {/* iPhone mock preview frame */}
          <div className="hidden xl:flex w-[380px] shrink-0 border-l border-slate-800/80 bg-slate-950/20 items-center justify-center p-6 select-none">
            <div className="sticky top-8">
              <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                Real-Time Preview
              </p>
              <PhonePreview profile={profile} links={links} />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar overlay Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop click-away */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer card */}
          <aside className="relative flex flex-col w-64 bg-slate-950 border-r border-slate-800 p-6 z-10">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Brand */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-md shadow-violet-500/20">
                <Link2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white font-sans tracking-wide">
                LinkInBio
              </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive
                        ? "bg-violet-600/10 border border-violet-500/20 text-violet-400"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User */}
            <div className="border-t border-slate-800 pt-6 mt-6 space-y-4">
              <div className="flex items-center gap-3">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover border border-slate-700"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate text-white">{session?.user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">@{profile.username || "loading"}</p>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300 font-semibold rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}
