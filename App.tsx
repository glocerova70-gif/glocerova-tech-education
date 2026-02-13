import React, { useState } from 'react';
import { Section } from './types.ts';
import SlideViewer from './components/SlideViewer.tsx';
import ChatAssistant from './components/ChatAssistant.tsx';
import VoiceAgent from './components/VoiceAgent.tsx';
import { GraduationCap, Globe2 } from 'lucide-react';

function App() {
  const [currentSection, setCurrentSection] = useState<Section>(Section.HOME);

  return (
    <div className="font-sans antialiased overflow-hidden h-screen w-screen relative">
      
      {/* Top Navigation / Header */}
      <header className="fixed top-0 left-0 w-full z-40 px-8 py-6 md:px-20 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
            <div className="bg-glocerova-gold p-2 rounded-lg shadow-lg">
                <GraduationCap className="text-glocerova-dark h-6 w-6 md:h-8 md:w-8" />
            </div>
            <div className="flex flex-col">
                <span className="text-white font-serif font-bold text-xl md:text-2xl tracking-tight leading-none">GLOCEROVA</span>
                <span className="text-slate-300 text-[10px] md:text-xs tracking-widest uppercase">Instituto Tecnológico</span>
            </div>
        </div>

        <nav className="pointer-events-auto hidden lg:flex items-center gap-6 bg-white/10 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
            {Object.keys(Section).map((key) => {
                const section = key as Section;
                const isActive = currentSection === section;
                let label = '';
                switch(section) {
                    case Section.HOME: label = 'Inicio'; break;
                    case Section.METHODOLOGY: label = 'Método'; break;
                    case Section.SCIENCE: label = 'Ciencia'; break;
                    case Section.IMPACT: label = 'Impacto'; break;
                    case Section.JOIN_US: label = 'Únete'; break;
                }
                return (
                    <button
                        key={key}
                        onClick={() => setCurrentSection(section)}
                        className={`text-xs font-bold tracking-widest uppercase transition-colors ${isActive ? 'text-glocerova-gold' : 'text-white hover:text-white/80'}`}
                    >
                        {label}
                    </button>
                );
            })}
        </nav>

        <div className="pointer-events-auto flex items-center gap-2 text-white/80 text-sm font-medium border-l border-white/20 pl-6">
            <Globe2 size={16} />
            <span className="hidden sm:inline">COLOMBIA</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        <SlideViewer 
            currentSection={currentSection} 
            onSectionChange={setCurrentSection} 
        />
      </main>

      {/* Voice Call Agent */}
      <VoiceAgent />

      {/* AI Assistant */}
      <ChatAssistant />

    </div>
  );
}

export default App;