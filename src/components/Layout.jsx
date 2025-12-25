import React from 'react';

const Layout = ({ children, currentStep }) => {
    const steps = [
        { number: 1, label: 'Campaign Setup', icon: '🎯' },
        { number: 2, label: 'Keyword Selection', icon: '✨' },
        { number: 3, label: 'Content Pipeline', icon: '🚀' },
    ];

    return (
        <div className="min-h-screen text-slate-200 pb-20 selection:bg-primary-500/30">
            {/* Nav Shell */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-base-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-glow-cyan group-hover:scale-105 transition-transform">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display font-black text-xl tracking-tighter text-white leading-none">
                                ANTIGRAV<span className="text-primary-400">SEO</span>
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 leading-none mt-1">
                                Enterprise Content Engine
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className={`flex items-center gap-2 transition-colors ${step.number === currentStep ? 'text-primary-400' : ''}`}
                            >
                                <span className={`w-5 h-5 flex items-center justify-center rounded-md border ${step.number === currentStep ? 'bg-primary-500/10 border-primary-500/30' : 'border-white/10'}`}>
                                    {step.number}
                                </span>
                                {step.label}
                                {step.number < 3 && <span className="text-white/5 ml-4">/</span>}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">System Active</span>
                    </div>
                </div>
            </nav>

            {/* Sub-Header / Progress Section */}
            <div className="pt-32 pb-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col items-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            Phase 0{currentStep}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white text-center">
                            {steps[currentStep - 1].label}
                        </h2>
                        <p className="text-slate-500 mt-4 text-center max-w-md font-medium">
                            Configure your high-performance SEO assets with our advanced neural generation engine.
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden mb-16">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-1000 ease-out shadow-glow-cyan"
                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shimmer -translate-x-full"></div>
                        </div>
                    </div>

                    {/* Content Viewport */}
                    <main className="animate-fade-in-up">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;
