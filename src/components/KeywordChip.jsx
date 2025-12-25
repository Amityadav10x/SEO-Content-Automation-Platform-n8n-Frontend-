import React from 'react';

const KeywordChip = ({ keyword, isSelected, onToggle, onRemove }) => {
    return (
        <div
            className={`group relative flex items-center justify-between px-5 py-3 rounded-2xl border transition-all duration-500 cursor-pointer select-none overflow-hidden ${isSelected
                ? 'bg-primary-500/10 border-primary-500/50 shadow-glow-cyan scale-[1.05] z-10'
                : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-xl'
                }`}
            onClick={onToggle}
        >
            {/* Inner Glow for selected state */}
            {isSelected && <div className="absolute inset-0 bg-primary-500/5 animate-pulse-soft"></div>}

            <span className={`font-bold text-sm mr-4 relative z-10 tracking-tight ${isSelected ? 'text-primary-400' : 'text-slate-400 group-hover:text-slate-200'}`}>{keyword}</span>

            <div className="flex items-center gap-2 relative z-10">
                {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg p-1 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default KeywordChip;
