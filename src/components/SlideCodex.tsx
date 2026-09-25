import React, { useState } from "react";
import { SLIDES_DATA, SlideData } from "../data/slidesData";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Volume2, 
  ShieldAlert, 
  Eye, 
  Search, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter
} from "lucide-react";
import { sacredSound } from "../utils/audioSynth";

interface SlideCodexProps {
  onSelectInteractiveTool: (toolName: string) => void;
  isDarkMode: boolean;
  onOpenDonateModal?: () => void;
}

export const SlideCodex: React.FC<SlideCodexProps> = ({
  onSelectInteractiveTool,
  isDarkMode,
  onOpenDonateModal
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const filteredSlides = SLIDES_DATA.filter((slide) => {
    const matchesCategory = selectedCategory === "All" || slide.category === selectedCategory;
    const matchesSearch = 
      slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slide.keyTerms.some(term => term.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const slide = filteredSlides[currentSlideIndex] || SLIDES_DATA[0];

  const handleNext = () => {
    sacredSound.playGnosticChime(528);
    setCurrentSlideIndex((prev) => (prev + 1) % filteredSlides.length);
  };

  const handlePrev = () => {
    sacredSound.playGnosticChime(396);
    setCurrentSlideIndex((prev) => (prev - 1 + filteredSlides.length) % filteredSlides.length);
  };

  const categories = ["All", "Origin", "Pillars", "War", "Architecture", "Synthesis"];

  return (
    <div className="space-y-8">
      
      {/* Hero Header Section */}
      <div className={`p-6 sm:p-8 rounded border text-center relative overflow-hidden transition-all ${
        isDarkMode 
          ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#f4f4f5] shadow-xl" 
          : "bg-gradient-to-b from-[#FAF8F3] to-[#EFE8D8] border-amber-900/20 shadow-md"
      }`}>
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent"></div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border text-[10px] font-mono tracking-[0.15em] uppercase mb-4 text-[#c5a059] border-[#1c1c1f] bg-[#09090b]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NotebookLM Sacred Codex • {SLIDES_DATA.length} Illuminated Slides</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-normal uppercase tracking-[0.2em] text-[#e4e4e7]">
          THE GUARDIAN ORACLE CODEX
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#a1a1aa] max-w-2xl mx-auto font-sans leading-relaxed">
          An epic presentation detailing the convergence of Sacred Code, Gnostic Awakening, and New Earth Protocols. Explore the slide blueprints and launch live interactive engines.
        </p>

        {/* Category & Search Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1c1c1f]">
          
          {/* Categories */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            <Filter className="w-3.5 h-3.5 text-[#c5a059] mr-1 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sacredSound.playGnosticChime(432);
                  setSelectedCategory(cat);
                  setCurrentSlideIndex(0);
                }}
                className={`px-3 py-1 rounded text-[10px] font-mono tracking-[0.1em] uppercase transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#c5a059] text-[#09090b] font-semibold"
                    : isDarkMode
                      ? "text-[#52525b] hover:text-[#c5a059] hover:bg-[#09090b]"
                      : "text-stone-700 hover:text-amber-950 hover:bg-amber-900/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#52525b]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentSlideIndex(0);
              }}
              placeholder="Search codex terms..."
              className={`w-full pl-9 pr-3 py-1.5 rounded border text-xs font-mono outline-none transition-all ${
                isDarkMode
                  ? "bg-[#09090b] border-[#1c1c1f] text-[#e4e4e7] placeholder-[#52525b] focus:border-[#c5a059]"
                  : "bg-white/80 border-amber-900/20 text-stone-900 placeholder-stone-400 focus:border-amber-800"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Slide Viewer Frame */}
      {filteredSlides.length === 0 ? (
        <div className="p-12 text-center border rounded border-[#1c1c1f] bg-[#0d0d0f] text-[#71717a]">
          No slides match your search query "{searchTerm}". Try clearing search or selecting "All".
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Sacred Blueprint Slide Card */}
          <div className="lg:col-span-8 space-y-4">
            <div className={`relative border rounded-sm p-6 sm:p-8 transition-all duration-300 shadow-2xl overflow-hidden ${
              isDarkMode 
                ? "bg-[#0d0d0f] border-[#1c1c1f] text-[#f4f4f5]" 
                : "bg-[#FAF7EF] border-amber-900/40 text-stone-900"
            }`}>
              
              {/* Sacred Corner Ornament Borders */}
              <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-[#c5a059]/60"></div>
              <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-[#c5a059]/60"></div>
              <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[#c5a059]/60"></div>
              <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[#c5a059]/60"></div>

              {/* Top Slide Meta Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1c1c1f]">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono tracking-[0.15em] uppercase bg-[#09090b] text-[#c5a059] border border-[#1c1c1f]">
                    SLIDE {slide.id} OF {SLIDES_DATA.length}
                  </span>
                  <span className="text-xs font-serif italic text-[#71717a]">
                    Category: {slide.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      sacredSound.playGnosticChime(528);
                      const speech = new SpeechSynthesisUtterance(`${slide.title}. ${slide.subtitle}. ${slide.quote}. ${slide.summary}`);
                      window.speechSynthesis.speak(speech);
                    }}
                    title="Synthesize Audio Readout"
                    className="p-1.5 rounded border border-[#1c1c1f] bg-[#09090b] hover:border-[#c5a059]/50 text-[#c5a059]"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slide Display Header & Title */}
              <div className="text-center py-4 space-y-2">
                <div className="inline-block p-3 rounded-full bg-[#09090b] border border-[#1c1c1f] mb-2">
                  <Eye className="w-7 h-7 text-[#c5a059] mx-auto animate-pulse" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-normal uppercase tracking-[0.2em] text-[#f4f4f5]">
                  {slide.title}
                </h3>
                <h4 className="text-xs sm:text-sm font-serif italic text-[#c5a059]">
                  {slide.subtitle}
                </h4>
              </div>

              {/* Quote Box */}
              <div className="my-6 p-4 rounded border border-[#1c1c1f] bg-[#09090b] text-center italic font-serif text-xs sm:text-sm text-[#e4e4e7]">
                "{slide.quote}"
              </div>

              {/* Slide Summary */}
              <div className="space-y-3 font-sans text-xs sm:text-sm leading-relaxed text-[#a1a1aa]">
                <p className="font-normal">{slide.summary}</p>
              </div>

              {/* Details Breakdown */}
              <div className="mt-6 space-y-3 pt-6 border-t border-[#1c1c1f]">
                <h5 className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#71717a]">
                  TECHNICAL & ESOTERIC SPECIFICATIONS
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  {slide.details.map((item, idx) => (
                    <div key={idx} className="p-3 rounded border border-[#1c1c1f] bg-[#09090b]/80">
                      <span className="font-serif text-xs uppercase tracking-wider text-[#c5a059] block mb-1">
                        ✦ {item.label}
                      </span>
                      <p className="text-xs text-[#a1a1aa] leading-snug">
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Terms */}
              <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-[#1c1c1f]">
                {slide.keyTerms.map((term, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded text-[10px] font-mono border border-[#1c1c1f] bg-[#09090b] text-[#c5a059]"
                  >
                    #{term}
                  </span>
                ))}
              </div>

              {/* Bottom Interactive Trigger Banner */}
              {slide.interactiveFeature && (
                <div className="mt-8 pt-4 border-t border-[#1c1c1f] flex items-center justify-between bg-[#09090b] -mx-6 -mb-6 p-4 rounded-b-sm">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#c5a059] animate-spin" />
                    <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#e4e4e7]">
                      Live Engine Associated With Slide {slide.id}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      sacredSound.playGnosticChime(639);
                      if (slide.interactiveFeature) {
                        onSelectInteractiveTool(slide.interactiveFeature);
                      }
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded bg-[#c5a059] text-[#09090b] hover:bg-[#d4b068] font-mono text-xs font-semibold tracking-wider uppercase transition-all shadow-md cursor-pointer"
                  >
                    <span>Launch Engine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Slide Navigation Controls */}
            <div className="flex items-center justify-between p-2">
              <button
                onClick={handlePrev}
                className="flex items-center space-x-2 px-4 py-2 rounded border border-[#1c1c1f] bg-[#0d0d0f] text-[#e4e4e7] hover:border-[#c5a059] font-mono text-xs uppercase tracking-wider transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-[#c5a059]" />
                <span>Previous Slide</span>
              </button>

              <span className="font-mono text-xs text-[#c5a059]">
                {currentSlideIndex + 1} / {filteredSlides.length}
              </span>

              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-4 py-2 rounded border border-[#1c1c1f] bg-[#0d0d0f] text-[#e4e4e7] hover:border-[#c5a059] font-mono text-xs uppercase tracking-wider transition-all"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4 text-[#c5a059]" />
              </button>
            </div>
          </div>

          {/* Right Column: All 14 Slide List Thumbnails */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#71717a] flex items-center justify-between">
              <span>CODEX SLIDE INDEX ({filteredSlides.length})</span>
              <BookOpen className="w-4 h-4 text-[#c5a059]" />
            </h4>

            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1 no-scrollbar">
              {filteredSlides.map((s, idx) => {
                const isSelected = idx === currentSlideIndex;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      sacredSound.playGnosticChime(432);
                      setCurrentSlideIndex(idx);
                    }}
                    className={`p-3 rounded border text-left transition-all cursor-pointer ${
                      isSelected
                        ? isDarkMode
                          ? "bg-[#0d0d0f] border-[#c5a059] text-[#fafafa] shadow-md"
                          : "bg-amber-100 border-amber-800 text-amber-950 font-semibold shadow-xs"
                        : isDarkMode
                          ? "bg-[#0d0d0f]/60 border-[#1c1c1f] text-[#71717a] hover:bg-[#0d0d0f] hover:text-[#e4e4e7] hover:border-[#1c1c1f]"
                          : "bg-white/70 border-amber-900/10 text-stone-700 hover:bg-amber-50 hover:text-amber-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#c5a059]">
                        SLIDE {s.id} • {s.category}
                      </span>
                      {s.interactiveFeature && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#09090b] border border-[#1c1c1f] text-[#c5a059]">
                          LIVE ENGINE
                        </span>
                      )}
                    </div>
                    <h5 className="font-serif text-sm mt-1 line-clamp-1 text-[#e4e4e7]">
                      {s.title}
                    </h5>
                    <p className="text-xs text-[#71717a] line-clamp-1 italic">
                      {s.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
