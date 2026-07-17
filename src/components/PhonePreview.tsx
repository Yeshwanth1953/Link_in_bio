import React from "react";
import { LinkItem, ProfileInfo } from "@/context/DashboardContext";
import { ExternalLink, User } from "lucide-react";

interface PhonePreviewProps {
  profile: ProfileInfo;
  links: LinkItem[];
}

export const THEME_STYLES: {
  [key: string]: {
    background: string;
    container: string;
    text: string;
    bioText: string;
    button: string;
    buttonHover: string;
    buttonText: string;
  };
} = {
  light: {
    background: "bg-slate-50",
    container: "text-slate-900",
    text: "text-slate-900 font-bold",
    bioText: "text-slate-500",
    button: "bg-white border border-slate-200 text-slate-800 shadow-sm",
    buttonHover: "hover:bg-slate-50 hover:shadow",
    buttonText: "text-slate-800 font-medium",
  },
  dark: {
    background: "bg-slate-950",
    container: "text-white",
    text: "text-white font-bold",
    bioText: "text-slate-400",
    button: "bg-slate-900 border border-slate-800 text-slate-100 shadow-md",
    buttonHover: "hover:border-violet-500/50 hover:bg-slate-850",
    buttonText: "text-slate-100 font-medium",
  },
  glass: {
    background: "bg-gradient-to-tr from-violet-600 via-indigo-900 to-teal-800",
    container: "text-white",
    text: "text-white font-extrabold shadow-sm",
    bioText: "text-indigo-200",
    button: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg",
    buttonHover: "hover:bg-white/20 hover:border-white/30",
    buttonText: "text-white font-semibold",
  },
  sunset: {
    background: "bg-gradient-to-br from-amber-500 via-rose-600 to-purple-800",
    container: "text-white",
    text: "text-white font-extrabold",
    bioText: "text-rose-100",
    button: "bg-black/20 border border-white/10 text-white backdrop-blur-sm shadow-md",
    buttonHover: "hover:bg-black/30 hover:border-white/25",
    buttonText: "text-white font-medium",
  },
};

export default function PhonePreview({ profile, links }: PhonePreviewProps) {
  const activeTheme = THEME_STYLES[profile.theme] || THEME_STYLES.light;
  const activeLinks = links.filter((link) => link.isActive);

  return (
    <div className="relative mx-auto w-[290px] h-[580px] bg-slate-950 rounded-[40px] p-3 border-[10px] border-slate-800 shadow-2xl flex flex-col overflow-hidden">
      {/* Speaker and Camera Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-800 rounded-b-xl z-20 flex items-center justify-center">
        <span className="h-1.5 w-10 bg-slate-700 rounded-full"></span>
      </div>

      {/* Screen Container */}
      <div
        className={`w-full h-full rounded-[28px] overflow-y-auto px-4 py-8 flex flex-col items-center select-none relative ${activeTheme.background} ${activeTheme.container} scrollbar-none`}
      >
        {/* Profile Details */}
        <div className="flex flex-col items-center text-center mt-4 mb-6 w-full">
          {profile.image ? (
            <img
              src={profile.image}
              alt={profile.name || "Avatar"}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-md pointer-events-none"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center border-2 border-white/20 shadow-md">
              <User className="h-7 w-7 text-white" />
            </div>
          )}

          <h3 className={`mt-3 text-base tracking-tight truncate max-w-full ${activeTheme.text}`}>
            {profile.name || `@${profile.username || "username"}`}
          </h3>
          
          {profile.username && profile.name && (
            <span className={`text-[11px] font-semibold opacity-75`}>
              @{profile.username}
            </span>
          )}

          {profile.bio && (
            <p className={`mt-2 text-xs line-clamp-3 leading-relaxed max-w-[200px] ${activeTheme.bioText}`}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links List */}
        <div className="w-full flex-1 flex flex-col gap-3">
          {activeLinks.length > 0 ? (
            activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.preventDefault()} // Block clicks inside preview
                className={`w-full py-3 px-4 rounded-xl flex items-center justify-between transition-all duration-200 text-center ${activeTheme.button} ${activeTheme.buttonHover} pointer-events-none`}
              >
                <div className="w-4 h-4"></div> {/* Spacer for symmetry */}
                <span className={`text-xs truncate ${activeTheme.buttonText}`}>{link.title}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-40 shrink-0" />
              </a>
            ))
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <p className="text-xs opacity-40 italic">No links added yet</p>
            </div>
          )}
        </div>

        {/* Footer Brand */}
        <div className="mt-8 flex items-center gap-1.5 opacity-45 text-[10px]">
          <span className="font-bold tracking-tight">LINK-IN-BIO</span>
        </div>
      </div>
    </div>
  );
}
