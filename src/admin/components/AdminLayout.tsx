import React, { useState, useEffect, ReactNode } from "react";
import { AdminSidebar, AdminTab } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { ToastContainer, ToastMessage } from "./Toast";
import { cloudStore } from "../../lib/cloudStore";
import { cmsStore } from "../../lib/cmsStore";
import { authStore } from "../../lib/authStore";
import { Search, X } from "lucide-react";

interface AdminLayoutProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  children: ReactNode;
  toasts: ToastMessage[];
  onDismissToast: (id: string) => void;
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
  onLogout: () => void;
}

export function AdminLayout({
  activeTab,
  onSelectTab,
  children,
  toasts,
  onDismissToast,
  onAddToast,
  onLogout,
}: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(() => cloudStore.getLastConnectionState().isOnline);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(() => cmsStore.getMessages().filter(m => !m.read).length);

  useEffect(() => {
    // Check live health
    cloudStore.checkHealth();

    const handleHealthUpdate = (e: any) => {
      setIsCloudConnected(Boolean(e.detail?.isOnline));
    };

    const handleUpdate = () => {
      setUnreadMessages(cmsStore.getMessages().filter(m => !m.read).length);
    };

    const handleConfig = () => {
      cloudStore.checkHealth();
    };

    window.addEventListener("cms_data_updated", handleUpdate);
    window.addEventListener("rh_cloud_config_updated", handleConfig);
    window.addEventListener("rh_cloud_health_updated", handleHealthUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
      window.removeEventListener("rh_cloud_config_updated", handleConfig);
      window.removeEventListener("rh_cloud_health_updated", handleHealthUpdate);
    };
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleQuickSync = async () => {
    setIsSyncing(true);
    const res = await cmsStore.syncAllToCloud();
    setIsSyncing(false);
    if (res.success) {
      onAddToast("success", "All portfolio data successfully synchronized to Cloud DB! 🟢");
    } else {
      onAddToast("error", res.message || "Failed to sync to Cloud Database.");
    }
  };

  const searchableTabs: Array<{ id: AdminTab; title: string; category: string }> = [
    { id: "dashboard", title: "Executive Dashboard", category: "Overview" },
    { id: "profile", title: "Profile, Hero & Bio", category: "Identity" },
    { id: "experience", title: "Career Journey & Timeline", category: "Identity" },
    { id: "projects", title: "Portfolio Projects", category: "Showcase" },
    { id: "videos", title: "Video Showcase Manager", category: "Showcase" },
    { id: "clients", title: "Clients & Brand Logos", category: "Showcase" },
    { id: "services", title: "Services & Features", category: "Showcase" },
    { id: "stats", title: "Key Statistics & Counters", category: "Stats" },
    { id: "skills", title: "Core Skills & Icons", category: "Skills" },
    { id: "tools", title: "Software & Production Tools", category: "Skills" },
    { id: "testimonials", title: "Testimonials & Reviews", category: "Reviews" },
    { id: "social", title: "Social Media Links", category: "Communications" },
    { id: "contact", title: "Contact Information & Inbox", category: "Communications" },
    { id: "content", title: "Website Copy & Headlines", category: "Architecture" },
    { id: "media", title: "Media Library", category: "Architecture" },
    { id: "sections", title: "Section Order & Visibility", category: "Architecture" },
    { id: "seo", title: "SEO Meta & Social Preview", category: "Architecture" },
    { id: "settings", title: "Cloud Database & Security", category: "System" },
  ];

  const filteredTabs = searchableTabs.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-primary text-text-pure flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        unreadMessagesCount={unreadMessages}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <AdminTopbar
          activeTab={activeTab}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          isCloudConnected={isCloudConnected}
          isSyncing={isSyncing}
          onQuickSync={handleQuickSync}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-fadeIn">
          <div className="bg-secondary rounded-3xl border border-white/10 max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search size={18} className="text-accent shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search CMS sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-text-pure placeholder:text-text-muted focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-text-muted hover:text-text-pure rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-3 space-y-1 custom-scrollbar">
              {filteredTabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-text-pure">{item.title}</span>
                  <span className="text-[10px] text-accent uppercase tracking-wider font-mono">
                    {item.category}
                  </span>
                </button>
              ))}

              {filteredTabs.length === 0 && (
                <div className="p-8 text-center text-xs text-text-muted">
                  No section found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={onDismissToast} />
    </div>
  );
}
