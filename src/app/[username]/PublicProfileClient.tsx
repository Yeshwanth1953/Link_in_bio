"use client";

import React from "react";
import { THEME_STYLES } from "@/components/PhonePreview";
import { User, ExternalLink, Link2 } from "lucide-react";

interface PublicProfileClientProps {
  profile: {
    name: string;
    username: string;
    bio: string;
    image: string | null;
    theme: string;
  };
  links: Array<{
    id: string;
    title: string;
    url: string;
  }>;
}

export default function PublicProfileClient({ profile, links }: PublicProfileClientProps) {
  const activeTheme = THEME_STYLES[profile.theme] || THEME_STYLES.light;

  const handleLinkClick = async (linkId: string) => {
    try {
      // Fire-and-forget background click record
      fetch("/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId }),
      });
    } catch (error) {
      console.error("Failed to log click analytics:", error);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between px-4 py-16 transition-all duration-300 relative overflow-x-hidden ${activeTheme.background} ${activeTheme.container}`}
    >
      {/* Centered Profile Card */}
      <div className="w-full max-w-md flex flex-col items-center flex-1">
        {/* Profile Avatar details */}
        <div className="flex flex-col items-center text-center mb-8">
          {profile.image ? (
            <img
              src={profile.image}
              alt={profile.name || "Avatar"}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 border-4 border-white/10 flex items-center justify-center shadow-lg">
              <User className="h-10 w-10 text-white" />
            </div>
          )}

          <h1 className={`mt-4 text-xl tracking-tight ${activeTheme.text}`}>
            {profile.name || `@${profile.username}`}
          </h1>
          
          {profile.name && (
            <span className="text-xs font-semibold opacity-75 mt-0.5 block">
              @{profile.username}
            </span>
          )}

          {profile.bio && (
            <p className="mt-3 text-sm leading-relaxed max-w-xs opacity-90">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Buttons List Container */}
        <div className="w-full space-y-4">
          {links.length > 0 ? (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                className={`w-full py-4 px-6 rounded-2xl flex items-center justify-between transition-all duration-200 text-center shadow-sm border ${activeTheme.button} ${activeTheme.buttonHover} group`}
              >
                <div className="w-5 h-5"></div> {/* Visual spacer */}
                <span className={`text-sm truncate font-medium ${activeTheme.buttonText}`}>
                  {link.title}
                </span>
                <ExternalLink className="w-4 h-4 opacity-40 shrink-0 group-hover:opacity-85 transition-opacity" />
              </a>
            ))
          ) : (
            <div className="text-center py-12 opacity-50 italic text-sm">
              This profile has no active links.
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="mt-16 flex items-center gap-1.5 opacity-35 text-[11px] font-semibold select-none">
        <Link2 className="h-3.5 w-3.5" />
        <span className="tracking-wide uppercase">Powered by Link-in-Bio</span>
      </footer>
    </div>
  );
}
