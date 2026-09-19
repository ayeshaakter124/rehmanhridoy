/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { cmsStore } from "./lib/cmsStore";
import { SectionConfig } from "./lib/cmsTypes";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Testimonials from "./components/Testimonials";
import Brands from "./components/Brands";
import WhyHireMe from "./components/WhyHireMe";
import Journey from "./components/Journey";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// Lazy-load heavier auxiliary pages for ultra-fast initial homepage paint
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const AdminRouter = lazy(() => import("./admin/AdminRouter"));

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin glow-sm" />
    </div>
  );
}

/**
 * CloudDataLoader: fires-and-forgets a non-blocking cloud sync.
 * The site renders immediately using localStorage / default data.
 * When cloud data arrives it dispatches "cms_data_updated" to refresh live components.
 * A 7-second abort timeout prevents any hangs.
 */
function CloudDataLoader() {
  useEffect(() => {
    let isMounted = true;

    const sync = async () => {
      try {
        // Non-blocking: page is already rendered before this resolves
        await cmsStore.loadFromCloud();
        if (isMounted) {
          const seo = cmsStore.getSeo();
          if (seo?.siteTitle) {
            document.title = seo.siteTitle;
          }
        }
      } catch (err) {
        // Swallow silently - the site works fine with local data
        if (process.env.NODE_ENV !== "production") {
          console.warn("Background cloud sync note:", err);
        }
      }
    };

    // Defer cloud sync until after first paint to not delay LCP
    const timer = setTimeout(sync, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return null;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace("#", "");
      const scrollToTarget = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };

      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        const timer = setTimeout(scrollToTarget, 150);
        return () => clearTimeout(timer);
      }
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}

function DynamicHomeSections() {
  const [sections, setSections] = useState<SectionConfig[]>(() =>
    cmsStore.getSections().filter((s) => s.visible).sort((a, b) => a.order - b.order)
  );

  useEffect(() => {
    const handleUpdate = () => {
      setSections(
        cmsStore.getSections().filter((s) => s.visible).sort((a, b) => a.order - b.order)
      );
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
    };
  }, []);

  const renderSection = (id: string) => {
    switch (id) {
      case "hero":
        return <Hero key="hero" />;
      case "services":
        return <Services key="services" />;
      case "portfolio":
        return <Portfolio key="portfolio" />;
      case "testimonials":
        return <Testimonials key="testimonials" />;
      case "brands":
        return <Brands key="brands" />;
      case "whyHire":
        return <WhyHireMe key="whyHire" />;
      case "journey":
        return <Journey key="journey" />;
      case "about":
        return <About key="about" />;
      case "contact":
        return <Contact key="contact" />;
      default:
        return null;
    }
  };

  // If no sections are visible (e.g. data not loaded yet), use the visible defaults
  const displaySections =
    sections.length > 0
      ? sections
      : cmsStore.getSections().filter((s) => s.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="w-full">
      {displaySections.map((section) => renderSection(section.id))}
    </div>
  );
}

function AnimatedRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path="/" element={<DynamicHomeSections />} />
        <Route path="/work" element={<PortfolioPage />} />
        <Route path="/admin/*" element={<AdminRouter />} />
      </Routes>
    </Suspense>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="bg-primary text-text-pure min-h-screen selection:bg-accent selection:text-primary">
      <CloudDataLoader />
      <ScrollToTop />
      {!isAdmin && <Navbar />}

      <main>
        <AnimatedRoutes />
      </main>

      {!isAdmin && <Footer />}

      {/* Scroll To Top Button */}
      {!isAdmin && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-10 right-10 w-12 h-12 glass rounded-full flex items-center justify-center text-accent hover:bg-accent hover:text-primary transition-all duration-300 z-50 border border-white/10 glow-md"
        >
          <span className="text-xl">↑</span>
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}
