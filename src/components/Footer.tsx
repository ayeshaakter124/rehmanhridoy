import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { cmsStore } from "../lib/cmsStore";
import { ProfileHeroData, WebsiteContent } from "../lib/cmsTypes";

export default function Footer() {
  const [profile, setProfile] = useState<ProfileHeroData>(() => cmsStore.getProfile());
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(cmsStore.getProfile());
      setContent(cmsStore.getContent());
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
    };
  }, []);

  const nameParts = (profile.name || "Rehman Hridoy").split(" ");
  const firstName = nameParts[0] || "REHMAN";
  const restName = nameParts.slice(1).join(" ") || "HRIDOY";

  return (
    <footer className="py-12 sm:py-16 border-t border-accent/10 bg-primary overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-10 mb-8 sm:mb-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 glow-sm shadow-md">
              <Play className="text-secondary fill-secondary w-3 h-3 sm:w-3.5 sm:h-3.5 translate-x-0.5" />
            </div>
            <span className="font-display font-bold text-sm sm:text-base tracking-tight text-text-pure uppercase">
              {firstName}<span className="text-accent font-semibold ml-1">{restName}</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-[8px] sm:text-[9px] font-mono font-bold text-text-muted uppercase tracking-[0.25em]">
            <Link to="/#services" className="hover:text-accent transition-colors py-1">Services</Link>
            <Link to="/work" className="hover:text-accent transition-colors py-1">Showcase</Link>
            <Link to="/#testimonials" className="hover:text-accent transition-colors py-1">Reviews</Link>
            <Link to="/#about" className="hover:text-accent transition-colors py-1">The Vision</Link>
            <Link to="/#contact" className="hover:text-accent transition-colors py-1">Connection</Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-5 pt-6 sm:pt-8 border-t border-accent/5">
          <p className="text-[7px] sm:text-[9px] text-text-muted font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-center md:text-left font-mono">
            {content.footerCopyright || `© 2026 ${profile.name.toUpperCase()}. All Rights Reserved.`}{" "}
            <span className="text-accent">{content.footerTagline || "Crafting Excellence."}</span>
          </p>
          <div className="flex items-center gap-4 sm:gap-6 text-[7px] sm:text-[9px] text-text-muted font-bold uppercase tracking-[0.2em] font-mono">
            <Link to="/#contact" className="hover:text-accent transition-colors">Privacy</Link>
            <Link to="/#contact" className="hover:text-accent transition-colors">Terms</Link>
          </div>
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[120px] sm:h-[180px] bg-accent/5 blur-[50px] sm:blur-[70px] rounded-full pointer-events-none opacity-40" />
    </footer>
  );
}
