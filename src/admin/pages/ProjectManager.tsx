import React, { useState } from "react";
import {
  Film,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Star,
  Search,
  ExternalLink,
  Play,
  CheckCircle2,
  Home,
  FolderOpen,
  ArrowUp,
  ArrowDown,
  Layers,
  Check,
  Globe
} from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { ProjectItem } from "../../lib/cmsTypes";
import { FormInput, FormTextarea, FormSelect, FormToggle, ImagePreviewInput } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface ProjectManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

const CATEGORY_OPTIONS = [
  { label: "Reels / Shorts (9:16)", value: "Reels" },
  { label: "Commercial Ads (16:9)", value: "Commercial" },
  { label: "SaaS & UI Animation", value: "Saas Animation" },
  { label: "Motion Graphics", value: "Motion Graphics" },
  { label: "Documentary Film", value: "Documentary" },
];

export function ProjectManager({ onAddToast }: ProjectManagerProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(() => cmsStore.getProjects());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [placementFilter, setPlacementFilter] = useState<"all" | "main" | "view_more" | "both">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [softwareTagInput, setSoftwareTagInput] = useState("");

  const handleOpenModal = (project?: ProjectItem) => {
    if (project) {
      setEditingProject({ ...project });
    } else {
      setEditingProject({
        title: "",
        category: "Reels",
        thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
        youtubeUrl: "",
        description: "",
        duration: "0:30",
        softwareUsed: ["Premiere Pro", "After Effects"],
        featured: true,
        published: true,
        showOnMainPage: true,
        showInViewMore: true,
        placement: "both",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.youtubeUrl) {
      onAddToast("warning", "Please provide a Project Title and Video URL.");
      return;
    }

    const updated = cmsStore.saveProject(editingProject);
    setProjects(updated);
    setIsModalOpen(false);
    setEditingProject(null);
    onAddToast("success", "Video project saved with placement settings! 🚀");
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteProject(deleteTargetId);
    setProjects(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Project deleted successfully.");
  };

  const handleDuplicate = (project: ProjectItem) => {
    const duplicated: Partial<ProjectItem> = {
      ...project,
      id: undefined,
      title: `${project.title} (Copy)`,
      slug: `${project.slug}-copy`,
    };
    const updated = cmsStore.saveProject(duplicated);
    setProjects(updated);
    onAddToast("success", "Project duplicated successfully! 📋");
  };

  const handleTogglePublish = (project: ProjectItem) => {
    const updated = cmsStore.saveProject({
      ...project,
      published: !project.published,
    });
    setProjects(updated);
    onAddToast("info", `Project marked as ${!project.published ? "Published" : "Draft"}.`);
  };

  const handleToggleFeatured = (project: ProjectItem) => {
    const updated = cmsStore.saveProject({
      ...project,
      featured: !project.featured,
    });
    setProjects(updated);
    onAddToast("info", `Project featured status updated.`);
  };

  // Quick 1-click toggle for Main Page
  const handleToggleMainPage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = cmsStore.toggleProjectPlacement(id, "main");
    setProjects(updated);
    const target = updated.find(p => p.id === id);
    const isNowOnMain = target?.showOnMainPage;
    onAddToast(
      isNowOnMain ? "success" : "info",
      isNowOnMain 
        ? `"${target?.title}" is now visible on Main Home Page! 🏠`
        : `"${target?.title}" removed from Main Home Page.`
    );
  };

  // Quick 1-click toggle for View More Work inner page
  const handleToggleViewMore = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = cmsStore.toggleProjectPlacement(id, "view_more");
    setProjects(updated);
    const target = updated.find(p => p.id === id);
    const isNowInViewMore = target?.showInViewMore;
    onAddToast(
      isNowInViewMore ? "success" : "info",
      isNowInViewMore 
        ? `"${target?.title}" is now visible in View More Work! 📂`
        : `"${target?.title}" removed from View More Work.`
    );
  };

  // Move project up/down in ordering
  const handleMove = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const list = [...projects];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = cmsStore.reorderProjects(list);
    setProjects(updated);
    onAddToast("info", "Project sequence updated.");
  };

  const handleAddSoftwareTag = () => {
    if (!softwareTagInput.trim()) return;
    const current = editingProject?.softwareUsed || [];
    if (current.includes(softwareTagInput.trim())) return;
    setEditingProject({
      ...editingProject,
      softwareUsed: [...current, softwareTagInput.trim()],
    });
    setSoftwareTagInput("");
  };

  const handleRemoveSoftwareTag = (tag: string) => {
    const current = editingProject?.softwareUsed || [];
    setEditingProject({
      ...editingProject,
      softwareUsed: current.filter(t => t !== tag),
    });
  };

  // Filter calculations
  const countMain = projects.filter(p => p.showOnMainPage !== false).length;
  const countViewMore = projects.filter(p => p.showInViewMore !== false).length;
  const countBoth = projects.filter(p => p.showOnMainPage !== false && p.showInViewMore !== false).length;

  const filteredProjects = projects.filter((p) => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchPlacement = true;
    if (placementFilter === "main") {
      matchPlacement = p.showOnMainPage !== false && p.showInViewMore === false;
    } else if (placementFilter === "view_more") {
      matchPlacement = p.showInViewMore !== false && p.showOnMainPage === false;
    } else if (placementFilter === "both") {
      matchPlacement = p.showOnMainPage !== false && p.showInViewMore !== false;
    }

    return matchCat && matchSearch && matchPlacement;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10 shadow-lg">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <Film size={20} className="text-accent" /> Portfolio Video Placement & CMS
          </h2>
          <p className="text-xs text-text-soft mt-1">
            Total: <span className="text-text-pure font-bold">{projects.length}</span> • 
            Main Page: <span className="text-accent font-bold">{countMain}</span> • 
            View More Work: <span className="text-sky-400 font-bold">{countViewMore}</span> • 
            Both: <span className="text-amber-400 font-bold">{countBoth}</span>
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0 active:scale-95"
        >
          <Plus size={16} /> Add Video Project
        </button>
      </div>

      {/* Placement Control Quick Filter Bar */}
      <div className="p-4 rounded-2xl bg-secondary/40 border border-white/10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-accent font-mono flex items-center gap-1.5">
            <Layers size={13} /> Filter by Page Placement
          </span>
          <span className="text-[11px] text-text-muted">
            Click 1-click toggles on any video card below to move between pages
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPlacementFilter("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              placementFilter === "all"
                ? "bg-accent text-primary shadow-md shadow-accent/20"
                : "bg-white/5 hover:bg-white/10 text-text-soft"
            }`}
          >
            <span>All Videos</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-black/20">{projects.length}</span>
          </button>

          <button
            onClick={() => setPlacementFilter("both")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              placementFilter === "both"
                ? "bg-amber-500 text-primary shadow-md shadow-amber-500/20"
                : "bg-white/5 hover:bg-white/10 text-text-soft"
            }`}
          >
            <Star size={13} />
            <span>Both Pages</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-black/20">{countBoth}</span>
          </button>

          <button
            onClick={() => setPlacementFilter("main")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              placementFilter === "main"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "bg-white/5 hover:bg-white/10 text-text-soft"
            }`}
          >
            <Home size={13} />
            <span>Main Page Only</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-black/20">
              {projects.filter(p => p.showOnMainPage !== false && p.showInViewMore === false).length}
            </span>
          </button>

          <button
            onClick={() => setPlacementFilter("view_more")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              placementFilter === "view_more"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                : "bg-white/5 hover:bg-white/10 text-text-soft"
            }`}
          >
            <FolderOpen size={13} />
            <span>View More Only</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-black/20">
              {projects.filter(p => p.showInViewMore !== false && p.showOnMainPage === false).length}
            </span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary/30 p-4 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-primary/60 border border-white/10 focus:border-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-pure focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {["All", "Reels", "Commercial", "Saas Animation", "Motion Graphics", "Documentary"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-accent text-primary"
                  : "bg-white/5 hover:bg-white/10 text-text-soft"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p, idx) => {
          const isMain = p.showOnMainPage !== false;
          const isViewMore = p.showInViewMore !== false;

          return (
            <div
              key={p.id}
              className="rounded-3xl bg-secondary/40 border border-white/10 hover:border-accent/40 transition-all overflow-hidden flex flex-col group shadow-xl"
            >
              {/* Thumbnail Header */}
              <div className={`relative w-full ${p.category === "Reels" ? "aspect-[9/16]" : "aspect-video"} bg-primary/80 overflow-hidden`}>
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop";
                  }}
                />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-accent uppercase tracking-wider border border-white/10">
                    {p.category}
                  </span>
                  {p.featured && (
                    <span className="p-1 rounded-full bg-accent text-primary" title="Featured Project">
                      <Star size={12} fill="currentColor" />
                    </span>
                  )}
                </div>

                {/* Placement Indicator Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  {isMain && isViewMore && (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase bg-amber-500/90 text-primary flex items-center gap-1 shadow-md">
                      <Star size={10} fill="currentColor" /> Both Pages
                    </span>
                  )}
                  {isMain && !isViewMore && (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase bg-emerald-500/90 text-white flex items-center gap-1 shadow-md">
                      <Home size={10} /> Main Page Only
                    </span>
                  )}
                  {!isMain && isViewMore && (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase bg-sky-500/90 text-white flex items-center gap-1 shadow-md">
                      <FolderOpen size={10} /> View More Only
                    </span>
                  )}
                  {!isMain && !isViewMore && (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase bg-neutral-600/90 text-neutral-200">
                      Hidden
                    </span>
                  )}
                </div>
              </div>

              {/* Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-display font-bold text-text-pure line-clamp-1 group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      p.published ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {p.published ? "Live" : "Draft"}
                    </span>
                  </div>

                  <p className="text-xs text-text-soft line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  {/* 1-Click Placement Toggles Section */}
                  <div className="pt-2 pb-1 space-y-1.5 bg-primary/40 p-2.5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted font-mono block">
                      Video Placement (Click to Toggle):
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleToggleMainPage(p.id, e)}
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                          isMain
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 shadow-sm"
                            : "bg-white/5 border-white/10 text-text-muted hover:bg-white/10"
                        }`}
                        title="Click to toggle visibility on Homepage"
                      >
                        <Home size={11} className={isMain ? "text-emerald-400" : "text-text-muted"} />
                        <span>Home: {isMain ? "ON" : "OFF"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleToggleViewMore(p.id, e)}
                        className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                          isViewMore
                            ? "bg-sky-500/20 border-sky-500/50 text-sky-300 hover:bg-sky-500/30 shadow-sm"
                            : "bg-white/5 border-white/10 text-text-muted hover:bg-white/10"
                        }`}
                        title="Click to toggle visibility on View More Work inner page"
                      >
                        <FolderOpen size={11} className={isViewMore ? "text-sky-400" : "text-text-muted"} />
                        <span>View More: {isViewMore ? "ON" : "OFF"}</span>
                      </button>
                    </div>
                  </div>

                  {p.softwareUsed && p.softwareUsed.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.softwareUsed.map((s) => (
                        <span key={s} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-text-muted font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions & Sequence Reorder */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  {/* Sequence Reorder Arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={(e) => handleMove(idx, "up", e)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-20 transition-all"
                      title="Move Up in sequence"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      disabled={idx === filteredProjects.length - 1}
                      onClick={(e) => handleMove(idx, "down", e)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-20 transition-all"
                      title="Move Down in sequence"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => handleTogglePublish(p)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft"
                      title={p.published ? "Unpublish (Make Draft)" : "Publish"}
                    >
                      {p.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`p-1.5 rounded-lg hover:bg-white/10 ${p.featured ? "text-accent bg-accent/15" : "text-text-muted bg-white/5"}`}
                      title="Toggle Featured Star"
                    >
                      <Star size={14} fill={p.featured ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Edit / Duplicate / Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(p)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft"
                      title="Duplicate Project"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => handleOpenModal(p)}
                      className="p-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent font-bold"
                      title="Edit Project & Placement"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(p.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      title="Delete Project"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-20 text-center text-text-muted bg-secondary/20 rounded-3xl border border-white/5 space-y-3">
          <Film size={36} className="mx-auto text-text-muted/40" />
          <p className="text-sm font-medium">No projects match the current placement or category filter.</p>
          <button
            onClick={() => { setPlacementFilter("all"); setSelectedCategory("All"); setSearchQuery(""); }}
            className="text-accent text-xs font-bold uppercase tracking-wider hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto custom-scrollbar animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-2xl w-full shadow-2xl space-y-6 my-8">
            <h3 className="text-lg font-display font-bold text-text-pure">
              {editingProject.id ? "Edit Portfolio Video & Placement" : "Create New Portfolio Project"}
            </h3>

            <form onSubmit={handleSave} className="space-y-5">
              {/* PRIMARY REQUIREMENT: Video Placement Selector */}
              <div className="p-4 sm:p-5 rounded-2xl bg-primary/80 border border-accent/30 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Layers size={14} /> Video Page Placement
                  </label>
                  <span className="text-[10px] text-text-muted">Choose where this video appears</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Both */}
                  <div
                    onClick={() => setEditingProject({
                      ...editingProject,
                      placement: "both",
                      showOnMainPage: true,
                      showInViewMore: true,
                    })}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      (editingProject.placement === "both" || (editingProject.showOnMainPage !== false && editingProject.showInViewMore !== false))
                        ? "bg-accent/20 border-accent text-text-pure shadow-md"
                        : "bg-secondary/40 border-white/5 text-text-muted hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <Star size={13} className="text-amber-400" /> Both Pages
                      </span>
                      {(editingProject.placement === "both" || (editingProject.showOnMainPage !== false && editingProject.showInViewMore !== false)) && (
                        <Check size={14} className="text-accent" />
                      )}
                    </div>
                    <p className="text-[10px] text-text-soft leading-tight">
                      Homepage showcase + full "View More Work" inner page
                    </p>
                  </div>

                  {/* Option 2: Main Page Only */}
                  <div
                    onClick={() => setEditingProject({
                      ...editingProject,
                      placement: "main",
                      showOnMainPage: true,
                      showInViewMore: false,
                    })}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      editingProject.placement === "main" || (editingProject.showOnMainPage === true && editingProject.showInViewMore === false)
                        ? "bg-emerald-500/20 border-emerald-500 text-text-pure shadow-md"
                        : "bg-secondary/40 border-white/5 text-text-muted hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <Home size={13} className="text-emerald-400" /> Main Page Only
                      </span>
                      {(editingProject.placement === "main" || (editingProject.showOnMainPage === true && editingProject.showInViewMore === false)) && (
                        <Check size={14} className="text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[10px] text-text-soft leading-tight">
                      Curated exclusively for the main home page showcase
                    </p>
                  </div>

                  {/* Option 3: View More Only */}
                  <div
                    onClick={() => setEditingProject({
                      ...editingProject,
                      placement: "view_more",
                      showOnMainPage: false,
                      showInViewMore: true,
                    })}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      editingProject.placement === "view_more" || (editingProject.showOnMainPage === false && editingProject.showInViewMore === true)
                        ? "bg-sky-500/20 border-sky-500 text-text-pure shadow-md"
                        : "bg-secondary/40 border-white/5 text-text-muted hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <FolderOpen size={13} className="text-sky-400" /> View More Only
                      </span>
                      {(editingProject.placement === "view_more" || (editingProject.showOnMainPage === false && editingProject.showInViewMore === true)) && (
                        <Check size={14} className="text-sky-400" />
                      )}
                    </div>
                    <p className="text-[10px] text-text-soft leading-tight">
                      Keeps home page fast, inside "View More Work" inner page
                    </p>
                  </div>
                </div>

                {/* Granular Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/5">
                  <FormToggle
                    label="Show on Main Page (Home)"
                    description="Include in cinematic portfolio grid on Homepage"
                    checked={editingProject.showOnMainPage !== false}
                    onChange={(checked) => {
                      const nextMain = checked;
                      const nextView = editingProject.showInViewMore ?? true;
                      const nextPlacement = (nextMain && nextView) ? "both" : nextMain ? "main" : "view_more";
                      setEditingProject({
                        ...editingProject,
                        showOnMainPage: nextMain,
                        placement: nextPlacement,
                      });
                    }}
                  />

                  <FormToggle
                    label="Show in View More Work (Inner Page)"
                    description="Include in /work dedicated gallery"
                    checked={editingProject.showInViewMore !== false}
                    onChange={(checked) => {
                      const nextMain = editingProject.showOnMainPage ?? true;
                      const nextView = checked;
                      const nextPlacement = (nextMain && nextView) ? "both" : nextMain ? "main" : "view_more";
                      setEditingProject({
                        ...editingProject,
                        showInViewMore: nextView,
                        placement: nextPlacement,
                      });
                    }}
                  />
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Project Title"
                  required
                  placeholder="e.g. Luxury Real Estate Commercial"
                  value={editingProject.title || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                />

                <FormSelect
                  label="Category"
                  options={CATEGORY_OPTIONS}
                  value={editingProject.category || "Reels"}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                />
              </div>

              <ImagePreviewInput
                label="Thumbnail URL"
                value={editingProject.thumbnail || ""}
                onChange={(url) => setEditingProject({ ...editingProject, thumbnail: url })}
                aspect={editingProject.category === "Reels" ? "reel" : "video"}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Video Stream URL (YouTube/Vimeo/Direct)"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or embed URL"
                  value={editingProject.youtubeUrl || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, youtubeUrl: e.target.value })}
                />

                <FormInput
                  label="Duration Badge"
                  placeholder="e.g. 0:30, 2:15"
                  value={editingProject.duration || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Client Name"
                  placeholder="e.g. TechVibe Global"
                  value={editingProject.clientName || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                />

                <FormInput
                  label="Your Role on Project"
                  placeholder="e.g. Lead Video Editor & Colorist"
                  value={editingProject.role || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                />
              </div>

              <FormTextarea
                label="Project Narrative & Technical Overview"
                rows={3}
                placeholder="Explain the video concept, rhythm, sound design, hooks, and retention engineering..."
                value={editingProject.description || ""}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              />

              {/* Software Tags Manager */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-accent uppercase tracking-wider block">
                  Software Used Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Premiere Pro, DaVinci Resolve, After Effects..."
                    value={softwareTagInput}
                    onChange={(e) => setSoftwareTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSoftwareTag();
                      }
                    }}
                    className="flex-1 bg-primary/70 border border-white/10 focus:border-accent rounded-xl px-4 py-2.5 text-xs text-text-pure focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSoftwareTag}
                    className="px-4 py-2.5 rounded-xl bg-accent text-primary font-bold text-xs uppercase"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(editingProject.softwareUsed || []).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveSoftwareTag(t)}
                        className="hover:text-red-400 p-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <FormToggle
                  label="Published to Live Site"
                  description="When turned OFF, this project will only be visible in Admin as a draft"
                  checked={editingProject.published ?? true}
                  onChange={(checked) => setEditingProject({ ...editingProject, published: checked })}
                />

                <FormToggle
                  label="Featured Project"
                  description="Displays gold star and prioritizes in showcase galleries"
                  checked={editingProject.featured ?? true}
                  onChange={(checked) => setEditingProject({ ...editingProject, featured: checked })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-text-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-primary text-xs font-bold uppercase tracking-wider shadow-lg shadow-accent/20"
                >
                  Save Project & Placement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Portfolio Project"
        message="Are you sure you want to permanently delete this project? This will remove it from all public showcase galleries."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
