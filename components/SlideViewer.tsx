import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ArrowRight, Download, BookOpen, ExternalLink } from 'lucide-react';
import { SLIDES } from '../constants.ts';
import { Section } from '../types.ts';

interface SlideViewerProps {
    currentSection: Section;
    onSectionChange: (section: Section) => void;
}

const SlideViewer: React.FC<SlideViewerProps> = ({ currentSection, onSectionChange }) => {
    const sections = Object.values(Section);
    const currentIndex = sections.indexOf(currentSection);
    const slide = SLIDES[currentSection];
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(false);
        const timer = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timer);
    }, [currentSection]);

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % sections.length;
        onSectionChange(sections[nextIndex]);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
        onSectionChange(sections[prevIndex]);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-glocerova-dark">
            <div className="absolute inset-0 z-0">
                {slide.videoUrl ? (
                    <video
                        key={`v-${slide.id}`}
                        src={slide.videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2500ms] ease-out ${loaded ? 'scale-105' : 'scale-110'}`}
                    />
                ) : (
                    <div
                        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[2500ms] ease-out ${loaded ? 'scale-105' : 'scale-110'}`}
                        style={{ backgroundImage: `url(${slide.imageUrl})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-glocerova-dark/95 via-glocerova-dark/60 to-transparent" />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 lg:px-32 max-w-7xl mx-auto">
                <div className={`transition-all duration-1000 ease-out transform ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[2px] w-12 bg-glocerova-gold"></div>
                        <span className="text-glocerova-gold font-bold tracking-[0.2em] text-xs md:text-sm uppercase font-sans">{slide.subtitle}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-[1.1]">{slide.title}</h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-light">
                        {slide.description}
                    </p>

                    <div className="flex flex-wrap gap-5">
                        <button onClick={handleNext} className="group flex items-center gap-4 bg-white text-glocerova-dark px-10 py-5 rounded-full font-bold hover:bg-glocerova-gold transition-all duration-500 shadow-xl hover:shadow-glocerova-gold/20">
                            {slide.ctaText}
                            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </button>

                        {slide.researchLinks && (
                            <div className="flex gap-4">
                                {slide.researchLinks.map((res, i) => (
                                    <button key={i} className="flex items-center gap-2 bg-white/5 border border-white/20 text-white px-6 py-5 rounded-full text-sm font-semibold hover:bg-white/10 backdrop-blur-sm transition-all">
                                        <BookOpen size={18} className="text-glocerova-gold" />
                                        {res.title}
                                    </button>
                                ))}
                            </div>
                        )}

                        {slide.secondaryCta && (
                            <a href={slide.secondaryCta.link} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 border border-white/40 text-white px-10 py-5 rounded-full font-bold hover:bg-white/10 transition-all duration-500 backdrop-blur-sm">
                                {slide.secondaryCta.text}
                                <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-12 left-8 md:left-20 flex items-center gap-6 z-20">
                <div className="flex gap-2">
                    {sections.map((s, idx) => (
                        <button
                            key={s}
                            onClick={() => onSectionChange(s)}
                            className={`h-1 transition-all duration-700 rounded-full ${s === currentSection ? 'w-16 bg-glocerova-gold' : 'w-4 bg-white/20 hover:bg-white/40'}`}
                        />
                    ))}
                </div>

                <div className="flex gap-3 ml-4">
                    <button onClick={handlePrev} className="group p-3 rounded-full border border-white/10 text-white hover:bg-white hover:text-glocerova-dark backdrop-blur-md transition-all duration-500">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={handleNext} className="group p-3 rounded-full bg-white text-glocerova-dark hover:bg-glocerova-gold transition-all duration-500 shadow-2xl">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <span className="hidden sm:inline text-white/40 font-mono text-[10px] tracking-widest ml-2 uppercase">Navegar</span>
            </div>

            <div className="absolute top-12 right-8 md:right-20 text-white/20 font-mono text-4xl font-black z-20 select-none">
                0{slide.id} <span className="text-[10px] align-top mt-2 inline-block font-bold">/ 05</span>
            </div>
        </div>
    );
};

export default SlideViewer;