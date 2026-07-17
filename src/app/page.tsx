"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Link2,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  Palette,
  BarChart3,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [claimUsername, setClaimUsername] = useState("");

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimUsername.trim()) return;
    
    // Redirect to login page and pass the requested username
    const username = claimUsername.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "");
    router.push(`/login?username=${username}`);
  };

  const features = [
    {
      title: "Drag & Drop Link Builder",
      description: "Manage product links, social accounts, and storefront affiliate URLs. Order them instantly with fluid drag-and-drop actions.",
      icon: LayoutGrid,
      color: "text-violet-500 bg-violet-500/10 border-violet-500/25",
    },
    {
      title: "Vibrant Premium Themes",
      description: "Match your personal brand. Switch between Sleek Dark, Frosted Glassmorphism, Nordic Cream, or Sunset gradients in one click.",
      icon: Palette,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/25",
    },
    {
      title: "Real-time Traffic Tracking",
      description: "Monitor user actions silently. Access a detailed dashboard logging daily counts, link engagement bars, and visitor conversions.",
      icon: BarChart3,
      color: "text-teal-500 bg-teal-500/10 border-teal-500/25",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-650/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[650px] h-[650px] rounded-full bg-indigo-650/10 blur-[150px] pointer-events-none"></div>

      {/* Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-slate-900/60 relative z-20">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 select-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-md shadow-violet-500/20">
            <Link2 className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white font-sans tracking-wide">
            LinkInBio
          </span>
        </div>

        {/* Action Button */}
        <div>
          <Link
            href="/login"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-sm"
          >
            <span>Log In</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container Hero */}
      <main className="flex-1 flex flex-col items-center py-20 lg:py-28 relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* Left Hero Panel */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-xs text-violet-400 font-semibold select-none">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Free Link-in-Bio Landing Pages</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-sans">
              One Link for All Your <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">Socials & Shops</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Create a personalized landing page to host your affiliate links, clothing storefronts, YouTube channels, and bio. Track every visitor click in real time.
            </p>

            {/* Username Claim Bar */}
            <form onSubmit={handleClaimSubmit} className="max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-2 bg-slate-900 border border-slate-850 p-2 rounded-2xl shadow-xl">
                <div className="relative flex-1 flex items-center">
                  <span className="pl-4 pr-1 text-slate-500 font-semibold select-none text-sm">
                    linkinbio.com/
                  </span>
                  <input
                    type="text"
                    required
                    value={claimUsername}
                    onChange={(e) => setClaimUsername(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, ""))}
                    placeholder="yourname"
                    className="flex-1 bg-transparent border-none py-2 text-sm text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 sm:py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-violet-600/25"
                >
                  <span>Claim Page</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Hero Panel: Interactive Page Mockup mockup */}
          <div className="lg:col-span-5 flex justify-center relative select-none">
            {/* Background glowing frame */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-[450px] bg-gradient-to-tr from-violet-600 to-indigo-500 blur-[80px] opacity-25 rounded-full pointer-events-none"></div>
            
            {/* Phone Preview */}
            <div className="relative rotate-[2deg] hover:rotate-0 transition-transform duration-505">
              <div className="relative mx-auto w-[270px] h-[540px] bg-slate-950 rounded-[40px] p-2.5 border-[8px] border-slate-800 shadow-2xl flex flex-col overflow-hidden">
                {/* Screen content */}
                <div className="w-full h-full rounded-[26px] overflow-hidden px-4 py-8 flex flex-col items-center relative bg-gradient-to-tr from-violet-600 via-indigo-900 to-teal-800 text-white">
                  {/* Top notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4.5 w-28 bg-slate-800 rounded-b-xl"></div>
                  
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-white/20 border border-white/25 flex items-center justify-center mt-3">
                    <Sparkles className="h-6 w-6 text-teal-400" />
                  </div>
                  <h3 className="mt-3 font-extrabold text-sm tracking-tight text-white">
                    Shop My Outfits
                  </h3>
                  <span className="text-[10px] opacity-75 font-semibold">@alex_styles</span>
                  
                  <p className="mt-2 text-[10px] text-center leading-relaxed text-indigo-200 line-clamp-2 max-w-[170px]">
                    Daily clothing aesthetics & Amazon affiliate selections.
                  </p>

                  <div className="w-full flex-1 flex flex-col gap-2.5 mt-5">
                    <div className="w-full py-2.5 px-3 rounded-lg bg-white/10 border border-white/15 text-[10px] flex items-center justify-between">
                      <span>My Summer Dress (50% Off)</span>
                      <CheckCircle className="h-3.5 w-3.5 text-teal-400" />
                    </div>
                    <div className="w-full py-2.5 px-3 rounded-lg bg-white/10 border border-white/15 text-[10px] flex items-center justify-between opacity-80">
                      <span>Platform Leather Sandals</span>
                      <CheckCircle className="h-3.5 w-3.5 text-teal-400" />
                    </div>
                    <div className="w-full py-2.5 px-3 rounded-lg bg-white/10 border border-white/15 text-[10px] flex items-center justify-between opacity-60">
                      <span>Gold Chain Accessories</span>
                      <CheckCircle className="h-3.5 w-3.5 text-teal-400" />
                    </div>
                  </div>

                  <span className="text-[9px] opacity-35 mt-6 uppercase font-bold tracking-wider">
                    Powered by LinkInBio
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Features Section */}
        <section className="mt-32 lg:mt-48 w-full border-t border-slate-900/60 pt-20">
          <div className="text-center max-w-lg mx-auto space-y-3 mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Built for Modern Creators
            </h2>
            <p className="text-sm text-slate-400">
              Host your affiliate recommendations, product codes, and channels inside a unified landing page that loads instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-950/40 border border-slate-900 hover:border-slate-800 rounded-3xl p-6 shadow-md transition-all duration-200 space-y-4"
                >
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border ${feature.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900/40 py-8 text-center bg-slate-950 mt-16 relative z-10">
        <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
          © 2026 Link-in-Bio Builder. Built with Next.js, Prisma & Tailwind.
        </p>
      </footer>
    </div>
  );
}
