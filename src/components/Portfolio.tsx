import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Play, ArrowRight, Sparkles } from "lucide-react";
import VideoModal from "./VideoModal";
import { cmsStore } from "../lib/cmsStore";
import { ProjectItem, WebsiteContent } from "../lib/cmsTypes";

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

const BASE_CATEGORIES = ["Reels", "Commercial", "Saas Animation", "Documentary", "Motion Graphics"];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("Reels");
  const [selectedVideo, setSelectedVideo] = useState<{ id: string, title: string } | null>(null);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(() => 
    cmsStore.getProjects().filter(p => p.published)
  );
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());

  useEffect(() => {
    const handleUpdate = () => {
      setProjectsList(cmsStore.getProjects().filter(p => p.published));
      setContent(cmsStore.getContent());
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
      ...projectsList.map(p => p.category).filter(Boolean)
    ])
  );

  const filteredProjects = projectsList.filter(p => p.category === activeTab);

  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-primary relative overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-panel/5 rounded-full blur-[50px] sm:blur-[70px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-16 gap-5 sm:gap-8">
          <div>
            <p className="text-accent font-bold tracking-[0.3em] text-[9px] sm:text-[10px] mb-1.5 sm:mb-2 uppercase font-mono">
              {content.portfolioBadge || "Selected Masterpieces"}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text-pure tracking-tight leading-tight">
              {content.portfolioHeading || "Cinematic Showcase"}
            </h2>
          </div>
          
          {/* Mobile Smooth Horizontal Category Pills */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 border shrink-0 whitespace-nowrap active:scale-95 ${
                  activeTab === cat 
                    ? "bg-accent text-primary border-accent glow-sm shadow-md shadow-accent/25" 
                    : "bg-secondary/70 text-text-muted border-white/5 hover:border-accent/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className={`grid gap-4 sm:gap-6 md:gap-8 ${
            activeTab === 'Reels' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className={`group relative rounded-[20px] sm:rounded-[36px] overflow-hidden bg-secondary cursor-pointer glow-sm hover:glow-md active:scale-[0.98] transition-all duration-500 border border-accent/15 ${
                  project.category === 'Reels' ? 'aspect-[9/16]' : 'aspect-video'
                }`}
                onClick={() => {
                  const id = getYouTubeId(project.youtubeUrl);
                  if (id) setSelectedVideo({ id, title: project.title });
                }}
              >
                <img 
                  src={project.thumbnail} 
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                
                {/* Visual Quality Pill */}
                <div className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full glass text-[7px] sm:text-[9px] font-bold tracking-widest uppercase opacity-90 z-20 border-accent/20">
                  4K
                </div>

                {/* Mobile & Desktop Touch-Optimized Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 p-3.5 sm:p-7 flex flex-col justify-end">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-accent text-[7px] sm:text-[9px] font-bold tracking-[0.25em] uppercase mb-0.5 sm:mb-1 font-mono truncate">
                        {project.category}
                      </p>
                      <h3 className="text-xs sm:text-lg font-display font-bold text-text-pure tracking-tight line-clamp-1 group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-text-soft text-[9px] sm:text-xs font-light leading-relaxed line-clamp-1 sm:line-clamp-2 mt-0.5 hidden sm:block">
                          {project.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="w-8 h-8 sm:w-11 sm:h-11 bg-accent rounded-full flex items-center justify-center text-primary group-hover:scale-110 active:scale-90 transition-transform duration-300 glow-md shadow-xl shrink-0">
                      <Play fill="currentColor" size={13} className="translate-x-0.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <div className="mt-10 sm:mt-16 text-center">
          <Link 
            to="/work" 
            className="inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-3.5 glass border border-accent/25 hover:border-accent rounded-full group transition-all duration-300 glow-sm hover:glow-md uppercase tracking-widest text-[9px] sm:text-[10px] font-bold active:scale-95 shadow-md"
          >
            <span className="text-text-pure">View All Work</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Video Modal */}
        <VideoModal 
          videoId={selectedVideo?.id || null} 
          onClose={() => setSelectedVideo(null)} 
          title={selectedVideo?.title || ""}
        />
      </div>
    </section>
  );
}
