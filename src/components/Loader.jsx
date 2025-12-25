import React from 'react';

const Loader = ({ text }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-fade-in">
            <div className="relative flex items-center justify-center">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full scale-150 animate-pulse-soft"></div>

                {/* Spinning Rings */}
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-[6px] border-primary-500/10 rounded-full"></div>
                    <div className="absolute inset-0 border-[6px] border-transparent border-t-primary-500 rounded-full animate-spin"></div>

                    {/* Inner pulse */}
                    <div className="absolute inset-4 bg-primary-500/10 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-primary-500 rounded-full shadow-glow-cyan animate-pulse"></div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
                <p className="text-white font-display font-bold text-xl tracking-tight">{text}</p>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em] animate-pulse">Neural Engine Active</p>
            </div>
        </div>
    );
};

export default Loader;
