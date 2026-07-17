"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { User, Palette, Image as ImageIcon, AlertCircle, Check, Loader2 } from "lucide-react";

export default function AppearancePage() {
  const { profile, saveProfile, loading } = useDashboard();

  // Form states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setUsername(profile.username);
      setBio(profile.bio);
    }
  }, [profile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    if (!username.trim()) {
      setError("Username is required.");
      setSaving(false);
      return;
    }

    const success = await saveProfile({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      bio: bio.trim(),
    });

    setSaving(false);
    if (success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError("Username is already taken or invalid characters used.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit base64 saving to < 1.5MB to avoid large database transactions)
    if (file.size > 1.5 * 1024 * 1024) {
      setError("Image must be smaller than 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setSaving(true);
      const success = await saveProfile({ image: base64String });
      setSaving(false);
      if (success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Failed to update profile picture.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    setSaving(true);
    const success = await saveProfile({ image: null });
    setSaving(false);
    if (success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError("Failed to remove profile picture.");
    }
  };

  const themes = [
    {
      id: "light",
      name: "Nordic Light",
      background: "bg-slate-50 border-slate-200",
      preview: "bg-white border border-slate-200 text-slate-900",
      indicator: "bg-slate-900",
    },
    {
      id: "dark",
      name: "Sleek Dark",
      background: "bg-slate-950 border-slate-800",
      preview: "bg-slate-900 border border-slate-800 text-white",
      indicator: "bg-white",
    },
    {
      id: "glass",
      name: "Glassmorphism",
      background: "bg-gradient-to-tr from-violet-600 via-indigo-900 to-teal-800 border-indigo-700",
      preview: "bg-white/10 border border-white/20 text-white backdrop-blur-sm",
      indicator: "bg-teal-400",
    },
    {
      id: "sunset",
      name: "Sunset Vibes",
      background: "bg-gradient-to-br from-amber-500 via-rose-600 to-purple-800 border-rose-600",
      preview: "bg-black/20 border border-white/10 text-white backdrop-blur-sm",
      indicator: "bg-amber-400",
    },
  ];

  const handleSelectTheme = async (themeId: string) => {
    await saveProfile({ theme: themeId });
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
          <p className="text-sm text-slate-400 font-medium">Loading appearance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Appearance settings</span>
          <Palette className="h-5 w-5 text-violet-500" />
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Customize your bio, upload a profile photo, and select one of our premium themes.
        </p>
      </div>

      {/* Form Status Messages */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl bg-red-950/40 border border-red-900/30 px-4 py-3 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/30 px-4 py-3 text-xs text-emerald-450">
          <Check className="h-4 w-4 shrink-0" />
          <span>Changes saved successfully!</span>
        </div>
      )}

      {/* Profile Info Form */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-semibold text-slate-300 block">Profile Information</h3>

        {/* Profile Avatar Upload Container */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {profile.image ? (
            <img
              src={profile.image}
              alt="Avatar Preview"
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-700 shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center">
              <User className="h-10 w-10 text-slate-600" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {/* Real Input File Hidden */}
            <label className="flex items-center gap-2 px-4 py-2.5 bg-violet-650 hover:bg-violet-600 text-white font-semibold text-xs rounded-xl cursor-pointer transition-colors shadow-md shadow-violet-600/10">
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {profile.image && (
              <button
                onClick={handleRemoveImage}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Remove
              </button>
            )}

            <p className="text-[11px] text-slate-500 w-full mt-1 sm:w-auto sm:mt-0">
              JPG, PNG under 1.5MB. Auto-optimized.
            </p>
          </div>
        </div>

        {/* Text Fields */}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-450 uppercase tracking-wider block">
                Profile Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-450 uppercase tracking-wider block">
                Profile Username URL
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-600 font-semibold select-none">
                  @
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                  placeholder="username"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-450 uppercase tracking-wider block">
              Bio Description
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={3}
              placeholder="Tell visitors about yourself or your affiliate store..."
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
            />
            <div className="flex justify-end">
              <span className="text-[10px] text-slate-650 font-medium">
                {bio.length}/160 characters
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-white font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>Save Profile Information</span>
            )}
          </button>
        </form>
      </div>

      {/* Themes Selector grid */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-300 block">Select Profile Theme</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            This theme applies instantly to your live URL page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themes.map((theme) => {
            const isSelected = profile.theme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme.id)}
                className={`relative flex flex-col items-center justify-between p-4 rounded-2xl border text-left transition-all overflow-hidden h-40 cursor-pointer ${
                  isSelected
                    ? "border-violet-500 ring-2 ring-violet-500/20"
                    : "border-slate-800 hover:border-slate-700 bg-slate-900/40"
                }`}
              >
                {/* Mock Card Preview Background wrapper */}
                <div className={`absolute inset-0 z-0 p-3 flex flex-col justify-between items-center ${theme.background}`}>
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center bg-white/20 select-none">
                    <span className="text-[9px] font-bold">A</span>
                  </div>
                  <div className="space-y-1.5 w-full flex flex-col items-center">
                    <div className={`w-3/4 py-1.5 rounded-lg text-[8px] flex items-center justify-center ${theme.preview}`}>
                      Link Card
                    </div>
                    <div className={`w-3/4 py-1.5 rounded-lg text-[8px] flex items-center justify-center ${theme.preview}`}>
                      Link Card
                    </div>
                  </div>
                  <div className={`h-1.5 w-6 rounded-full opacity-60 ${theme.indicator}`}></div>
                </div>

                {/* Cover indicator */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <div
                    className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "bg-black/30 border-white/25 text-transparent"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                </div>

                <div className="absolute bottom-2.5 left-3.5 z-10 drop-shadow-md">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {theme.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
