import React from 'react';

const ErrorBanner = ({ message, onDismiss }) => {
    if (!message) return null;

    return (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center justify-between mb-8 animate-fade-in shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1 opacity-60">System Warning</span>
                    <span className="font-bold tracking-tight">{message}</span>
                </div>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="p-2 hover:bg-red-500/10 rounded-xl transition-all text-red-400 hover:text-red-300"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            )}
        </div>
    );
};

export default ErrorBanner;
