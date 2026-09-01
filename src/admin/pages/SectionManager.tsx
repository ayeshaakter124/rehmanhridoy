import React, { useState } from "react";
import { Sliders, Eye, EyeOff, ArrowUp, ArrowDown, Save, CheckCircle2 } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { SectionConfig } from "../../lib/cmsTypes";
import { FormToggle } from "../components/FormComponents";

interface SectionManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function SectionManager({ onAddToast }: SectionManagerProps) {
  const [sections, setSections] = useState<SectionConfig[]>(() => cmsStore.getSections());
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (id: string) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    setSections(updated);
    cmsStore.saveSections(updated);
    onAddToast("info", "Section visibility toggled.");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const list = [...sections];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSections(updated);
    cmsStore.saveSections(updated);
    onAddToast("info", "Section order updated.");
  };

  const handleResetDefaults = () => {
    const defaultSections: SectionConfig[] = [
      { id: "hero", name: "Hero / Introduction", visible: true, order: 1 },
      { id: "portfolio", name: "Portfolio Showcase", visible: true, order: 2 },
      { id: "brands", name: "Client Brand Partners", visible: true, order: 3 },
      { id: "testimonials", name: "Client Reviews & Testimonials", visible: true, order: 4 },
      { id: "whyHire", name: "Why Hire Me / Key Stats", visible: true, order: 5 },
      { id: "about", name: "About Me & Narrative", visible: true, order: 6 },
      { id: "journey", name: "Career Journey Timeline", visible: true, order: 7 },
      { id: "services", name: "Services & Capabilities", visible: true, order: 8 },
      { id: "contact", name: "Contact & Connection", visible: true, order: 9 },
    ];
    setSections(defaultSections);
    cmsStore.saveSections(defaultSections);
    onAddToast("success", "Sections reset to standard portfolio architecture! 🔄");
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    cmsStore.saveSections(sections);
    setIsSaving(false);
    onAddToast("success", "Section layout and visibility saved successfully! 🎛️");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <Sliders size={20} className="text-accent" /> Section Architecture & Visibility
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Turn sections ON/OFF or reorder their sequence on the public portfolio homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-3 rounded-2xl glass hover:bg-white/10 text-text-soft font-bold text-xs uppercase tracking-wider transition-all border border-white/10"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
          >
            <Save size={15} />
            <span>{isSaving ? "Saving..." : "Save Layout"}</span>
          </button>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-3 max-w-3xl">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={`p-5 rounded-3xl border transition-all flex items-center justify-between gap-4 ${
              section.visible
                ? "bg-secondary/50 border-white/10 hover:border-accent/30"
                : "bg-primary/40 border-white/5 opacity-60"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/80 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-accent">
                0{idx + 1}
              </div>

              <div>
                <h3 className="text-sm font-display font-bold text-text-pure">
                  {section.name}
                </h3>
                <span className="text-[10px] text-text-muted font-mono uppercase">
                  ID: #{section.id}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={idx === 0}
                onClick={() => handleMove(idx, "up")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-20"
                title="Move Up"
              >
                <ArrowUp size={15} />
              </button>
              <button
                disabled={idx === sections.length - 1}
                onClick={() => handleMove(idx, "down")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-20"
                title="Move Down"
              >
                <ArrowDown size={15} />
              </button>

              <button
                onClick={() => handleToggle(section.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  section.visible
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {section.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{section.visible ? "Visible" : "Hidden"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
