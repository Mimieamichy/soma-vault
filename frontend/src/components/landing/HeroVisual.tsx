import { BookOpen, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export function HeroVisual() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "The Problem",
      text: "Students rarely fail due to a lack of intelligence; they fail due to a lack of structure and access. I’m building Somavault to solve this.",
      highlight: "lack of structure and access"
    },
    {
      title: "Automated Discipline",
      text: "Our engine breaks lecture notes into a personalized, day-by-day road map with concise summaries and targeted practice questions. We turn handouts into milestones.",
      highlight: "automate discipline"
    },
    {
      title: "Community Power",
      text: "Every document is indexed into a searchable library. You aren't just studying; you're building a self-sustaining ecosystem of shared success.",
      highlight: "shared academic success"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[450px] md:h-[560px] w-full flex items-center justify-center group/hero">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] h-64 w-64 rounded-full bg-red-500/20 blur-3xl animate-glow" />
        <div className="absolute bottom-[10%] right-[10%] h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl animate-glow" />
      </div>

      {/* Main Glass Card */}
      <div className="relative w-[92%] md:w-[80%] min-h-[340px] md:aspect-[4/3] bg-background/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col p-5 md:p-8 z-10 animate-scale-in motion-safe:animate-fade-in [animation-delay:.1s] [animation-fill-mode:both] will-change-transform">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-red-600 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="h-3 md:h-4 w-24 md:w-32 bg-muted rounded mb-1" />
              <div className="h-2 md:h-3 w-16 md:w-20 bg-muted/60 rounded" />
            </div>
          </div>
          
          <div className="flex gap-1">
            {slides.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1 md:h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? "w-4 md:w-6 bg-red-600" : "w-1 md:w-1.5 bg-muted"}`}
              />
            ))}
          </div>
        </div>

        {/* Card Body - Content Slider */}
        <div className="relative flex-1 min-h-[160px] md:min-h-0 overflow-hidden">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform flex flex-col justify-center ${
                index === currentSlide 
                  ? "opacity-100 translate-x-0" 
                  : index < currentSlide 
                    ? "opacity-0 -translate-x-full" 
                    : "opacity-0 translate-x-full"
              }`}
            >
              <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-red-600 mb-1 md:mb-2">{slide.title}</h4>
              <p className="text-sm md:text-base lg:text-lg text-foreground/90 leading-snug md:leading-relaxed font-medium">
                {slide.text.split(slide.highlight).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="text-red-600 italic underline decoration-red-200/50 md:decoration-red-200 decoration-2 md:decoration-4 underline-offset-2 md:underline-offset-4">{slide.highlight}</span>
                    )}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        {/* Card Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 md:pt-6 border-t border-border/50">
          {/* Navigation Controls (Visible on hover) */}
          <div className="flex gap-1 md:gap-2 opacity-0 group-hover/hero:opacity-100 transition-opacity">
            <button 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-1 md:p-1.5 rounded-full hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
            </button>
            <button 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="p-1 md:p-1.5 rounded-full hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-[#3B82F6] motion-safe:animate-breathe [animation-delay:0s]" />
            <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-[#22C55E] motion-safe:animate-breathe [animation-delay:.2s]" />
            <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-[#EF4444] motion-safe:animate-breathe [animation-delay:.4s]" />
          </div>

          <div className="px-3 py-1 md:px-4 md:py-1.5 rounded-full text-red-600 dark:text-red-400 text-[9px] md:text-xs font-bold bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
            <span className="inline-flex items-center gap-1.5 md:gap-2">
              <span className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-red-600 animate-pulse" />
              SYSTEM ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Floating Red Card (Top Left) */}
      <div className="absolute top-[5%] left-0 md:-left-4 w-24 h-32 md:w-32 md:h-40 bg-red-600 rounded-2xl shadow-xl flex items-start justify-start p-4 md:p-6 transform -rotate-6 z-20 hover:-rotate-3 transition-transform duration-300 animate-float motion-safe:animate-fade-in [animation-delay:.2s] will-change-transform">
        <BookOpen className="text-white h-6 w-6 md:h-8 md:w-8" />
      </div>

      {/* Floating Yellow Card (Top Right) */}
      <div className="absolute top-[15%] right-0 md:-right-4 w-20 h-20 md:w-24 md:h-24 bg-yellow-400 rounded-2xl shadow-xl flex items-center justify-center transform rotate-12 z-0 animate-float-fast motion-safe:animate-fade-in [animation-delay:.4s] will-change-transform">
        <Zap className="text-white h-8 w-8 md:h-10 md:w-10" />
      </div>
    </div>
  );
}
