import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Building2 } from "lucide-react";
import { cmsStore } from "../lib/cmsStore";
import { ClientBrand } from "../lib/cmsTypes";

export default function Brands() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [clients, setClients] = useState<ClientBrand[]>(() => 
    cmsStore.getClients().filter(c => c.visible !== false)
  );

  useEffect(() => {
    const handleUpdate = () => {
      setClients(cmsStore.getClients().filter(c => c.visible !== false));
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
    };
  }, []);

  if (clients.length === 0) return null;

  return (
    <section ref={ref} id="brands" className="py-16 sm:py-20 relative overflow-hidden bg-primary">
      {/* Subtle divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-accent/30" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-accent font-mono mb-8 font-bold"
          >
            Trusted by Ambitious Brands & Digital Creators
          </motion.p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {clients.map((client, i) => (
              <motion.div
                key={client.id || client.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass px-5 py-3.5 sm:px-7 sm:py-4 rounded-2xl flex items-center gap-3 border border-white/5 hover:border-accent/30 transition-all duration-300 group glow-sm hover:glow-md"
              >
                {client.logo ? (
                  <img 
                    src={client.logo} 
                    alt={client.name}
                    className="h-5 sm:h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Building2 size={18} className="text-accent/60 group-hover:text-accent transition-colors" />
                )}
                <span className="font-display text-xs sm:text-sm font-bold text-text-soft group-hover:text-text-pure transition-colors">
                  {client.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
