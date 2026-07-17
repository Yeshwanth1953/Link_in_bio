"use client";

import React, { useState } from "react";
import { useDashboard, LinkItem } from "@/context/DashboardContext";
import {
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  GripVertical,
  Link as LinkIcon,
  Sparkles,
  Edit2,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Item Component
function SortableLinkRow({
  link,
  onDelete,
  onUpdate,
}: {
  link: LinkItem;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<LinkItem>) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : "auto",
  };

  const handleSave = () => {
    let cleanUrl = editUrl.trim();
    if (cleanUrl && !/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
      setEditUrl(cleanUrl);
    }
    
    onUpdate(link.id, { title: editTitle, url: cleanUrl });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(link.title);
    setEditUrl(link.url);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-4 bg-slate-900 border ${
        isDragging
          ? "border-violet-500 bg-slate-850/80 shadow-2xl"
          : "border-slate-800 hover:border-slate-700 shadow-md"
      } rounded-2xl p-4 transition-colors duration-150`}
    >
      {/* Drag Grip Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-850 rounded-lg text-slate-500 hover:text-slate-350 transition-colors"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Main Link Metadata Edit Panel */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Link Title"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleSave}
                className="px-2.5 py-1 bg-violet-650 hover:bg-violet-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white text-sm truncate max-w-xs sm:max-w-md">
                {link.title}
              </h4>
              <button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-850 rounded text-slate-400 hover:text-white transition-all duration-150"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
              {link.url}
            </p>
          </div>
        )}
      </div>

      {/* Active Toggle & Delete */}
      <div className="flex items-center gap-2">
        {/* Active Toggle Button */}
        <button
          onClick={() => onUpdate(link.id, { isActive: !link.isActive })}
          className={`p-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
            link.isActive
              ? "text-violet-500 hover:text-violet-400"
              : "text-slate-650 hover:text-slate-500"
          }`}
          title={link.isActive ? "Deactivate Link" : "Activate Link"}
        >
          {link.isActive ? (
            <ToggleRight className="h-8 w-8" />
          ) : (
            <ToggleLeft className="h-8 w-8" />
          )}
        </button>

        {/* Delete Link Button */}
        <button
          onClick={() => onDelete(link.id)}
          className="p-2 bg-slate-950 border border-slate-850 hover:bg-red-950/20 hover:border-red-900/40 text-slate-500 hover:text-red-400 rounded-xl transition-all cursor-pointer"
          title="Delete Link"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function DashboardLinksPage() {
  const { links, addLink, saveLinkUpdate, deleteLink, reorderLinks, loading } = useDashboard();

  // Add Link form state
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // Setup DND Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid registers on simple clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newTitle.trim() || !newUrl.trim()) {
      setFormError("Both Title and URL are required.");
      return;
    }

    // URL formatting check
    let cleanUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    setAdding(true);
    const success = await addLink(newTitle.trim(), cleanUrl);
    setAdding(false);

    if (success) {
      setNewTitle("");
      setNewUrl("");
    } else {
      setFormError("Failed to add link. Please try again.");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id);
      const newIndex = links.findIndex((item) => item.id === over.id);
      
      const newOrderedLinks = arrayMove(links, oldIndex, newIndex);
      // Run the optimistic database update
      await reorderLinks(newOrderedLinks);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
          <p className="text-sm text-slate-400 font-medium">Loading links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header text */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Manage Links</span>
          <Sparkles className="h-5 w-5 text-violet-500" />
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Add product URLs, affiliate items, or social profile pages. Drag rows to reorder.
        </p>
      </div>

      {/* Add Link Form */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 block">
          Add New Link Card
        </h3>

        {formError && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-red-950/40 border border-red-900/30 px-4 py-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleAddLink} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-450 uppercase tracking-wider block">
                Link Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. My Favorite Dress"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-450 uppercase tracking-wider block">
                Destination URL
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="e.g. amazon.com/dp/B001"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={adding}
            className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Add Link Card</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Links List with Sortable Context */}
      <div className="space-y-4">
        {links.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {links.map((link) => (
                  <SortableLinkRow
                    key={link.id}
                    link={link}
                    onDelete={deleteLink}
                    onUpdate={saveLinkUpdate}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-12 bg-slate-950/20 border border-dashed border-slate-850 rounded-3xl">
            <LinkIcon className="h-8 w-8 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-450 text-sm font-medium">Your links page is empty</p>
            <p className="text-xs text-slate-500 mt-1">Add your first product or social link above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
