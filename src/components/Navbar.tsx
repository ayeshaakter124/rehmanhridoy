import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Play, ArrowRight, Mail, Phone, MessageCircle } from "lucide-react";
import { cmsStore } from "../lib/cmsStore";
import { ProfileHeroData, ContactInfo } from "../lib/cmsTypes";

const navLinks = [
  { name: "Home", href: "/", number: "01" },
  { name: "Work", href: "/#portfolio", number: "02" },
  { name: "Services", href: "/#services", number: "03" },
  { name: "Reviews", href: "/#testimonials", number: "04" },
  { name: "About", href: "/#about", number: "05" },
  { name: "Contact", href: "/#contact", number: "06" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileHeroData>(() => cmsStore.getProfile());
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => cmsStore.getContactInfo());
  const location = useLocation();

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(cmsStore.getProfile());
      setContactInfo(cmsStore.getContactInfo());
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const nameParts = (profile.name || "Rehman Hridoy").split(" ");
  const firstName = nameParts[0] || "REHMAN";
  const restName = nameParts.slice(1).join(" ") || "HRIDOY";
  const cleanWhatsApp = (contactInfo.whatsapp || "880157735667").replace(/[^0-9]/g, "");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2.5 sm:py-4" : "py-4 sm:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl sm:rounded-3xl transition-all duration-300 ${
            isScrolled 
              ? "glass-dark shadow-2xl border border-accent/20 bg-primary/90 backdrop-blur-xl" 
              : "bg-primary/40 backdrop-blur-md border border-white/5"
          }`}
        >
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-2.5 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 glow-sm shadow-md shadow-accent/20">
              <Play className="text-secondary fill-secondary w-3 h-3 sm:w-3.5 sm:h-3.5 translate-x-0.5" />
            </div>
            <span className="font-display font-bold text-sm sm:text-base tracking-tight text-text-pure uppercase">
              {firstName}<span className="text-accent font-semibold ml-1">{restName}</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-all relative group py-1 ${
                  location.pathname === link.href ? "text-accent" : "text-text-muted hover:text-accent"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-accent transition-all duration-300 ${
                  location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            ))}
            <Link 
              to="/#contact"
              className="bg-accent hover:bg-accent-hover text-primary font-mono font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider transition-all duration-300 glow-sm hover:glow-md scale-100 hover:scale-105 active:scale-95 shadow-lg shadow-accent/20"
            >
              Get In Touch
            </Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden w-10 h-10 rounded-xl glass flex items-center justify-center text-accent active:scale-95 transition-all border border-accent/20 hover:bg-accent/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden bg-primary/98 backdrop-blur-2xl flex flex-col justify-between p-6 pt-24 overflow-y-auto"
          >
            {/* Ambient Background Light */}
            <div className="absolute top-1/4 right-0 w-60 h-60 bg-accent/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute bottom-10 left-0 w-56 h-56 bg-panel/15 rounded-full blur-[40px] pointer-events-none" />

            {/* Navigation Links */}
            <div className="flex flex-col gap-3 my-auto relative z-10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-accent mb-2">
                Navigation Menu
              </span>

              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 border-b border-white/5 group active:bg-accent/5 px-2 rounded-xl transition-all"
                  >
                    <span className="text-2xl sm:text-3xl font-display font-medium text-text-pure group-hover:text-accent transition-colors flex items-center gap-3">
                      <span className="text-[10px] font-mono text-accent/60 font-bold">{link.number}</span>
                      {link.name}
                    </span>
                    <ArrowRight size={16} className="text-accent/40 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Quick Action Footer */}
            <div className="pt-6 border-t border-white/10 space-y-3 relative z-10">
              <Link
                to="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-accent hover:bg-accent-hover text-primary font-bold py-3.5 rounded-2xl text-center text-xs uppercase tracking-widest flex items-center justify-center gap-2 glow-md shadow-xl shadow-accent/20 active:scale-95 transition-all"
              >
                <span>Inaugurate Project</span>
                <ArrowRight size={14} />
              </Link>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl glass border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:${contactInfo.email || "reehmanhridoy@gmail.com"}`}
                  className="py-3 px-3 rounded-xl glass border border-white/10 text-text-soft text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Mail size={14} />
                  <span>Email Me</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
