import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Play, ArrowLeft, Clock, Share2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import VideoModal from "../components/VideoModal";
import { cmsStore } from "../lib/cmsStore";
import { ProjectItem } from "../lib/cmsTypes";

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

const BASE_CATEGORIES = ["Reels", "Commercial", "Saas Animation", "Documentary", "Motion Graphics"];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("Reels");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<{ id: string, title: string } | null>(null);
  const [videoProjects, setVideoProjects] = useState<ProjectItem[]>(() => 
    cmsStore.getProjects().filter(p => p.published)
  );

  useEffect(() => {
    const handleUpdate = () => {
      setVideoProjects(cmsStore.getProjects().filter(p => p.published));
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
    };
  }, []);

  // Compute unique categories from projects plus base categories
  const categories = Array.from(
    new Set([
      ...BASE_CATEGORIES,
      ...videoProjects.map(p => p.category).filter(Boolean)
    ])
  );

  const filteredVideos = useMemo(() => {
    return videoProjects.filter((video) => {
      const matchesCategory = video.category === activeCategory;
      const matchesSearch = !searchQuery.trim() || 
                            video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            video.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, videoProjects]);

  return (
    <div className="min-h-screen bg-primary pt-24 sm:pt-32 pb-16 sm:pb-24 text-text-pure">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-accent/5 rounded-full blur-[50px] sm:blur-[70px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-panel/5 rounded-full blur-[50px] sm:blur-[70px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Navigation */}
        <div className="flex flex-col gap-6 sm:gap-8 mb-8 sm:mb-16">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              to="/" 
              className="w-10 h-10 sm:w-12 sm:h-12 glass rounded-full flex items-center justify-center text-text-muted hover:text-accent transition-all group border-white/10 active:scale-95"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform sm:w-5 sm:h-5" />
            </Link>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-accent uppercase font-mono">Work Showcase</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.12] sm:leading-tight max-w-2xl text-text-pure tracking-tight">
              Cinematic <span className="text-accent italic font-bold">Masterpieces</span> & Visual Stories
            </h1>
            
            {/* Search */}
            <div className="relative group w-full lg:min-w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3 sm:py-3.5 focus:outline-none focus:border-accent/40 focus:bg-secondary transition-all glass-dark text-text-pure placeholder:text-text-muted text-xs sm:text-sm font-sans"
              />
            </div>
          </div>
        </div>

        {/* Horizontal Category Filters */}
        <div className="flex items-center gap-2 sm:gap-2.5 mb-8 sm:mb-12 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 border shrink-0 whitespace-nowrap active:scale-95 ${
                activeCategory === cat 
                  ? "bg-accent text-primary border-accent glow-sm shadow-md shadow-accent/20" 
                  : "bg-white/5 text-text-muted border-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className={`grid gap-4 sm:gap-6 md:gap-8 ${
            activeCategory === 'Reels' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video, idx) => {
              const youtubeId = getYouTubeId(video.youtubeUrl);
              const ytFallback = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop";
              const displayImage = video.thumbnail || ytFallback;
              
              return (
                <motion.div
                  key={video.id || idx}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className="group cursor-pointer active:scale-[0.98] transition-all"
                  onClick={() => youtubeId && setSelectedVideo({ id: youtubeId, title: video.title })}
                >
                  <div className={`relative rounded-[20px] sm:rounded-[32px] overflow-hidden mb-3 sm:mb-4 border border-white/10 glass-dark glow-sm group-hover:glow-md transition-all duration-500 ${video.category === 'Reels' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                    <img 
                      src={displayImage} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ytFallback;
                      }}
                      alt={video.title} 
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" 
                    />
                    
                    {/* Play Button Overlay (Visible on mobile & desktop hover) */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 sm:bg-black/40 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                      <div className="w-11 h-11 sm:w-16 sm:h-16 bg-accent rounded-full flex items-center justify-center text-primary glow-md scale-90 sm:scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                        <Play fill="currentColor" size={16} className="translate-x-0.5 sm:w-6 sm:h-6" />
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 px-2 py-0.5 sm:px-3 sm:py-1 bg-black/70 backdrop-blur-md rounded-lg text-[8px] sm:text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
                      <Clock size={10} className="text-accent sm:w-3 sm:h-3" />
                      {video.duration || "0:30"}
                    </div>

                    {/* Format Badge */}
                    <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1 bg-accent rounded-lg text-[8px] sm:text-[9px] font-bold text-primary tracking-wider uppercase glow-sm">
                      4K
                    </div>
                  </div>
                  
                  <div className="px-1 sm:px-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] sm:text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-mono">{video.category}</span>
                      <button
                        type="button"
                        className="text-text-muted hover:text-accent transition-colors p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.share) {
                            navigator.share({ title: video.title, url: window.location.href });
                          } else {
                            navigator.clipboard.writeText(video.youtubeUrl || window.location.href);
                            alert("Video link copied to clipboard!");
                          }
                        }}
                        aria-label="Share video"
                      >
                        <Share2 size={13} />
                      </button>
                    </div>
                    <h3 className="text-sm sm:text-lg font-display font-bold mb-1 text-text-pure group-hover:text-accent transition-colors line-clamp-1">{video.title}</h3>
                    <p className="text-[10px] sm:text-xs text-text-soft line-clamp-2 leading-relaxed font-light">{video.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="py-16 sm:py-24 text-center">
            <p className="text-base sm:text-xl text-text-muted font-display italic">No cinematic projects found for this category or search.</p>
            <button 
              onClick={() => { setActiveCategory("Reels"); setSearchQuery(""); }}
              className="mt-4 sm:mt-6 text-accent font-bold hover:underline glow-sm text-xs uppercase tracking-wider font-mono"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal 
        videoId={selectedVideo?.id || null} 
        onClose={() => setSelectedVideo(null)} 
        title={selectedVideo?.title || ""}
      />
    </div>
  );
}
