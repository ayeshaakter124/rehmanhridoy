import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Film, 
  Play, 
  Layers, 
  Sparkles, 
  Video, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from "lucide-react";
import { cmsStore } from "../lib/cmsStore";
import { ServiceItem, WebsiteContent } from "../lib/cmsTypes";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Film,
  Play,
  Layers,
  Sparkles,
  Video,
  Zap,
};

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>(() => 
    cmsStore.getServices().filter(s => s.visible)
  );
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());

  useEffect(() => {
    const handleUpdate = () => {
      setServices(cmsStore.getServices().filter(s => s.visible));
      setContent(cmsStore.getContent());
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
    };
  }, []);

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-16 sm:py-24 bg-primary relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/3 left-0 w-[240px] sm:w-[400px] h-[240px] sm:h-[400px] bg-panel/10 rounded-full blur-[50px] sm:blur-[70px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-accent/5 rounded-full blur-[50px] sm:blur-[70px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold tracking-[0.3em] text-[9px] sm:text-[10px] mb-2 uppercase font-mono"
          >
            {content.servicesBadge || "Elite Capabilities"}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-text-pure tracking-tight leading-tight max-w-3xl mx-auto"
          >
            {content.servicesHeading || "Creative Solutions & Production Packages"}
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto mt-4 sm:mt-6"
          />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, idx) => {
            const Icon = ICON_MAP[service.iconName] || Film;
            return (
              <motion.div
                key={service.id || service.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/5 hover:border-accent/30 transition-all duration-500 glow-sm hover:glow-md relative group overflow-hidden bg-secondary/40"
              >
                {/* Subtle top gradient on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div>
                  {/* Icon & Price Header */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent group-hover:scale-110 group-hover:bg-accent group-hover:text-primary transition-all duration-300 shadow-md shadow-accent/10">
                      <Icon size={22} />
                    </div>

                    {service.priceText && (
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent text-[10px] font-bold font-mono uppercase tracking-wider">
                        {service.priceText}
                      </span>
                    )}
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-lg sm:text-xl font-display font-bold text-text-pure mb-2.5 group-hover:text-accent transition-colors tracking-tight">
                    {service.title}
                  </h3>
                  
                  {service.shortDesc && (
                    <p className="text-xs sm:text-sm text-text-soft leading-relaxed mb-6 font-normal">
                      {service.shortDesc}
                    </p>
                  )}

                  {/* Feature Checklist */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2.5 mb-8 pt-4 border-t border-white/5">
                      {service.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
                          <span className="text-xs text-text-soft font-normal leading-tight">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action CTA */}
                <div className="pt-4 border-t border-white/5">
                  <Link
                    to="/#contact"
                    className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-accent text-text-pure hover:text-primary font-bold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 transition-all duration-300 border border-white/10 hover:border-accent active:scale-95 shadow-sm"
                  >
                    <span>{service.ctaText || "Inquire Now"}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
