import React, { useState } from 'react';
import { GenerationMode } from './types';
import { TextToImage } from './components/TextToImage';
import { ImageToImage } from './components/ImageToImage';
import { TextToVideo } from './components/TextToVideo';

const App = () => {
  const [mode, setMode] = useState(GenerationMode.TEXT_TO_IMAGE);
  const [history, setHistory] = useState([]);
  const [activeContent, setActiveContent] = useState(null);
  const [showMobileHistory, setShowMobileHistory] = useState(false);

  const handleGenerationSuccess = (url, type) => {
    const newContent = {
      id: Date.now().toString(),
      type,
      url,
      prompt: "Generated Content",
      timestamp: Date.now()
    };
    setHistory(prev => [newContent, ...prev]);
    setActiveContent(newContent);
    // Scroll to top or preview on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nav Item Component for Sidebar
  const SidebarItem = ({ active, onClick, icon, label, description }) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition-all duration-300 group border mb-3 ${
        active 
          ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-500/30 shadow-lg shadow-indigo-500/10' 
          : 'bg-transparent border-transparent hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
          {icon}
        </div>
        <div>
          <span className={`block font-bold text-sm ${active ? 'text-white' : 'text-gray-300'}`}>{label}</span>
          <span className="block text-[10px] text-gray-500 hidden xl:block">{description}</span>
        </div>
      </div>
    </button>
  );

  // Bottom Nav Item for Mobile
  const MobileNavItem = ({ active, onClick, icon, label }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 flex-1 transition-colors ${
        active ? 'text-indigo-400' : 'text-gray-500'
      }`}
    >
      <div className={`mb-1 transition-transform ${active ? 'scale-110' : ''}`}>{icon}</div>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );

  // Icons
  const IconImage = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
  const IconMagic = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
  const IconVideo = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[70%] bg-indigo-900/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[70%] h-[70%] bg-purple-900/10 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex h-screen">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-80 flex-col p-6 glass-panel border-r-0 rounded-r-3xl my-6 ml-6 mr-0">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-display font-bold text-white text-lg">V</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Visionary</span>
          </div>

          <nav className="flex-1">
            <SidebarItem 
              active={mode === GenerationMode.TEXT_TO_IMAGE} 
              onClick={() => setMode(GenerationMode.TEXT_TO_IMAGE)}
              icon={IconImage}
              label="Text to Image"
              description="Generate from scratch"
            />
            <SidebarItem 
              active={mode === GenerationMode.IMAGE_TO_IMAGE} 
              onClick={() => setMode(GenerationMode.IMAGE_TO_IMAGE)}
              icon={IconMagic}
              label="Image to Image"
              description="Transform existing"
            />
            <SidebarItem 
              active={mode === GenerationMode.TEXT_TO_VIDEO} 
              onClick={() => setMode(GenerationMode.TEXT_TO_VIDEO)}
              icon={IconVideo}
              label="Text to Video"
              description="Create motion"
            />
          </nav>

          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Recent History</h4>
            <div className="space-y-2 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
              {history.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveContent(item)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${activeContent?.id === item.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                  <div className="w-10 h-10 rounded bg-black/40 border border-white/5 overflow-hidden flex-shrink-0">
                    {item.type === 'video' ? <video src={item.url} className="w-full h-full object-cover" /> : <img src={item.url} className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-gray-300 truncate w-24">Generated {item.type}</div>
                    <div className="text-[10px] text-gray-600">{new Date(item.timestamp).toLocaleTimeString()}</div>
                  </div>
                </button>
              ))}
              {history.length === 0 && <div className="text-xs text-gray-600 px-2 italic">No history yet</div>}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Mobile Header */}
          <header className="lg:hidden h-14 flex items-center justify-between px-4 glass-panel border-b-0 m-2 rounded-xl">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="font-display font-bold text-white text-xs">V</span>
                </div>
                <span className="font-display font-bold text-lg">Visionary</span>
             </div>
             <button onClick={() => setShowMobileHistory(!showMobileHistory)} className="p-2 text-gray-400">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </button>
          </header>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-full">
              
              {/* Left Panel: Inputs */}
              <div className="lg:col-span-5 order-2 lg:order-1 animate-fade-in">
                 <div className="mb-6">
                    <h1 className="text-2xl lg:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
                      {mode === GenerationMode.TEXT_TO_IMAGE && "Create Images"}
                      {mode === GenerationMode.IMAGE_TO_IMAGE && "Remix Images"}
                      {mode === GenerationMode.TEXT_TO_VIDEO && "Create Video"}
                    </h1>
                    <p className="text-gray-400 text-sm lg:text-base">
                      {mode === GenerationMode.TEXT_TO_IMAGE && "Describe your imagination."}
                      {mode === GenerationMode.IMAGE_TO_IMAGE && "Transform existing visuals."}
                      {mode === GenerationMode.TEXT_TO_VIDEO && "Bring stories to life with Veo."}
                    </p>
                 </div>
                 
                 <div className="glass-panel p-1 rounded-2xl">
                    {mode === GenerationMode.TEXT_TO_IMAGE && <TextToImage onGenerate={handleGenerationSuccess} />}
                    {mode === GenerationMode.IMAGE_TO_IMAGE && <ImageToImage onGenerate={handleGenerationSuccess} />}
                    {mode === GenerationMode.TEXT_TO_VIDEO && <TextToVideo onGenerate={handleGenerationSuccess} />}
                 </div>

                 {/* Mobile History Panel (Toggleable) */}
                 {showMobileHistory && (
                   <div className="mt-6 lg:hidden glass-panel p-4 rounded-xl animate-fade-in">
                      <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Recent Creations</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {history.map(item => (
                          <div key={item.id} onClick={() => { setActiveContent(item); setShowMobileHistory(false); }} className="aspect-square bg-black/40 rounded-lg overflow-hidden border border-white/10 relative">
                             {item.type === 'video' ? <video src={item.url} className="w-full h-full object-cover" /> : <img src={item.url} className="w-full h-full object-cover" />}
                          </div>
                        ))}
                        {history.length === 0 && <p className="text-xs text-gray-500 col-span-2">No items yet.</p>}
                      </div>
                   </div>
                 )}
              </div>

              {/* Right Panel: Preview */}
              <div className="lg:col-span-7 order-1 lg:order-2 h-auto lg:h-full">
                 <div className="w-full aspect-square lg:aspect-auto lg:h-[calc(100vh-6rem)] glass-panel rounded-2xl p-2 relative group overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-gradient-card opacity-50 pointer-events-none"></div>
                    
                    <div className="flex-1 relative rounded-xl bg-black/40 overflow-hidden flex items-center justify-center border border-white/5">
                        {activeContent ? (
                          <>
                             {activeContent.type === 'video' ? (
                               <video src={activeContent.url} controls autoPlay loop className="w-full h-full object-contain" />
                             ) : (
                               <img src={activeContent.url} className="w-full h-full object-contain" />
                             )}
                             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href={activeContent.url} download className="p-2 bg-black/60 backdrop-blur rounded-lg text-white hover:bg-white/20 transition-colors">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </a>
                             </div>
                          </>
                        ) : (
                          <div className="text-center p-6">
                            <div className="w-24 h-24 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center animate-pulse">
                              <span className="text-4xl">✨</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-300">Ready to Create</h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">Your generated artwork and videos will appear here in high fidelity.</p>
                          </div>
                        )}
                    </div>
                    
                    {/* Status Bar */}
                    <div className="h-12 flex items-center justify-between px-4 border-t border-white/5 mt-1 bg-black/20 rounded-b-lg">
                       <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${activeContent ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`}></span>
                          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{activeContent ? 'Render Complete' : 'Idle'}</span>
                       </div>
                       <div className="text-xs font-mono text-gray-600">GEMINI-2.5-FLASH</div>
                    </div>
                 </div>
              </div>

            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bottom-nav-blur pb-safe-area z-50">
             <div className="flex justify-around items-center h-16 px-2">
                <MobileNavItem 
                  active={mode === GenerationMode.TEXT_TO_IMAGE} 
                  onClick={() => setMode(GenerationMode.TEXT_TO_IMAGE)} 
                  icon={IconImage} 
                  label="Image" 
                />
                <MobileNavItem 
                  active={mode === GenerationMode.IMAGE_TO_IMAGE} 
                  onClick={() => setMode(GenerationMode.IMAGE_TO_IMAGE)} 
                  icon={IconMagic} 
                  label="Remix" 
                />
                <MobileNavItem 
                  active={mode === GenerationMode.TEXT_TO_VIDEO} 
                  onClick={() => setMode(GenerationMode.TEXT_TO_VIDEO)} 
                  icon={IconVideo} 
                  label="Video" 
                />
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;