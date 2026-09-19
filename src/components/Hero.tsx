import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Play, ChevronRight, Star, Users, Award, Sparkles, Film, CheckCircle2 } from "lucide-react";
import heroPoster from "../assets/images/user_hero_poster.png";
import heroPortrait from "../assets/images/user_hero_portrait.jpg";
import { cmsStore } from "../lib/cmsStore";
import { ProfileHeroData, WebsiteContent, StatItem } from "../lib/cmsTypes";

const getSafeHeroImage = (url?: string) => {
  if (!url || typeof url !== "string" || url.trim() === "" || url.includes("postimg.cc")) {
    return heroPoster || heroPortrait;
  }
  return url;
};

export default function Hero() {
  const [profile, setProfile] = useState<ProfileHeroData>(() => cmsStore.getProfile());
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());
  const [stats, setStats] = useState<StatItem[]>(() => cmsStore.getStats());
  const [portraitSrc, setPortraitSrc] = useState<string>(() => getSafeHeroImage(cmsStore.getProfile().portraitUrl));

  useEffect(() => {
    const handleUpdate = () => {
      const p = cmsStore.getProfile();
      setProfile(p);
      setContent(cmsStore.getContent());
      setStats(cmsStore.getStats());
      setPortraitSrc(getSafeHeroImage(p.portraitUrl));
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    window.addEventListener("rh_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
      window.removeEventListener("rh_data_updated", handleUpdate);
    };
  }, []);

  const yearsExp = stats.find(s => s.label.toLowerCase().includes("year"))?.value || "2+";
  const projectsCount = stats.find(s => s.label.toLowerCase().includes("project"))?.value || "183+";
  const happyClientsCount = stats.find(s => s.label.toLowerCase().includes("client"))?.value || "47+";

  return (
    <section id="home" className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center pt-24 sm:pt-32 pb-12 sm:pb-20 overflow-hidden bg-primary">
      {/* Ambient Glows - Optimized with radial gradients */}
      <div className="absolute top-0 right-0 w-[260px] sm:w-[450px] h-[260px] sm:h-[450px] bg-panel/10 rounded-full blur-[50px] sm:blur-[70px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[550px] h-[300px] sm:h-[550px] bg-accent/5 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left"
        >
          {/* Availability & Title Tag */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase font-mono">
              {profile.primaryTitle || content.heroTaglineBadge || "Creative Director & Editor"}
            </span>

            {profile.availableForWork && (
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Available for Projects
              </span>
            )}
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.12] sm:leading-[1.08] mb-4 sm:mb-6 tracking-tight text-text-pure">
            {content.heroHeadingLine1 || "Creative"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-pure via-accent to-accent font-bold">
              {content.heroHeadingLine2 || "Visuals"}
            </span> <br className="hidden sm:inline" />
            {content.heroHeadingLine3 || "for Modern Brands"}
          </h1>
          
          <p className="text-xs sm:text-sm md:text-base text-text-soft mb-6 sm:mb-8 max-w-lg leading-relaxed font-normal">
            {profile.shortBio || content.heroDescription}
          </p>
          
          {/* Action CTAs */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3.5">
            <Link
              to={profile.ctaPrimaryUrl || "/#contact"}
              className="group relative bg-accent hover:bg-accent-hover text-primary font-bold px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden glow-md shadow-lg shadow-accent/20 active:scale-95"
            >
              <span className="z-10 uppercase tracking-wider text-[9px] sm:text-[10px] font-mono">
                {profile.ctaPrimaryText || "Hire Me Now"}
              </span>
              <ChevronRight className="z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to={profile.ctaSecondaryUrl || "/work"}
              className="glass hover:bg-white/10 text-text-pure font-bold px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 border border-accent/20 active:scale-95"
            >
              <span className="uppercase tracking-wider text-[9px] sm:text-[10px] font-mono">
                {profile.ctaSecondaryText || "View My Work"}
              </span>
              <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-text-pure" />
            </Link>
          </div>
          
          {/* Social Proof */}
          <div className="mt-8 sm:mt-12 flex items-center gap-3 sm:gap-6">
            <div className="flex -space-x-2.5 sm:-space-x-3">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
              ].map((src, i) => (
                <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-primary overflow-hidden bg-secondary shadow-md">
                  <img 
                    src={src} 
                    alt="Client" 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 sm:gap-1 text-accent mb-0.5">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={12} fill="currentColor" className="sm:w-3.5 sm:h-3.5" />)}
              </div>
              <p className="text-[9px] sm:text-xs text-text-muted font-medium tracking-wide uppercase font-mono">
                {content.heroSocialProofText || `TRUSTED BY ${happyClientsCount} GLOBAL CLIENTS`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Hero Portrait Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-4 lg:mt-0"
        >
          <div className="relative aspect-[4/5] max-w-[290px] sm:max-w-md mx-auto">
            {/* Ambient Backlight */}
            <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-tr from-accent/20 via-panel/20 to-transparent blur-2xl sm:blur-3xl rounded-[36px] sm:rounded-[48px] z-0 pointer-events-none" />
            <div className="absolute inset-0 bg-secondary/80 rounded-[28px] sm:rounded-[44px] z-0 border border-accent/20 shadow-2xl" />

            {/* Inner Image Frame */}
            <div className="relative z-10 w-full h-full rounded-[28px] sm:rounded-[44px] overflow-hidden border border-white/10 glass-dark bg-secondary/90 flex items-center justify-center">
              <img 
                 src={portraitSrc} 
                 alt={profile.name || "Rehman Hridoy"} 
                 loading="eager"
                 decoding="async"
                 className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105 select-none" 
                 onError={() => {
                   setPortraitSrc(heroPoster || heroPortrait);
                 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Floating Desktop Stats */}
            <div 
              className="absolute -right-4 sm:-right-8 top-1/4 z-20 glass p-3 sm:p-4 rounded-2xl glow-md border border-white/20 hidden sm:block animate-bounce [animation-duration:6s]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-xs text-text-soft font-medium">Experience</p>
                  <p className="text-lg font-bold text-text-pure uppercase">{yearsExp} YEARS</p>
                </div>
              </div>
            </div>

            <div 
              className="absolute -left-4 sm:-left-8 bottom-1/4 z-20 glass p-3 sm:p-4 rounded-2xl glow-md border border-white/20 hidden sm:block animate-bounce [animation-duration:7s]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs text-text-soft font-medium">Projects</p>
                  <p className="text-lg font-bold text-text-pure uppercase">{projectsCount} COMPLETED</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-Only Stat Highlights Strip */}
          <div className="grid grid-cols-2 gap-2 mt-4 sm:hidden max-w-[290px] mx-auto">
            <div className="glass p-2.5 rounded-xl text-center border border-white/10">
              <p className="text-base font-display font-bold text-accent">{yearsExp} YRS</p>
              <p className="text-[7px] text-text-muted uppercase font-mono tracking-widest">Experience</p>
            </div>
            <div className="glass p-2.5 rounded-xl text-center border border-white/10">
              <p className="text-base font-display font-bold text-text-pure">{projectsCount}</p>
              <p className="text-[7px] text-text-muted uppercase font-mono tracking-widest">Masterpieces</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
