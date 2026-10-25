import React, { useState } from "react";
import { Video, Plus, Edit3, Trash2, Play, Star, Eye, EyeOff, ArrowUp, ArrowDown, Home, FolderOpen, Layers, Check } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { VideoItem } from "../../lib/cmsTypes";
import { FormInput, FormTextarea, FormSelect, FormToggle, ImagePreviewInput } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface VideoManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function VideoManager({ onAddToast }: VideoManagerProps) {
  const [videos, setVideos] = useState<VideoItem[]>(() => cmsStore.getVideos());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Partial<VideoItem> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenModal = (vid?: VideoItem) => {
    if (vid) {
      setEditingVideo({ ...vid });
    } else {
      setEditingVideo({
        title: "",
        youtubeUrl: "",
        thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
        category: "Reels",
        qualityBadge: "4K 60FPS",
        duration: "0:45",
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
    if (!editingVideo?.title || !editingVideo?.youtubeUrl) {
      onAddToast("warning", "Please provide a Video Title and URL.");
      return;
    }

    const updated = cmsStore.saveVideo(editingVideo);
    setVideos(updated);
    setIsModalOpen(false);
    setEditingVideo(null);
    onAddToast("success", "Video saved with placement controls! 🎥");
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteVideo(deleteTargetId);
    setVideos(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Video removed successfully.");
  };

  const handleToggleMainPage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = cmsStore.toggleVideoPlacement(id, "main");
    setVideos(updated);
    const target = updated.find(v => v.id === id);
    onAddToast("info", `Placement updated for "${target?.title}".`);
  };

  const handleToggleViewMore = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = cmsStore.toggleVideoPlacement(id, "view_more");
    setVideos(updated);
    const target = updated.find(v => v.id === id);
    onAddToast("info", `Placement updated for "${target?.title}".`);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= videos.length) return;

    const list = [...videos];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    cmsStore.set("videos", updated);
    setVideos(updated);
    onAddToast("info", "Videos reordered.");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10 shadow-lg">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <Video size={20} className="text-accent" /> Dedicated Video Showcase
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Manage high-retention video streams, quality badges, and placement controls.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0 active:scale-95"
        >
          <Plus size={16} /> Add Video
        </button>
      </div>

      {/* Videos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((v, idx) => {
          const isMain = v.showOnMainPage !== false;
          const isViewMore = v.showInViewMore !== false;

          return (
            <div
              key={v.id}
              className="rounded-3xl bg-secondary/40 border border-white/10 hover:border-accent/40 transition-all overflow-hidden flex flex-col group shadow-lg"
            >
              <div className="relative aspect-video bg-primary/80 overflow-hidden">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-accent uppercase tracking-wider">
                    {v.category}
                  </span>
                  {v.qualityBadge && (
                    <span className="px-2 py-0.5 rounded bg-accent text-primary text-[9px] font-bold uppercase">
                      {v.qualityBadge}
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    v.published ? "bg-green-500/80 text-white" : "bg-amber-500/80 text-primary"
                  }`}>
                    {v.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-display font-bold text-text-pure line-clamp-1 group-hover:text-accent transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-1 font-mono">
                    {v.client ? `Client: ${v.client}` : "General Showcase"} {v.duration && `• ${v.duration}`}
                  </p>

                  {/* 1-Click Placement Toggles */}
                  <div className="mt-3 p-2.5 rounded-2xl bg-primary/40 border border-white/5 space-y-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted font-mono block">
                      Placement:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleToggleMainPage(v.id, e)}
                        className={`px-2 py-1 rounded-xl text-[9px] font-bold uppercase flex items-center justify-center gap-1 border transition-all ${
                          isMain
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : "bg-white/5 border-white/10 text-text-muted"
                        }`}
                      >
                        <Home size={10} /> Home: {isMain ? "ON" : "OFF"}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleToggleViewMore(v.id, e)}
                        className={`px-2 py-1 rounded-xl text-[9px] font-bold uppercase flex items-center justify-center gap-1 border transition-all ${
                          isViewMore
                            ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                            : "bg-white/5 border-white/10 text-text-muted"
                        }`}
                      >
                        <FolderOpen size={10} /> View More: {isViewMore ? "ON" : "OFF"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      disabled={idx === videos.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(v)}
                      className="p-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent font-bold"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(v.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
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

      {/* Add / Edit Video Modal */}
      {isModalOpen && editingVideo && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-xl w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-display font-bold text-text-pure">
              {editingVideo.id ? "Edit Showcase Video" : "Add Video to Showcase"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Placement Selector */}
              <div className="p-4 rounded-2xl bg-primary/80 border border-accent/30 space-y-2.5">
                <label className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Layers size={13} /> Video Placement Control
                </label>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div
                    onClick={() => setEditingVideo({ ...editingVideo, placement: "both", showOnMainPage: true, showInViewMore: true })}
                    className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      editingVideo.showOnMainPage !== false && editingVideo.showInViewMore !== false
                        ? "bg-accent/20 border-accent text-accent"
                        : "bg-secondary/40 border-white/5 text-text-muted"
                    }`}
                  >
                    Both Pages
                  </div>
                  <div
                    onClick={() => setEditingVideo({ ...editingVideo, placement: "main", showOnMainPage: true, showInViewMore: false })}
                    className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      editingVideo.showOnMainPage === true && editingVideo.showInViewMore === false
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-secondary/40 border-white/5 text-text-muted"
                    }`}
                  >
                    Main Page
                  </div>
                  <div
                    onClick={() => setEditingVideo({ ...editingVideo, placement: "view_more", showOnMainPage: false, showInViewMore: true })}
                    className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      editingVideo.showOnMainPage === false && editingVideo.showInViewMore === true
                        ? "bg-sky-500/20 border-sky-500 text-sky-400"
                        : "bg-secondary/40 border-white/5 text-text-muted"
                    }`}
                  >
                    View More
                  </div>
                </div>
              </div>

              <FormInput
                label="Video Title"
                required
                placeholder="e.g. Next-Gen Tech Commercial"
                value={editingVideo.title || ""}
                onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
              />

              <FormInput
                label="Video Stream URL (YouTube or Vimeo)"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={editingVideo.youtubeUrl || ""}
                onChange={(e) => setEditingVideo({ ...editingVideo, youtubeUrl: e.target.value })}
              />

              <ImagePreviewInput
                label="Video Thumbnail Preview"
                value={editingVideo.thumbnail || ""}
                onChange={(url) => setEditingVideo({ ...editingVideo, thumbnail: url })}
                aspect="video"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput
                  label="Category"
                  placeholder="Reels, Commercial, etc."
                  value={editingVideo.category || "Reels"}
                  onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                />
                <FormInput
                  label="Quality Badge"
                  placeholder="4K 60FPS"
                  value={editingVideo.qualityBadge || "4K 60FPS"}
                  onChange={(e) => setEditingVideo({ ...editingVideo, qualityBadge: e.target.value })}
                />
                <FormInput
                  label="Duration"
                  placeholder="0:45"
                  value={editingVideo.duration || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <FormToggle
                  label="Published"
                  description="Visible on public website"
                  checked={editingVideo.published ?? true}
                  onChange={(checked) => setEditingVideo({ ...editingVideo, published: checked })}
                />
                <FormToggle
                  label="Featured"
                  description="Prioritize in stream order"
                  checked={editingVideo.featured ?? true}
                  onChange={(checked) => setEditingVideo({ ...editingVideo, featured: checked })}
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
                  className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-primary text-xs font-bold uppercase tracking-wider"
                >
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Showcase Video"
        message="Are you sure you want to permanently delete this video from the showcase?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
