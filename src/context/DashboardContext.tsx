"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  order: number;
}

export interface ProfileInfo {
  name: string;
  username: string;
  bio: string;
  image: string | null;
  theme: string;
}

interface DashboardContextType {
  profile: ProfileInfo;
  links: LinkItem[];
  loading: boolean;
  isSaving: boolean;
  updateProfile: (updates: Partial<ProfileInfo>) => void;
  saveProfile: (updates: Partial<ProfileInfo>) => Promise<boolean>;
  addLink: (title: string, url: string) => Promise<boolean>;
  updateLinkState: (linkId: string, updates: Partial<LinkItem>) => void;
  saveLinkUpdate: (linkId: string, updates: Partial<LinkItem>) => Promise<boolean>;
  deleteLink: (linkId: string) => Promise<boolean>;
  reorderLinks: (newLinks: LinkItem[]) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [profile, setProfile] = useState<ProfileInfo>({
    name: "",
    username: "",
    bio: "",
    image: null,
    theme: "light",
  });
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.profile.name || "",
          username: data.profile.username || "",
          bio: data.profile.bio || "",
          image: data.profile.image || null,
          theme: data.profile.theme || "light",
        });
        // Sort links by order ascending
        const sortedLinks = (data.links || []).sort((a: LinkItem, b: LinkItem) => a.order - b.order);
        setLinks(sortedLinks);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const updateProfile = (updates: Partial<ProfileInfo>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const saveProfile = async (updates: Partial<ProfileInfo>) => {
    setIsSaving(true);
    // Optimistically update
    updateProfile(updates);
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Save profile failed");
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      // Re-fetch correct data in case of error
      fetchData();
      return false;
    }
  };

  const addLink = async (title: string, url: string) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url }),
      });
      if (res.ok) {
        const newLink = await res.json();
        setLinks((prev) => [...prev, newLink].sort((a, b) => a.order - b.order));
        setIsSaving(false);
        return true;
      }
      setIsSaving(false);
      return false;
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      return false;
    }
  };

  const updateLinkState = (linkId: string, updates: Partial<LinkItem>) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === linkId ? { ...link, ...updates } : link))
    );
  };

  const saveLinkUpdate = async (linkId: string, updates: Partial<LinkItem>) => {
    setIsSaving(true);
    // Optimistically update locally
    updateLinkState(linkId, updates);
    try {
      const res = await fetch(`/api/links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update link failed");
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      fetchData(); // Rollback on error
      return false;
    }
  };

  const deleteLink = async (linkId: string) => {
    setIsSaving(true);
    // Optimistic delete
    setLinks((prev) => prev.filter((link) => link.id !== linkId));
    try {
      const res = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete link failed");
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      fetchData(); // Rollback
      return false;
    }
  };

  const reorderLinks = async (newLinks: LinkItem[]) => {
    // Set locally first
    setLinks(newLinks);
    setIsSaving(true);
    try {
      const res = await fetch("/api/links/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          linkIds: newLinks.map((l) => l.id),
        }),
      });
      if (!res.ok) throw new Error("Reorder links failed");
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      fetchData(); // Rollback
      return false;
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        profile,
        links,
        loading,
        isSaving,
        updateProfile,
        saveProfile,
        addLink,
        updateLinkState,
        saveLinkUpdate,
        deleteLink,
        reorderLinks,
        refreshData: fetchData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
