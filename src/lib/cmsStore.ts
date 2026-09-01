/**
 * Central Reactive CMS Store for Full Portfolio Management
 * Connected to LocalStorage (instant cache) & Supabase REST API (global cloud persistence).
 */

import {
  CMSState,
  ProfileHeroData,
  ExperienceItem,
  ProjectItem,
  VideoItem,
  ClientBrand,
  StatItem,
  SkillItem,
  ToolItem,
  ServiceItem,
  TestimonialItem,
  SocialLinkItem,
  ContactInfo,
  WebsiteContent,
  SectionConfig,
  SeoSettings,
  MediaItem,
  ContactMessage,
} from "./cmsTypes";
import { cloudStore } from "./cloudStore";

const CMS_STORAGE_PREFIX = "rh_cms_v2_";

export const DEFAULT_CMS_STATE: CMSState = {
  profile: {
    name: "Rehman Hridoy",
    primaryTitle: "SR. VIDEO EDITOR & CREATIVE DIRECTOR",
    alternativeTitles: [
      "Senior Video Editor",
      "Motion Designer",
      "Creative Director",
      "Visual Storyteller",
    ],
    headline: "Creative Visuals for Modern Brands",
    subheadline: "Mastering the Cinematic Art of Storytelling",
    shortBio: "I transform complex concepts into clean and compelling visuals, which make brands more engaging and credible. My visual content is designed to capture attention, build trust, and give your brand a special status.",
    fullBio: "Based in the pulse of the digital design landscape, I specialize in distilling complex narratives into visual poetry. My journey is anchored in film aesthetics, evolving into a dedicated mission to help modern brands and creators define their visual legacy.",
    location: "Dhaka, Bangladesh (Working Globally)",
    email: "reehmanhridoy@gmail.com",
    phone: "+880157735667",
    whatsapp: "+880157735667",
    portraitUrl: "",
    aboutPortraitUrl: "",
    coverImageUrl: "",
    resumeUrl: "",
    ctaPrimaryText: "Hire Me Now",
    ctaPrimaryUrl: "/#contact",
    ctaSecondaryText: "View My Work",
    ctaSecondaryUrl: "/work",
    availableForWork: true,
  },

  experiences: [
    {
      id: "exp_1",
      year: "Present",
      role: "MOTION DESIGNER",
      company: "Srizonshil",
      description: "Crafting high-octane visual experiences and viral commercial content for digital-first audiences, focusing on rhythmic precision and narrative impact.",
      order: 1,
      currentlyWorking: true,
    },
    {
      id: "exp_2",
      year: "2025",
      role: "SENIOR VIDEO EDITOR",
      company: "D Studio",
      description: "Defining the future of luxury cinematic storytelling for global fashion and tech brands, overseeing high-end visual campaigns from concept to final delivery.",
      order: 2,
    },
    {
      id: "exp_3",
      year: "2024",
      role: "JUNIOR CINEMATOGRAPHER",
      company: "LUMINA ART LAB",
      description: "Pioneering experimental visual languages through motion design and digital art installations, collaborating with international artists on immersive projects.",
      order: 3,
    },
  ],

  projects: [
    {
      id: "proj_1",
      title: "Real Estate Commercial",
      slug: "real-estate-commercial",
      category: "Commercial",
      description: "Cinematic real estate showcase for high-end luxury properties with immersive camera movements.",
      thumbnail: "https://i.postimg.cc/CLhKLMLm/video-captu.png",
      youtubeUrl: "https://www.youtube.com/embed/fKsmQyZc9QE?si=6wwK2edJFOEFsn1n",
      duration: "2:15",
      role: "Lead Editor & Colorist",
      clientName: "Luxury Living Properties",
      softwareUsed: ["Premiere Pro", "DaVinci Resolve"],
      featured: true,
      published: true,
      order: 1,
    },
    {
      id: "proj_2",
      title: "Laptop Review Reel",
      slug: "laptop-review-reel",
      category: "Reels",
      description: "High-retention tech review with dynamic cuts, typography pop-ups, and custom sound design.",
      thumbnail: "https://i.postimg.cc/vZMXF08T/video-capture-t0009-54seg-3118.png",
      youtubeUrl: "https://www.youtube.com/embed/YMvdoeu4CIs?rel=0",
      duration: "0:50",
      role: "Short-form Creative Editor",
      clientName: "TechVibe Global",
      softwareUsed: ["Premiere Pro", "After Effects"],
      featured: true,
      published: true,
      order: 2,
    },
    {
      id: "proj_3",
      title: "Google Lens Concept",
      slug: "google-lens-concept",
      category: "Saas Animation",
      description: "Clean SaaS motion graphics and UI showcase demonstrating real-world visual search interactions.",
      thumbnail: "https://i.postimg.cc/ydSwHbGG/2v-WH764AUE8-HD.jpg",
      youtubeUrl: "https://www.youtube.com/embed/2vWH764AUE8?rel=0",
      duration: "1:30",
      role: "Motion Designer",
      softwareUsed: ["After Effects", "Figma"],
      featured: true,
      published: true,
      order: 3,
    },
    {
      id: "proj_4",
      title: "Bangladesh Growth Infographic",
      slug: "bangladesh-growth-infographic",
      category: "Motion Graphics",
      description: "Dynamic corporate motion graphics and statistical visualization designed for Renata Ltd.",
      thumbnail: "https://i.postimg.cc/L6m0C5mD/dc-TUgs-XTc-QI-HD.jpg",
      youtubeUrl: "https://www.youtube.com/embed/dcTUgsXTcQI?rel=0",
      duration: "1:15",
      role: "Infographic Animator",
      clientName: "Renata Ltd.",
      softwareUsed: ["After Effects", "Illustrator"],
      featured: true,
      published: true,
      order: 4,
    },
    {
      id: "proj_5",
      title: "Colmi Watch Review",
      slug: "colmi-watch-review",
      category: "Reels",
      description: "High-energy smartwatch product showcase and feature breakdown built for viral TikTok & Instagram reels.",
      thumbnail: "https://i.postimg.cc/MpbHWcyZ/video-capture-t0001-11seg-2351.png",
      youtubeUrl: "https://www.youtube.com/embed/HVlWqPzX9eA?rel=0",
      duration: "0:45",
      role: "Product Video Editor",
      featured: true,
      published: true,
      order: 5,
    },
    {
      id: "proj_6",
      title: "Cyberpunk Glitch Edit",
      slug: "cyberpunk-glitch-edit",
      category: "Motion Graphics",
      description: "Complex glitch effects, chromatic aberration, and futuristic cyberpunk typography experiment.",
      thumbnail: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop",
      youtubeUrl: "https://www.youtube.com/watch?v=BvXGPhE-Tto",
      duration: "0:30",
      role: "VFX & Sound Designer",
      featured: true,
      published: true,
      order: 6,
    },
    {
      id: "proj_7",
      title: "Fashion & Clothing Ad",
      slug: "fashion-clothing-ad",
      category: "Reels",
      description: "High-fashion viral apparel reel with fast pacing, seamless whip pans, and rhythmic transitions.",
      thumbnail: "https://i.postimg.cc/HxL2gcPt/video-capture-t0008-54seg-9456.png",
      youtubeUrl: "https://www.youtube.com/embed/r4FmQWtIgQM?rel=0",
      duration: "0:40",
      role: "Commercial Editor",
      featured: true,
      published: true,
      order: 7,
    },
    {
      id: "proj_8",
      title: "Cosmetic Commercial Ad",
      slug: "cosmetic-commercial-ad",
      category: "Reels",
      description: "Luxury cosmetic brand promo featuring sleek skin retouching, macro cuts, and color grading.",
      thumbnail: "https://i.postimg.cc/SR67L6XS/video-capture-t0042-74seg-2887.png",
      youtubeUrl: "https://www.youtube.com/embed/8nDc0bLlMz8?rel=0",
      duration: "0:35",
      role: "Colorist & Editor",
      featured: true,
      published: true,
      order: 8,
    },
    {
      id: "proj_9",
      title: "Podcast Hook (Mindset)",
      slug: "podcast-hook-mindset",
      category: "Commercial",
      description: "Viral podcast hook edit engineered for maximum audience retention on YouTube Shorts.",
      thumbnail: "https://i.postimg.cc/CLh1fT25/maxresdefault.jpg",
      youtubeUrl: "https://www.youtube.com/embed/0cbrRER0xzg?si=Icr4sAryqEgsa9Hp",
      duration: "1:00",
      role: "Retention Specialist",
      featured: true,
      published: true,
      order: 9,
    },
    {
      id: "proj_10",
      title: "Podcast Hook (Psychology)",
      slug: "podcast-hook-psychology",
      category: "Commercial",
      description: "Engaging podcast short with dynamic animated captions, sound effects, and B-roll inserts.",
      thumbnail: "https://i.postimg.cc/rFVmtXPb/maxresdefault-(1).jpg",
      youtubeUrl: "https://www.youtube.com/embed/u2rpS7niDXw?si=53IG2DnTF6ZIXIVv",
      duration: "1:20",
      role: "Short-form Producer",
      featured: true,
      published: true,
      order: 10,
    },
  ],

  videos: [
    {
      id: "vid_1",
      title: "Luxury Real Estate Film",
      youtubeUrl: "https://www.youtube.com/embed/fKsmQyZc9QE?si=6wwK2edJFOEFsn1n",
      thumbnail: "https://i.postimg.cc/CLhKLMLm/video-captu.png",
      category: "Commercial",
      client: "Luxury Living",
      duration: "2:15",
      qualityBadge: "4K 60FPS",
      featured: true,
      published: true,
      order: 1,
    },
    {
      id: "vid_2",
      title: "Next-Gen Tech Review Reel",
      youtubeUrl: "https://www.youtube.com/embed/YMvdoeu4CIs?rel=0",
      thumbnail: "https://i.postimg.cc/vZMXF08T/video-capture-t0009-54seg-3118.png",
      category: "Reels",
      client: "TechVibe",
      duration: "0:50",
      qualityBadge: "4K 60FPS",
      featured: true,
      published: true,
      order: 2,
    },
    {
      id: "vid_3",
      title: "Corporate Growth Motion Graphics",
      youtubeUrl: "https://www.youtube.com/embed/dcTUgsXTcQI?rel=0",
      thumbnail: "https://i.postimg.cc/L6m0C5mD/dc-TUgs-XTc-QI-HD.jpg",
      category: "Motion Graphics",
      client: "Renata Ltd.",
      duration: "1:15",
      qualityBadge: "4K 60FPS",
      featured: true,
      published: true,
      order: 3,
    },
    {
      id: "vid_4",
      title: "Smartwatch Viral Commercial",
      youtubeUrl: "https://www.youtube.com/embed/HVlWqPzX9eA?rel=0",
      thumbnail: "https://i.postimg.cc/MpbHWcyZ/video-capture-t0001-11seg-2351.png",
      category: "Reels",
      client: "Colmi",
      duration: "0:45",
      qualityBadge: "4K 60FPS",
      featured: true,
      published: true,
      order: 4,
    },
  ],

  clients: [
    {
      id: "client_1",
      name: "Srizonshil",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobe.svg",
      description: "Digital media company",
      projectCount: "40+ Videos",
      featured: true,
      order: 1,
    },
    {
      id: "client_2",
      name: "D Studio",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vimeo.svg",
      description: "Luxury fashion studio",
      projectCount: "25+ Campaigns",
      featured: true,
      order: 2,
    },
    {
      id: "client_3",
      name: "Renata Ltd.",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/framer.svg",
      description: "Corporate healthcare brand",
      projectCount: "12+ Animations",
      featured: true,
      order: 3,
    },
    {
      id: "client_4",
      name: "Colmi Global",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg",
      description: "Smart wearable tech",
      projectCount: "18+ Reels",
      featured: true,
      order: 4,
    },
  ],

  stats: [
    {
      id: "stat_1",
      label: "Years Of Experience",
      value: "2+",
      detail: "Active production experience with top brands.",
      iconName: "Award",
      order: 1,
      visible: true,
    },
    {
      id: "stat_2",
      label: "Projects Completed",
      value: "183+",
      detail: "High-retention commercials, reels, and SaaS videos.",
      iconName: "Film",
      order: 2,
      visible: true,
    },
    {
      id: "stat_3",
      label: "Happy Clients",
      value: "47+",
      detail: "Worldwide creators, agencies, and businesses.",
      iconName: "Users",
      order: 3,
      visible: true,
    },
    {
      id: "stat_4",
      label: "Higher Conversion",
      value: "85%",
      detail: "On average for client commercial campaigns.",
      iconName: "TrendingUp",
      order: 4,
      visible: true,
    },
    {
      id: "stat_5",
      label: "Organic Growth",
      value: "+200%",
      detail: "Growth average for client social channels.",
      iconName: "CheckCircle2",
      order: 5,
      visible: true,
    },
    {
      id: "stat_6",
      label: "Client Satisfaction",
      value: "99%",
      detail: "Positive feedback and repeat project rate.",
      iconName: "Heart",
      order: 6,
      visible: true,
    },
  ],

  skills: [
    {
      id: "skill_1",
      name: "Premiere Pro",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobepremierepro.svg",
      category: "Editing",
      level: 98,
      glowColor: "rgba(163, 133, 96, 0.4)",
      order: 1,
      visible: true,
    },
    {
      id: "skill_2",
      name: "After Effects",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobeaftereffects.svg",
      category: "Motion",
      level: 92,
      glowColor: "rgba(163, 133, 96, 0.3)",
      order: 2,
      visible: true,
    },
    {
      id: "skill_3",
      name: "Photoshop",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobephotoshop.svg",
      category: "Design",
      level: 88,
      glowColor: "rgba(163, 133, 96, 0.2)",
      order: 3,
      visible: true,
    },
    {
      id: "skill_4",
      name: "DaVinci Resolve",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/davinciresolve.svg",
      category: "Color",
      level: 90,
      glowColor: "rgba(163, 133, 96, 0.4)",
      order: 4,
      visible: true,
    },
    {
      id: "skill_5",
      name: "Cinema 4D",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cinema4d.svg",
      category: "3D",
      level: 78,
      glowColor: "rgba(163, 133, 96, 0.2)",
      order: 5,
      visible: true,
    },
    {
      id: "skill_6",
      name: "Figma",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/figma.svg",
      category: "Design",
      level: 85,
      glowColor: "rgba(163, 133, 96, 0.3)",
      order: 6,
      visible: true,
    },
  ],

  tools: [
    { id: "tool_1", name: "Adobe Premiere", category: "Video Editing", experienceLevel: "Master", order: 1, visible: true },
    { id: "tool_2", name: "After Effects", category: "VFX & Motion", experienceLevel: "Advanced", order: 2, visible: true },
    { id: "tool_3", name: "DaVinci Resolve", category: "Color Grading", experienceLevel: "Master", order: 3, visible: true },
    { id: "tool_4", name: "CapCut Pro", category: "Viral Reels", experienceLevel: "Expert", order: 4, visible: true },
    { id: "tool_5", name: "Adobe Photoshop", category: "Thumbnails & Art", experienceLevel: "Advanced", order: 5, visible: true },
    { id: "tool_6", name: "Cinema 4D", category: "3D Elements", experienceLevel: "Intermediate", order: 6, visible: true },
    { id: "tool_7", name: "Figma", category: "UI & Layout", experienceLevel: "Advanced", order: 7, visible: true },
    { id: "tool_8", name: "Frame.io", category: "Collaboration", experienceLevel: "Daily Workflow", order: 8, visible: true },
  ],

  services: [
    {
      id: "serv_1",
      title: "Commercial Video Ads",
      iconName: "Film",
      shortDesc: "High-end cinematic commercials tailored for brand launches, products, and conversions.",
      features: ["Script & Storyboarding", "Color Grading in DaVinci", "Sound Design & Foley", "4K Mastering"],
      priceText: "Custom Quote",
      ctaText: "Inquire Now",
      order: 1,
      visible: true,
    },
    {
      id: "serv_2",
      title: "Viral Reels & Shorts",
      iconName: "Play",
      shortDesc: "Data-backed short-form video editing designed for maximum viewer retention and algorithm reach.",
      features: ["Hook Optimization", "Kinetic Typography", "Engaging Sound Effects", "Fast 24-48h Delivery"],
      priceText: "Monthly Package",
      ctaText: "Start Reels",
      order: 2,
      visible: true,
    },
    {
      id: "serv_3",
      title: "SaaS & Motion Graphics",
      iconName: "Layers",
      shortDesc: "Crisp animated explainer videos and UI simulations that convert visitors into users.",
      features: ["Custom 2D/3D Assets", "UI Interaction Mockups", "Logo Animation", "Clean Soundscapes"],
      priceText: "Per Project",
      ctaText: "Request Demo",
      order: 3,
      visible: true,
    },
    {
      id: "serv_4",
      title: "Color Grading & VFX",
      iconName: "Sparkles",
      shortDesc: "Hollywood-grade color grading, skin tone refinement, screen replacements, and visual effects.",
      features: ["DaVinci Color Pipeline", "Clean Look Creation", "Object Removal & Cleanup", "Film Grain & Halation"],
      priceText: "Per Minute / Cut",
      ctaText: "Color Session",
      order: 4,
      visible: true,
    },
  ],

  testimonials: [
    {
      id: "test_1",
      name: "Cozy",
      role: "Head Chef",
      company: "Italian Bistro",
      text: "Rehman's video work captured the true culinary spirit of our restaurant. Engagement on our promotions exploded right after release.",
      image: "https://i.postimg.cc/t4mYjS24/video-capture-t0006-51seg-3115.png",
      youtubeUrl: "https://www.youtube.com/embed/1YlvpCCTWls?rel=0",
      rating: 5,
      featured: true,
      visible: true,
      order: 1,
    },
    {
      id: "test_2",
      name: "Marcus Chen",
      role: "Tech Influencer",
      company: "TechNexus",
      text: "My retention rates skyrocketed by 40% in just one month of working together. Fast, reliable, and incredibly creative with hooks.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
      rating: 5,
      featured: true,
      visible: true,
      order: 2,
    },
    {
      id: "test_3",
      name: "Elena Rodriguez",
      role: "Marketing Director",
      company: "Luxe Fashion Co.",
      text: "A master of storytelling. Our commercial looked like a high-budget Hollywood production. The flow and color were impeccable.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
      youtubeUrl: "https://www.youtube.com/watch?v=F3SpxOLeq0U",
      rating: 5,
      featured: true,
      visible: true,
      order: 3,
    },
  ],

  socialLinks: [
    {
      id: "soc_1",
      platform: "LinkedIn",
      url: "https://linkedin.com/in/rehmanhridoy",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/linkedin.svg",
      glowColor: "rgba(163, 133, 96, 0.4)",
      visible: true,
      order: 1,
    },
    {
      id: "soc_2",
      platform: "Instagram",
      url: "https://www.instagram.com/rehman_hridoy/",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg",
      glowColor: "rgba(163, 133, 96, 0.3)",
      visible: true,
      order: 2,
    },
    {
      id: "soc_3",
      platform: "WhatsApp",
      url: "https://wa.me/880157735667",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/whatsapp.svg",
      glowColor: "rgba(163, 133, 96, 0.4)",
      visible: true,
      order: 3,
    },
    {
      id: "soc_4",
      platform: "Facebook",
      url: "https://www.facebook.com/HRlD0Y",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/facebook.svg",
      glowColor: "rgba(163, 133, 96, 0.3)",
      visible: true,
      order: 4,
    },
  ],

  contactInfo: {
    email: "reehmanhridoy@gmail.com",
    phone: "+880157735667",
    whatsapp: "+880157735667",
    address: "Dhaka, Bangladesh",
    heading: "Let's Compose Your Masterpiece",
    subheading: "The Final Frontier",
    description: "Every legacy begins with an inquiry. Reach out today for a bespoke creative consultation. Let’s draft an enduring digital odyssey.",
    ctaText: "Inaugurate Project",
  },

  content: {
    heroTaglineBadge: "SR. VIDEO EDITOR & CREATIVE DIRECTOR",
    heroHeadingLine1: "Creative",
    heroHeadingLine2: "Visuals",
    heroHeadingLine3: "for Modern Brands",
    heroDescription: "I transform complex concepts into clean and compelling visuals, which make brands more engaging and credible. My visual content is designed to capture attention, build trust, and give your brand a special status.",
    heroSocialProofText: "TRUSTED BY 47+ GLOBAL CLIENTS",

    aboutBadge: "The Creative Narrative",
    aboutHeading: "Mastering the Cinematic Art of Storytelling",
    aboutDescription: "Based in the pulse of the digital design landscape, I specialize in distilling complex narratives into visual poetry. My journey is anchored in film aesthetics, evolving into a dedicated mission to help modern brands and creators define their visual legacy.",

    portfolioBadge: "Selected Masterpieces",
    portfolioHeading: "Cinematic Showcase",
    portfolioSubtitle: "Explore high-octane commercial edits, retention-engineered reels, and motion designs.",

    servicesBadge: "Elite Capabilities",
    servicesHeading: "Creative Solutions & Production Packages",

    whyHireBadge: "Distinctive Advantages",
    whyHireHeading: "I Don’t Just Edit, I Build Experiences",
    whyHirePillars: [
      { title: "Story-Driven Editing", text: "Every frame is chosen to reinforce your brand's unique narrative and mission." },
      { title: "High-Retention Techniques", text: "I use data-backed editing patterns to keep viewers watching from start to finish." },
      { title: "Technical Excellence", text: "Mastery of Premiere Pro, After Effects, and DaVinci Resolve for top-tier results." },
    ],

    journeyBadge: "The Evolution",
    journeyHeading: "THE JOURNEY",

    testimonialsBadge: "Voices of Impact",
    testimonialsHeading: "Client Reviews & Testimonials",

    contactBadge: "The Final Frontier",
    contactHeading: "Let's Compose Your Masterpiece",
    contactDescription: "Every legacy begins with an inquiry. Reach out today for a bespoke creative consultation. Let’s draft an enduring digital odyssey.",

    footerTagline: "Crafting Excellence.",
    footerCopyright: "© 2026 REHMAN HRIDOY. All Rights Reserved.",
  },

  sections: [
    { id: "hero", name: "Hero / Introduction", visible: true, order: 1 },
    { id: "portfolio", name: "Portfolio Showcase", visible: true, order: 2 },
    { id: "brands", name: "Client Brand Partners", visible: true, order: 3 },
    { id: "services", name: "Services & Capabilities", visible: true, order: 4 },
    { id: "testimonials", name: "Client Reviews & Testimonials", visible: true, order: 5 },
    { id: "whyHire", name: "Why Hire Me / Key Stats", visible: true, order: 6 },
    { id: "about", name: "About Me & Narrative", visible: true, order: 7 },
    { id: "journey", name: "Career Journey Timeline", visible: true, order: 8 },
    { id: "contact", name: "Contact & Connection", visible: true, order: 9 },
  ],

  seo: {
    siteTitle: "Rehman Hridoy | Sr. Video Editor & Creative Director",
    metaDescription: "Professional Video Editor & Creative Director specializing in commercial ads, viral reels, SaaS motion graphics, and cinematic video editing.",
    keywords: ["Video Editor", "Rehman Hridoy", "Creative Director", "Commercials", "Reels", "Motion Graphics", "DaVinci Resolve", "Premiere Pro"],
    ogImage: "https://i.postimg.cc/CLhKLMLm/video-captu.png",
    socialShareTitle: "Rehman Hridoy | Sr. Video Editor & Creative Director",
    socialShareDescription: "Crafting high-octane visual experiences and viral commercial content for digital-first brands.",
    author: "Rehman Hridoy",
  },

  media: [
    {
      id: "med_1",
      title: "Real Estate Commercial Thumbnail",
      url: "https://i.postimg.cc/CLhKLMLm/video-captu.png",
      type: "image",
      category: "Project Thumbnails",
      createdAt: new Date().toISOString(),
    },
    {
      id: "med_2",
      title: "Tech Review Reel Thumbnail",
      url: "https://i.postimg.cc/vZMXF08T/video-capture-t0009-54seg-3118.png",
      type: "image",
      category: "Project Thumbnails",
      createdAt: new Date().toISOString(),
    },
  ],

  messages: [
    {
      id: "msg_1",
      name: "Alex Vance",
      email: "alex@vancemedia.co",
      ventureNature: "Commercial Masterpiece",
      message: "Hey Rehman! We are launching a new tech gadget and need a 60-second high energy commercial ad. Loved your podcast hook edits!",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      read: false,
    },
  ],
};

const notifyUpdate = () => {
  window.dispatchEvent(new Event("cms_data_updated"));
};

export const cmsStore = {
  // --- Generic Get / Save ---
  get<K extends keyof CMSState>(key: K): CMSState[K] {
    try {
      const saved = localStorage.getItem(`${CMS_STORAGE_PREFIX}${key}`);
      return saved ? JSON.parse(saved) : DEFAULT_CMS_STATE[key];
    } catch {
      return DEFAULT_CMS_STATE[key];
    }
  },

  set<K extends keyof CMSState>(key: K, data: CMSState[K]): CMSState[K] {
    localStorage.setItem(`${CMS_STORAGE_PREFIX}${key}`, JSON.stringify(data));
    notifyUpdate();
    cloudStore.syncKey(key, data);
    return data;
  },

  // --- Entity Helpers ---
  getProfile(): ProfileHeroData { 
    const saved = this.get("profile");
    return { ...DEFAULT_CMS_STATE.profile, ...(saved || {}) };
  },
  saveProfile(data: Partial<ProfileHeroData>): ProfileHeroData {
    const current = this.getProfile();
    const updated = { ...current, ...data };
    
    // Two-way sync contact channels to contactInfo
    if (data.email !== undefined || data.phone !== undefined || data.whatsapp !== undefined) {
      const contact = this.getContactInfo();
      this.set("contactInfo", {
        ...contact,
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.whatsapp !== undefined && { whatsapp: data.whatsapp }),
      });
    }
    
    return this.set("profile", updated);
  },

  getExperiences(): ExperienceItem[] { return this.get("experiences"); },
  saveExperience(item: Partial<ExperienceItem> & { id?: string }): ExperienceItem[] {
    const list = this.getExperiences();
    if (item.id) {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item } as ExperienceItem;
      } else {
        list.push(item as ExperienceItem);
      }
    } else {
      const newItem: ExperienceItem = {
        id: `exp_${Date.now()}`,
        year: item.year || "Present",
        role: item.role || "Role Title",
        company: item.company || "Company",
        description: item.description || "",
        order: list.length + 1,
        ...item,
      };
      list.unshift(newItem);
    }
    return this.set("experiences", list);
  },
  deleteExperience(id: string): ExperienceItem[] {
    const filtered = this.getExperiences().filter(i => i.id !== id);
    return this.set("experiences", filtered);
  },

  getProjects(): ProjectItem[] { return this.get("projects"); },
  saveProject(item: Partial<ProjectItem> & { id?: string }): ProjectItem[] {
    const list = this.getProjects();
    if (item.id) {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item } as ProjectItem;
      } else {
        list.push(item as ProjectItem);
      }
    } else {
      const newProj: ProjectItem = {
        id: `proj_${Date.now()}`,
        title: item.title || "Untitled Project",
        slug: (item.title || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: item.category || "Reels",
        thumbnail: item.thumbnail || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
        youtubeUrl: item.youtubeUrl || "",
        description: item.description || "",
        duration: item.duration || "0:30",
        featured: item.featured ?? true,
        published: item.published ?? true,
        order: list.length + 1,
        ...item,
      };
      list.unshift(newProj);
    }
    return this.set("projects", list);
  },
  deleteProject(id: string): ProjectItem[] {
    const filtered = this.getProjects().filter(i => i.id !== id);
    return this.set("projects", filtered);
  },

  getVideos(): VideoItem[] { return this.get("videos"); },
  saveVideo(item: Partial<VideoItem> & { id?: string }): VideoItem[] {
    const list = this.getVideos();
    if (item.id) {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item } as VideoItem;
      } else {
        list.push(item as VideoItem);
      }
    } else {
      const newVid: VideoItem = {
        id: `vid_${Date.now()}`,
        title: item.title || "Untitled Video",
        youtubeUrl: item.youtubeUrl || "",
        thumbnail: item.thumbnail || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
        category: item.category || "Reels",
        featured: item.featured ?? true,
        published: item.published ?? true,
        order: list.length + 1,
        ...item,
      };
      list.unshift(newVid);
    }
    return this.set("videos", list);
  },
  deleteVideo(id: string): VideoItem[] {
    const filtered = this.getVideos().filter(i => i.id !== id);
    return this.set("videos", filtered);
  },

  getClients(): ClientBrand[] { return this.get("clients"); },
  saveClient(item: Partial<ClientBrand> & { id?: string }): ClientBrand[] {
    const list = this.getClients();
    if (item.id) {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item } as ClientBrand;
      } else {
        list.push(item as ClientBrand);
      }
    } else {
      const newClient: ClientBrand = {
        id: `client_${Date.now()}`,
        name: item.name || "Client Name",
        logo: item.logo || "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg",
        featured: item.featured ?? true,
        order: list.length + 1,
        ...item,
      };
      list.push(newClient);
    }
    return this.set("clients", list);
  },
  deleteClient(id: string): ClientBrand[] {
    const filtered = this.getClients().filter(i => i.id !== id);
    return this.set("clients", filtered);
  },

  getStats(): StatItem[] { return this.get("stats"); },
  saveStat(item: Partial<StatItem> & { id?: string }): StatItem[] {
    const list = this.getStats();
    if (item.id) {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item } as StatItem;
      } else {
        list.push(item as StatItem);
      }
    } else {
      const newStat: StatItem = {
        id: `stat_${Date.now()}`,
        label: item.label || "New Statistic",
        value: item.value || "100+",
        detail: item.detail || "",
        iconName: item.iconName || "Star",
        order: list.length + 1,
        visible: true,
        ...item,
      };
      list.push(newStat);
    }
    return this.set("stats", list);
  },
  deleteStat(id: string): StatItem[] {
    const filtered = this.getStats().filter(i => i.id !== id);
    return this.set("stats", filtered);
  },

  getSkills(): SkillItem[] { return this.get("skills"); },
  saveSkill(item: Partial<SkillItem> & { id?: string }): SkillItem[] {
    const list = this.getSkills();
    if (item.id) {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item } as SkillItem;
      } else {
        list.push(item as SkillItem);
      }
    } else {
      const newSkill: SkillItem = {
        id: `skill_${Date.now()}`,
        name: item.name || "Skill",
        logo: item.logo || "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobepremierepro.svg",
        category: item.category || "Editing",
        glowColor: item.glowColor || "rgba(163, 133, 96, 0.3)",
        order: list.length + 1,
        visible: true,
        ...item,
      };
      list.push(newSkill);
    }
    return this.set("skills", list);
  },
  deleteSkill(id: string): SkillItem[] {
    const filtered = this.getSkills().filter(i => i.id !== id);
    return this.set("skills", filtered);
  },

  getTools(): ToolItem[] { return this.get("tools"); },
  saveTool(item: Partial<ToolItem> & { id?: string }): ToolItem[] {
    const list = this.getTools();
    if (item.id) {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item } as ToolItem;
      } else {
        list.push(item as ToolItem);
      }
    } else {
      const newTool: ToolItem = {
        id: `tool_${Date.now()}`,
        name: item.name || "Tool",
        category: item.category || "Software",
        order: list.length + 1,
        visible: true,
        ...item,
      };
      list.push(newTool);
    }
    return this.set("tools", list);
  },
  deleteTool(id: string): ToolItem[] {
    const filtered = this.getTools().filter(i => i.id !== id);
    return this.set("tools", filtered);
  },

  getServices(): ServiceItem[] { return this.get("services"); },
  saveService(item: Partial<ServiceItem> & { id?: string }): ServiceItem[] {
    const list = this.getServices();
    if (item.id) {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item } as ServiceItem;
      } else {
        list.push(item as ServiceItem);
      }
    } else {
      const newServ: ServiceItem = {
        id: `serv_${Date.now()}`,
        title: item.title || "Service Title",
        iconName: item.iconName || "Film",
        shortDesc: item.shortDesc || "",
        features: item.features || [],
        order: list.length + 1,
        visible: true,
        ...item,
      };
      list.push(newServ);
    }
    return this.set("services", list);
  },
  deleteService(id: string): ServiceItem[] {
    const filtered = this.getServices().filter(i => i.id !== id);
    return this.set("services", filtered);
  },

  getTestimonials(): TestimonialItem[] { return this.get("testimonials"); },
  saveTestimonial(item: Partial<TestimonialItem> & { id?: string }): TestimonialItem[] {
    const list = this.getTestimonials();
    if (item.id) {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item } as TestimonialItem;
      } else {
        list.push(item as TestimonialItem);
      }
    } else {
      const newTest: TestimonialItem = {
        id: `test_${Date.now()}`,
        name: item.name || "Client Name",
        role: item.role || "Client",
        text: item.text || "",
        image: item.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        rating: item.rating || 5,
        featured: true,
        visible: true,
        order: list.length + 1,
        ...item,
      };
      list.unshift(newTest);
    }
    return this.set("testimonials", list);
  },
  deleteTestimonial(id: string): TestimonialItem[] {
    const filtered = this.getTestimonials().filter(i => i.id !== id);
    return this.set("testimonials", filtered);
  },

  getSocialLinks(): SocialLinkItem[] { return this.get("socialLinks"); },
  saveSocialLink(item: Partial<SocialLinkItem> & { id?: string }): SocialLinkItem[] {
    const list = this.getSocialLinks();
    if (item.id) {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item } as SocialLinkItem;
      } else {
        list.push(item as SocialLinkItem);
      }
    } else {
      const newLink: SocialLinkItem = {
        id: `soc_${Date.now()}`,
        platform: item.platform || "Platform",
        url: item.url || "#",
        logo: item.logo || "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg",
        glowColor: item.glowColor || "rgba(163, 133, 96, 0.3)",
        visible: true,
        order: list.length + 1,
        ...item,
      };
      list.push(newLink);
    }
    return this.set("socialLinks", list);
  },
  deleteSocialLink(id: string): SocialLinkItem[] {
    const filtered = this.getSocialLinks().filter(i => i.id !== id);
    return this.set("socialLinks", filtered);
  },

  getContactInfo(): ContactInfo { 
    const saved = this.get("contactInfo");
    return { ...DEFAULT_CMS_STATE.contactInfo, ...(saved || {}) };
  },
  saveContactInfo(data: Partial<ContactInfo>): ContactInfo {
    const current = this.getContactInfo();
    const updated = { ...current, ...data };
    
    // Two-way sync contact channels to profile
    if (data.email !== undefined || data.phone !== undefined || data.whatsapp !== undefined) {
      const prof = this.getProfile();
      this.set("profile", {
        ...prof,
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.whatsapp !== undefined && { whatsapp: data.whatsapp }),
      });
    }
    
    return this.set("contactInfo", updated);
  },

  getContent(): WebsiteContent { 
    const saved = this.get("content");
    return { ...DEFAULT_CMS_STATE.content, ...(saved || {}) };
  },
  saveContent(data: Partial<WebsiteContent>): WebsiteContent {
    const current = this.getContent();
    const updated = { ...current, ...data };
    return this.set("content", updated);
  },

  getSections(): SectionConfig[] { 
    const raw: any = this.get("sections");
    const defaultSections = DEFAULT_CMS_STATE.sections;
    
    // Create map of existing saved sections
    const map = new Map<string, SectionConfig>();
    if (Array.isArray(raw) && raw.length > 0) {
      raw
        .filter((s) => s && s.id)
        .forEach((s) => map.set(s.id, s));
    }
    
    // Ensure all canonical sections exist
    const merged: SectionConfig[] = defaultSections.map((def, idx) => {
      const existing = map.get(def.id);
      if (existing) {
        return {
          id: def.id,
          name: existing.name || def.name,
          visible: existing.visible !== undefined ? existing.visible : def.visible,
          order: typeof existing.order === "number" ? existing.order : idx + 1,
        };
      }
      return { ...def, order: idx + 1 };
    });

    // Check if at least one section is visible; if none are visible (corrupted state), enable defaults
    const anyVisible = merged.some((s) => s.visible);
    if (!anyVisible) {
      return defaultSections;
    }

    return merged.sort((a, b) => a.order - b.order);
  },
  saveSections(sections: SectionConfig[]): SectionConfig[] {
    const cleaned = sections.filter((s) => Boolean(s && s.id));
    return this.set("sections", cleaned);
  },
  toggleSectionVisibility(id: string): SectionConfig[] {
    const list = this.getSections().map(s => s.id === id ? { ...s, visible: !s.visible } : s);
    return this.set("sections", list);
  },

  getSeo(): SeoSettings { 
    const saved = this.get("seo");
    return { ...DEFAULT_CMS_STATE.seo, ...(saved || {}) };
  },
  saveSeo(data: Partial<SeoSettings>): SeoSettings {
    const current = this.getSeo();
    const updated = { ...current, ...data };
    return this.set("seo", updated);
  },

  getMedia(): MediaItem[] { return this.get("media"); },
  saveMedia(item: Partial<MediaItem> & { id?: string }): MediaItem[] {
    const list = this.getMedia();
    if (item.id) {
      const idx = list.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item } as MediaItem;
      } else {
        list.push(item as MediaItem);
      }
    } else {
      const newMedia: MediaItem = {
        id: `med_${Date.now()}`,
        title: item.title || "Media Item",
        url: item.url || "",
        type: item.type || "image",
        createdAt: new Date().toISOString(),
        ...item,
      };
      list.unshift(newMedia);
    }
    return this.set("media", list);
  },
  deleteMedia(id: string): MediaItem[] {
    const filtered = this.getMedia().filter(i => i.id !== id);
    return this.set("media", filtered);
  },

  getMessages(): ContactMessage[] { return this.get("messages"); },
  addMessage(msg: { name: string; email: string; ventureNature: string; message: string }): ContactMessage {
    const list = this.getMessages();
    const newMsg: ContactMessage = {
      id: `msg_${Date.now()}`,
      ...msg,
      createdAt: new Date().toISOString(),
      read: false,
    };
    list.unshift(newMsg);
    this.set("messages", list);
    return newMsg;
  },
  markMessageRead(id: string): ContactMessage[] {
    const list = this.getMessages().map(m => m.id === id ? { ...m, read: true } : m);
    return this.set("messages", list);
  },
  deleteMessage(id: string): ContactMessage[] {
    const filtered = this.getMessages().filter(m => m.id !== id);
    return this.set("messages", filtered);
  },

  // --- Cloud Database Push & Pull ---
  async loadFromCloud(): Promise<boolean> {
    const bundle = await cloudStore.fetchAllRemote();
    if (!bundle) return false;

    const keys: Array<keyof CMSState> = [
      "profile", "experiences", "projects", "videos", "clients", "stats",
      "skills", "tools", "services", "testimonials", "socialLinks",
      "contactInfo", "content", "sections", "seo", "media", "messages"
    ];

    keys.forEach(k => {
      if (bundle[k] !== undefined && bundle[k] !== null) {
        if (Array.isArray(DEFAULT_CMS_STATE[k])) {
          if (Array.isArray(bundle[k])) {
            localStorage.setItem(`${CMS_STORAGE_PREFIX}${k}`, JSON.stringify(bundle[k]));
          }
        } else if (typeof DEFAULT_CMS_STATE[k] === "object") {
          // Merge with default object so new fields are never lost
          const merged = { ...(DEFAULT_CMS_STATE[k] as any), ...bundle[k] };
          localStorage.setItem(`${CMS_STORAGE_PREFIX}${k}`, JSON.stringify(merged));
        } else {
          localStorage.setItem(`${CMS_STORAGE_PREFIX}${k}`, JSON.stringify(bundle[k]));
        }
      }
    });

    notifyUpdate();
    return true;
  },

  async syncAllToCloud() {
    return cloudStore.pushAllLocal({
      profile: this.getProfile(),
      experiences: this.getExperiences(),
      projects: this.getProjects(),
      videos: this.getVideos(),
      clients: this.getClients(),
      stats: this.getStats(),
      skills: this.getSkills(),
      tools: this.getTools(),
      services: this.getServices(),
      testimonials: this.getTestimonials(),
      socialLinks: this.getSocialLinks(),
      contactInfo: this.getContactInfo(),
      content: this.getContent(),
      sections: this.getSections(),
      seo: this.getSeo(),
      media: this.getMedia(),
      messages: this.getMessages(),
    });
  },

  // Full Backup Export / Import
  exportFullSnapshot(): string {
    const fullState: Partial<CMSState> = {};
    const keys: Array<keyof CMSState> = [
      "profile", "experiences", "projects", "videos", "clients", "stats",
      "skills", "tools", "services", "testimonials", "socialLinks",
      "contactInfo", "content", "sections", "seo", "media", "messages"
    ];
    keys.forEach(k => {
      fullState[k] = this.get(k) as any;
    });
    return JSON.stringify(fullState, null, 2);
  },

  importSnapshot(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      Object.keys(parsed).forEach(k => {
        localStorage.setItem(`${CMS_STORAGE_PREFIX}${k}`, JSON.stringify(parsed[k]));
      });
      notifyUpdate();
      this.syncAllToCloud();
      return true;
    } catch {
      return false;
    }
  },

  resetAllToDefault(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CMS_STORAGE_PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
    notifyUpdate();
  }
};
