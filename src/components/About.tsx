import { useState, useEffect } from "react";
import { motion } from "motion/react";
import aboutPortrait from "../assets/images/rehman_about_portrait_1783623356059.jpg";
import { cmsStore } from "../lib/cmsStore";
import { ProfileHeroData, SkillItem, WebsiteContent, StatItem } from "../lib/cmsTypes";

const getSafeAboutImage = (aboutUrl?: string, portraitUrl?: string) => {
  if (aboutUrl && aboutUrl.trim() !== "" && !aboutUrl.includes("postimg.cc")) {
    return aboutUrl;
  }
  if (portraitUrl && portraitUrl.trim() !== "" && !portraitUrl.includes("postimg.cc")) {
    return portraitUrl;
  }
  return aboutPortrait;
};

export default function About() {
  const [profile, setProfile] = useState<ProfileHeroData>(() => cmsStore.getProfile());
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());
  const [skills, setSkills] = useState<SkillItem[]>(() => cmsStore.getSkills().filter(s => s.visible));
  const [stats, setStats] = useState<StatItem[]>(() => cmsStore.getStats());
  const [portraitSrc, setPortraitSrc] = useState<string>(() => 
    getSafeAboutImage(cmsStore.getProfile().aboutPortraitUrl, cmsStore.getProfile().portraitUrl)
  );

  useEffect(() => {
    const handleUpdate = () => {
      const p = cmsStore.getProfile();
      setProfile(p);
      setContent(cmsStore.getContent());
      setSkills(cmsStore.getSkills().filter(s => s.visible));
      setStats(cmsStore.getStats());
      setPortraitSrc(getSafeAboutImage(p.aboutPortraitUrl, p.portraitUrl));
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
    };
  }, []);

  const yearsExp = stats.find(s => s.label.toLowerCase().includes("year"))?.value || "2+";
  const projectsCount = stats.find(s => s.label.toLowerCase().includes("project"))?.value || "183+";
  const happyClientsCount = stats.find(s => s.label.toLowerCase().includes("client"))?.value || "47+";

  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-primary">
      {/* Background Glower */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-panel/5 rounded-full blur-[50px] sm:blur-[70px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            className="relative max-w-[280px] sm:max-w-sm mx-auto lg:max-w-none w-full"
          >
            <div className="absolute inset-0 bg-accent/15 blur-[40px] sm:blur-[60px] rounded-full z-0 opacity-15 pointer-events-none" />
            <div className="relative z-10 aspect-[4/5] w-full min-h-[320px] sm:min-h-[420px] rounded-[24px] sm:rounded-[2rem] overflow-hidden border border-white/10 glass-dark bg-secondary/80 glow-lg group flex items-center justify-center">
              <img 
                src={portraitSrc}
                alt={`${profile.name || "Rehman Hridoy"} - Creative Director`} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 select-none" 
                onError={() => {
                  setPortraitSrc(aboutPortrait);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Experience Tag */}
            <div className="absolute -bottom-2 -right-2 sm:-bottom-5 sm:-right-5 glass p-2.5 sm:p-5 rounded-2xl sm:rounded-[32px] z-20 border border-accent/20 glow-md text-center sm:text-left shadow-xl">
              <p className="text-lg sm:text-2xl font-mono font-bold text-accent tracking-tight leading-none">{yearsExp}</p>
              <p className="text-[7px] sm:text-[9px] font-bold text-text-soft uppercase tracking-[0.25em] sm:tracking-[0.3em] leading-tight mt-1 font-mono">Years Of<br className="hidden sm:block" /> Experience</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center text-left"
          >
            <p className="text-accent font-bold tracking-[0.3em] text-[9px] sm:text-[10px] mb-2 sm:mb-3 uppercase font-mono">
              {content.aboutBadge || "The Creative Narrative"}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3 sm:mb-5 text-text-pure tracking-tight leading-[1.15]">
              {content.aboutHeading || "Mastering the Cinematic Art of Storytelling"}
            </h2>
            <p className="text-xs sm:text-sm md:text-[15px] text-text-soft mb-6 sm:mb-8 leading-relaxed font-normal">
              {profile.fullBio || content.aboutDescription}
            </p>
            
            {/* Skills Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.id || skill.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="glass p-2.5 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-1.5 sm:gap-2 group transition-all duration-300 border border-white/5 hover:border-accent/30 relative overflow-hidden active:scale-95"
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl pointer-events-none" 
                    style={{ backgroundColor: skill.glowColor || "rgba(163, 133, 96, 0.3)" }}
                  />
                  <div 
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-white/5 border border-white/5 group-hover:border-accent/30 p-1.5 flex items-center justify-center relative z-10 transition-all duration-300 group-hover:scale-110 shadow-sm"
                  >
                    {skill.logo ? (
                      <img 
                        src={skill.logo} 
                        alt={skill.name} 
                        className="w-full h-full object-contain filter invert opacity-70 group-hover:opacity-100 transition-all duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-[10px] font-bold font-mono text-accent">
                        {skill.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-text-muted group-hover:text-text-pure uppercase tracking-wider relative z-10 transition-colors text-center font-mono truncate max-w-full">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Quick Metrics */}
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-6 sm:gap-10">
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-text-pure tracking-tight text-glow">{projectsCount}</p>
                <p className="text-[8px] sm:text-[9px] text-text-muted uppercase font-bold tracking-[0.25em] mt-0.5 font-mono">Projects Done</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-text-pure tracking-tight text-glow">{happyClientsCount}</p>
                <p className="text-[8px] sm:text-[9px] text-text-muted uppercase font-bold tracking-[0.25em] mt-0.5 font-mono">Happy Clients</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
