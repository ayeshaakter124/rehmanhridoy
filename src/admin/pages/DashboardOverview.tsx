import React from "react";
import {
  Film,
  Video,
  Building2,
  Award,
  MessageSquareQuote,
  Mail,
  Plus,
  ArrowRight,
  Cloud,
  CloudOff,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Briefcase,
  Home,
  FolderOpen
} from "lucide-react";
import { StatCard } from "../components/StatCard";
import { cmsStore } from "../../lib/cmsStore";
import { cloudStore } from "../../lib/cloudStore";
import { AdminTab } from "../components/AdminSidebar";

interface DashboardOverviewProps {
  onNavigateTab: (tab: AdminTab) => void;
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function DashboardOverview({ onNavigateTab, onAddToast }: DashboardOverviewProps) {
  const profile = cmsStore.getProfile();
  const projects = cmsStore.getProjects();
  const videos = cmsStore.getVideos();
  const clients = cmsStore.getClients();
  const skills = cmsStore.getSkills();
  const experiences = cmsStore.getExperiences();
  const testimonials = cmsStore.getTestimonials();
  const messages = cmsStore.getMessages();
  const isCloudConfigured = cloudStore.isConfigured();

  const publishedProjects = projects.filter(p => p.published).length;
  const draftProjects = projects.filter(p => !p.published).length;
  const mainProjects = projects.filter(p => p.showOnMainPage !== false).length;
  const viewMoreProjects = projects.filter(p => p.showInViewMore !== false).length;
  const unreadMessages = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="p-8 rounded-[32px] bg-gradient-to-r from-secondary/90 via-secondary/60 to-accent/10 border border-accent/20 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider">
                Portfolio CMS Studio
              </span>
              {isCloudConfigured ? (
                <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold flex items-center gap-1">
                  <Cloud size={12} /> Global Cloud Connected
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                  <CloudOff size={12} /> Local Cache Mode
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-bold text-text-pure tracking-tight">
              Welcome back, <span className="text-accent">{profile.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-text-soft font-light max-w-2xl leading-relaxed">
              Your live portfolio website is connected to this CMS. Every change you save here instantly synchronizes with your cloud database and public visitors worldwide.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab("projects")}
              className="px-5 py-3 rounded-2xl bg-accent text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
            >
              <Plus size={16} /> New Project
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-text-pure font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all border border-white/10"
            >
              <ExternalLink size={16} /> Visit Site
            </a>
          </div>
        </div>
      </div>

      {/* Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Projects"
          value={projects.length}
          icon={<Film size={22} />}
          detail={`${publishedProjects} Published • ${draftProjects} Drafts`}
          onClick={() => onNavigateTab("projects")}
        />

        <StatCard
          label="Main Page Videos"
          value={mainProjects}
          icon={<Home size={22} />}
          detail="Curated for Homepage showcase"
          onClick={() => onNavigateTab("projects")}
        />

        <StatCard
          label="View More Work"
          value={viewMoreProjects}
          icon={<FolderOpen size={22} />}
          detail="Assigned to /work gallery"
          onClick={() => onNavigateTab("projects")}
        />

        <StatCard
          label="Inquiry Inbox"
          value={messages.length}
          icon={<Mail size={22} />}
          detail={unreadMessages > 0 ? `${unreadMessages} unread messages` : "All caught up"}
          trend={unreadMessages > 0 ? "ACTION NEEDED" : undefined}
          onClick={() => onNavigateTab("contact")}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Core Skills"
          value={skills.length}
          icon={<Award size={22} />}
          detail="Technical proficiencies"
          onClick={() => onNavigateTab("skills")}
        />

        <StatCard
          label="Career Milestones"
          value={experiences.length}
          icon={<Briefcase size={22} />}
          detail="Journey Timeline items"
          onClick={() => onNavigateTab("experience")}
        />

        <StatCard
          label="Client Reviews"
          value={testimonials.length}
          icon={<MessageSquareQuote size={22} />}
          detail="5-Star Testimonials"
          onClick={() => onNavigateTab("testimonials")}
        />

        <StatCard
          label="Active Services"
          value={cmsStore.getServices().length}
          icon={<Sparkles size={22} />}
          detail="Production offerings"
          onClick={() => onNavigateTab("services")}
        />
      </div>

      {/* Quick Launchers & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Action Buttons */}
        <div className="p-6 rounded-3xl bg-secondary/60 border border-white/10 space-y-4">
          <h3 className="text-sm font-display font-bold text-text-pure flex items-center gap-2">
            <Plus size={16} className="text-accent" /> Quick Actions
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => onNavigateTab("projects")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primary/60 hover:bg-accent hover:text-primary transition-all text-xs font-semibold text-text-pure group border border-white/5"
            >
              <span className="flex items-center gap-2.5">
                <Film size={16} className="text-accent group-hover:text-primary" />
                Add New Project
              </span>
              <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateTab("videos")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primary/60 hover:bg-accent hover:text-primary transition-all text-xs font-semibold text-text-pure group border border-white/5"
            >
              <span className="flex items-center gap-2.5">
                <Video size={16} className="text-accent group-hover:text-primary" />
                Add Video to Showcase
              </span>
              <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateTab("profile")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primary/60 hover:bg-accent hover:text-primary transition-all text-xs font-semibold text-text-pure group border border-white/5"
            >
              <span className="flex items-center gap-2.5">
                <User size={16} className="text-accent group-hover:text-primary" />
                Edit Profile, Titles & Bio
              </span>
              <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateTab("experience")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primary/60 hover:bg-accent hover:text-primary transition-all text-xs font-semibold text-text-pure group border border-white/5"
            >
              <span className="flex items-center gap-2.5">
                <Briefcase size={16} className="text-accent group-hover:text-primary" />
                Add Career Experience
              </span>
              <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateTab("sections")}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-primary/60 hover:bg-accent hover:text-primary transition-all text-xs font-semibold text-text-pure group border border-white/5"
            >
              <span className="flex items-center gap-2.5">
                <TrendingUp size={16} className="text-accent group-hover:text-primary" />
                Manage Section Visibility (ON/OFF)
              </span>
              <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Recent Inquiries Preview */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-secondary/60 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-bold text-text-pure flex items-center gap-2">
              <Mail size={16} className="text-accent" /> Recent Contact Inquiries
            </h3>
            <button
              onClick={() => onNavigateTab("contact")}
              className="text-xs text-accent hover:underline font-bold"
            >
              View All ({messages.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {messages.slice(0, 3).map((m) => (
              <div
                key={m.id}
                onClick={() => onNavigateTab("contact")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  m.read
                    ? "bg-primary/40 border-white/5 hover:border-white/20"
                    : "bg-secondary border-accent/40 shadow-lg"
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-text-pure">{m.name}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-accent/20 text-accent font-bold uppercase">
                      {m.ventureNature}
                    </span>
                    {!m.read && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500 text-white font-bold uppercase">
                        NEW
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-text-soft line-clamp-1">{m.message}</p>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="py-12 text-center text-text-muted text-xs bg-primary/20 rounded-2xl border border-white/5">
                No inquiries received yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
