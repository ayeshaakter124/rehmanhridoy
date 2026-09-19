/**
 * Comprehensive CMS Data Types & Schemas
 */

export interface AdminUser {
  username: string;
  email: string;
  role: "admin" | "editor";
  avatar?: string;
}

export interface ProfileHeroData {
  name: string;
  primaryTitle: string;
  alternativeTitles: string[];
  headline: string;
  subheadline: string;
  shortBio: string;
  fullBio: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  portraitUrl: string;
  aboutPortraitUrl?: string;
  coverImageUrl?: string;
  resumeUrl?: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string;
  ctaSecondaryText: string;
  ctaSecondaryUrl: string;
  availableForWork: boolean;
}

export interface ExperienceItem {
  id: string;
  year: string;
  role: string;
  company: string;
  companyLogo?: string;
  employmentType?: "Full-time" | "Contract" | "Freelance" | "Part-time";
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description: string;
  location?: string;
  order: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: "Reels" | "Commercial" | "Saas Animation" | "Motion Graphics" | "Documentary" | string;
  thumbnail: string;
  coverImage?: string;
  images?: string[];
  videoUrl?: string;
  youtubeUrl: string;
  vimeoUrl?: string;
  description: string;
  shortDescription?: string;
  clientName?: string;
  companyName?: string;
  role?: string;
  softwareUsed?: string[];
  skillsUsed?: string[];
  duration?: string;
  projectDate?: string;
  externalUrl?: string;
  behanceUrl?: string;
  tags?: string[];
  featured: boolean;
  published: boolean;
  order: number;
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  vimeoUrl?: string;
  directVideoUrl?: string;
  thumbnail: string;
  category: string;
  client?: string;
  description?: string;
  duration?: string;
  qualityBadge?: string; // e.g. "4K 60FPS"
  featured: boolean;
  published: boolean;
  order: number;
}

export interface ClientBrand {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
  projectCount?: string;
  category?: string;
  featured: boolean;
  visible?: boolean;
  order: number;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  detail: string;
  iconName: "TrendingUp" | "CheckCircle2" | "Globe" | "Heart" | "Award" | "Users" | "Star" | "Film" | string;
  suffix?: string;
  order: number;
  visible: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  logo: string;
  category: "Editing" | "Motion" | "Design" | "Color" | "3D" | string;
  level?: number; // 0-100
  glowColor: string;
  order: number;
  visible: boolean;
}

export interface ToolItem {
  id: string;
  name: string;
  logo?: string;
  category: string;
  experienceLevel?: string;
  description?: string;
  order: number;
  visible: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  iconName: string;
  shortDesc: string;
  fullDesc?: string;
  features: string[];
  priceText?: string;
  ctaText?: string;
  order: number;
  visible: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company?: string;
  text: string;
  image: string;
  youtubeUrl?: string; // For video testimonials
  rating: number; // 1-5
  project?: string;
  featured: boolean;
  visible: boolean;
  order: number;
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  logo: string;
  glowColor: string;
  visible: boolean;
  order: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  address?: string;
  mapUrl?: string;
  heading: string;
  subheading: string;
  description: string;
  ctaText: string;
}

export interface WebsiteContent {
  heroTaglineBadge: string;
  heroHeadingLine1: string;
  heroHeadingLine2: string;
  heroHeadingLine3: string;
  heroDescription: string;
  heroSocialProofText: string;

  aboutBadge: string;
  aboutHeading: string;
  aboutDescription: string;

  portfolioBadge: string;
  portfolioHeading: string;
  portfolioSubtitle: string;

  servicesBadge: string;
  servicesHeading: string;

  whyHireBadge: string;
  whyHireHeading: string;
  whyHirePillars: Array<{ title: string; text: string }>;

  journeyBadge: string;
  journeyHeading: string;

  testimonialsBadge: string;
  testimonialsHeading: string;

  contactBadge: string;
  contactHeading: string;
  contactDescription: string;

  footerTagline: string;
  footerCopyright: string;
}

export interface SectionConfig {
  id: "hero" | "services" | "portfolio" | "testimonials" | "brands" | "whyHire" | "journey" | "about" | "contact";
  name: string;
  visible: boolean;
  order: number;
}

export interface SeoSettings {
  siteTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  favicon?: string;
  socialShareTitle: string;
  socialShareDescription: string;
  author: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: "image" | "video" | "document";
  size?: string;
  category?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  ventureNature: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface CMSState {
  profile: ProfileHeroData;
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  videos: VideoItem[];
  clients: ClientBrand[];
  stats: StatItem[];
  skills: SkillItem[];
  tools: ToolItem[];
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  socialLinks: SocialLinkItem[];
  contactInfo: ContactInfo;
  content: WebsiteContent;
  sections: SectionConfig[];
  seo: SeoSettings;
  media: MediaItem[];
  messages: ContactMessage[];
}
