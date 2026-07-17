import React from "react";
import Link from "next/link";
import { Link2, AlertTriangle, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-between px-4 py-16 relative overflow-hidden text-slate-100">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-650/5 blur-[120px] pointer-events-none"></div>

      {/* Brand logo at top */}
      <div className="flex items-center gap-2 select-none opacity-80">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600">
          <Link2 className="h-4 w-4 text-white" />
        </div>
        <span className="font-extrabold text-sm tracking-wide text-white">
          LinkInBio
        </span>
      </div>

      {/* Main 404 Card */}
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6 relative z-10">
        <div className="h-16 w-16 bg-red-950/40 border border-red-900/30 text-red-500 rounded-3xl flex items-center justify-center shadow-lg shadow-red-950/20">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-450 leading-relaxed max-w-sm">
            The Link-in-Bio username you are trying to visit does not exist or has been modified.
          </p>
        </div>

        <div className="pt-2 w-full">
          <Link
            href="/login"
            className="w-full py-3.5 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10 hover:shadow-violet-500/25 transition-all duration-200"
          >
            <span>Claim Your Username</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Footer copyright */}
      <p className="text-[10px] text-slate-600 font-semibold select-none uppercase tracking-wider">
        © 2026 Link-in-Bio Builder
      </p>
    </div>
  );
}
