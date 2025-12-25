import React, { useState, useEffect } from 'react';
import { ENDPOINTS } from '../config';

const StepArticleOutput = ({ articleData, campaignData, keywords, onBack, onRegenerate }) => {
    const [content, setContent] = useState(articleData?.article?.content || '');
    const [wordCount, setWordCount] = useState(articleData?.article?.wordCount || 0);
    const [copied, setCopied] = useState(false);
    const [title, setTitle] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    useEffect(() => {
        const contentType = campaignData?.contentType || 'article';

        // Sync local content state when articleData prop changes (important for regeneration)
        if (articleData?.article?.content) {
            setContent(articleData.article.content);
        }

        // Extract title
        if (contentType === 'linkedin') {
            setTitle('LinkedIn Post');
        } else if (contentType === 'twitter') {
            setTitle('Twitter Thread');
        } else if (!articleData?.article?.title && typeof articleData?.article?.content === 'string') {
            const contentStr = articleData.article.content;
            const h1Match = contentStr.match(/<h1[^>]*>(.*?)<\/h1>/i);
            if (h1Match) {
                const extractedTitle = h1Match[1].replace(/<[^>]*>/g, '');
                setTitle(extractedTitle);
            } else {
                setTitle('Generated Content');
            }
        } else {
            setTitle(articleData?.article?.title || 'Generated Content');
        }

        // Word / Tweet count
        if (articleData?.article?.wordCount) {
            setWordCount(articleData.article.wordCount);
        } else if (typeof articleData?.article?.content === 'string') {
            const text = articleData.article.content.replace(/<[^>]*>/g, '');
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);
            setWordCount(words.length);
        } else if (Array.isArray(articleData?.article?.content)) {
            setWordCount(articleData.article.content.length); // For twitter, wordcount is tweet count
        }
    }, [articleData, campaignData]);

    const handleCopy = (textToCopy = null) => {
        const finalContent = textToCopy || (typeof content === 'string' ? content : JSON.stringify(content, null, 2));
        navigator.clipboard.writeText(finalContent).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        try {
            const payload = {
                step: campaignData.contentType || 'article',
                campaignDescription: campaignData.campaignDescription,
                targetAudience: campaignData.targetAudience,
                tone: campaignData.tone,
                keywords: keywords,
            };

            console.log('🔄 Regenerating article with payload:', payload);

            const response = await fetch(ENDPOINTS.GENERATE_KEYWORDS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to regenerate article');

            const data = await response.json();
            console.log('📥 Regeneration response:', data);

            // Parse response same way as initial generation
            let newArticleData = null;
            const firstItem = Array.isArray(data) ? data[0] : data;

            if (firstItem) {
                if (firstItem.linkedinPost) {
                    newArticleData = {
                        article: {
                            title: 'LinkedIn Post',
                            content: firstItem.linkedinPost,
                            wordCount: firstItem.characterCount || 0
                        },
                        seo: { metaTitle: '', metaDescription: '' }
                    };
                } else if (firstItem.twitterThread) {
                    newArticleData = {
                        article: {
                            title: 'Twitter Thread',
                            content: firstItem.twitterThread,
                            wordCount: firstItem.totalTweets || 0
                        },
                        seo: { metaTitle: '', metaDescription: '' }
                    };
                } else if (firstItem.htmlCaseStudy) {
                    newArticleData = {
                        article: {
                            title: '',
                            content: firstItem.htmlCaseStudy,
                            wordCount: firstItem.wordCount || 0
                        },
                        seo: { metaTitle: '', metaDescription: '' }
                    };
                } else if (firstItem.htmlArticle) {
                    newArticleData = {
                        article: {
                            title: '',
                            content: firstItem.htmlArticle,
                            wordCount: firstItem.wordCount || 0
                        },
                        seo: { metaTitle: '', metaDescription: '' }
                    };
                }
            }

            if (newArticleData) {
                console.log('✅ Successfully parsed regenerated content');
                onRegenerate(newArticleData);
            } else {
                console.warn('⚠️ Could not parse regenerated content structure');
            }
        } catch (error) {
            console.error('Error regenerating article:', error);
            alert('Failed to regenerate article. Please try again.');
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleExportPDF = () => {
        // Create a printable version
        const printWindow = window.open('', '_blank');
        const exportContent = Array.isArray(content)
            ? content.map((t, i) => `<h3>Tweet ${i + 1}</h3><p>${t}</p>`).join('')
            : content;

        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
                        h1 { color: #1a1a1a; }
                        h2, h3 { color: #333; margin-top: 1.5rem; }
                        p { line-height: 1.6; color: #444; white-space: pre-wrap; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    ${exportContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleExportMarkdown = () => {
        let markdown = '';

        if (Array.isArray(content)) {
            markdown = `# ${title}\n\n` + content.map((t, i) => `## Tweet ${i + 1}\n${t}`).join('\n\n');
        } else {
            // Convert HTML to Markdown (basic conversion)
            markdown = content
                .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
                .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
                .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
                .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
                .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
                .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
                .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
                .replace(/<\/?ul[^>]*>/gi, '\n')
                .replace(/<\/?ol[^>]*>/gi, '\n')
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]*>/g, '');
        }

        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportText = () => {
        let text = '';
        if (Array.isArray(content)) {
            text = `${title}\n\n` + content.map((t, i) => `[${i + 1}] ${t}`).join('\n\n');
        } else {
            // Strip all HTML tags
            text = content.replace(/<[^>]*>/g, '').replace(/\n\n+/g, '\n\n');
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Success Status Header */}
            <div className="flex items-center justify-between bg-primary-500/10 border border-primary-500/20 px-6 py-4 rounded-2xl shadow-glow-cyan">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                        <h4 className="font-display font-black text-white text-lg leading-tight uppercase tracking-tight">Content Pipeline Success</h4>
                        <p className="text-primary-400/80 text-xs font-bold uppercase tracking-widest mt-1">Ready for high-performance distribution</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Preview Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stage 1: Content Workspace */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="card h-full flex flex-col premium-border">
                        {/* Control Bar */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-3 border ${isEditing
                                        ? 'bg-primary-500 text-white border-primary-400 shadow-glow-cyan'
                                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                                        }`}
                                >
                                    {isEditing ? (
                                        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> View Output</>
                                    ) : (
                                        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> Edit Source</>
                                    )}
                                </button>
                                <button
                                    onClick={handleRegenerate}
                                    disabled={isRegenerating}
                                    className="px-6 py-2.5 bg-white/5 text-slate-400 border border-white/10 rounded-xl hover:border-primary-500/50 hover:text-primary-400 transition-all duration-300 font-black text-xs uppercase tracking-widest flex items-center gap-3 disabled:opacity-50"
                                >
                                    <svg className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    {isRegenerating ? 'Neural Syncing...' : 'Regenerate'}
                                </button>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Payload Size</span>
                                    <span className="text-sm font-mono font-bold text-white">{wordCount} {campaignData?.contentType === 'twitter' ? 'tweets' : 'words'}</span>
                                </div>
                                <div className="w-px h-8 bg-white/5"></div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">State</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isEditing ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                        {isEditing ? 'Draft' : 'Stable'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Workspace Title */}
                        {title && !isEditing && (
                            <h1 className="text-4xl font-display font-black text-white mb-8 tracking-tight">
                                {title}
                            </h1>
                        )}

                        {/* Content Viewer/Editor */}
                        <div className="flex-grow min-h-[500px]">
                            {isEditing ? (
                                <textarea
                                    className="w-full h-full min-h-[500px] p-8 bg-base-950/50 border border-white/5 rounded-2xl text-slate-300 font-mono text-lg leading-relaxed focus:ring-2 focus:ring-primary-500/30 outline-none transition-all resize-none shadow-inner"
                                    value={typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Source code editor active..."
                                ></textarea>
                            ) : (
                                <div className="animate-fade-in">
                                    {campaignData?.contentType === 'linkedin' ? (
                                        <div className="max-w-4xl mx-auto space-y-8">
                                            <div className="glass-card p-6 flex items-center justify-between border-primary-500/20 shadow-glow-cyan">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center text-white text-2xl font-black shadow-lg">in</div>
                                                    <div>
                                                        <h3 className="font-display font-black text-white text-lg tracking-tight">LinkedIn Optimization</h3>
                                                        <p className="text-xs text-slate-500 font-medium tracking-wide">Professional Content Protocol</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleCopy()}
                                                    className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                                    COPY ARTIFACT
                                                </button>
                                            </div>
                                            <div className="bg-white/[0.03] rounded-3xl p-10 border border-white/5 relative group shadow-2xl">
                                                <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-xl font-medium tracking-tight">
                                                    {content}
                                                </div>
                                                <div className="absolute top-6 right-6">
                                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-all ${content.length > 3000 ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                                                        {content.length} / 3000 CHARS
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : campaignData?.contentType === 'twitter' ? (
                                        <div className="max-w-4xl mx-auto space-y-8">
                                            <div className="glass-card p-6 flex items-center justify-between border-white/20 shadow-2xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-black text-2xl font-black shadow-lg">X</div>
                                                    <div>
                                                        <h3 className="font-display font-black text-white text-lg tracking-tight">Twitter Pipeline</h3>
                                                        <p className="text-xs text-slate-500 font-medium tracking-wide">High-Engagement Stream</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleCopy(Array.isArray(content) ? content.join('\n\n---\n\n') : content)}
                                                    className="btn-secondary bg-white text-black hover:bg-slate-200 py-2.5 px-6 text-xs flex items-center gap-2 border-none"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                                    COPY FULL STREAM
                                                </button>
                                            </div>
                                            <div className="space-y-6 relative">
                                                {/* Vertical line connecting tweets */}
                                                <div className="absolute left-10 top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary-500/50 via-primary-500/10 to-transparent"></div>

                                                {Array.isArray(content) ? content.map((tweet, idx) => (
                                                    <div key={idx} className="relative pl-20 group">
                                                        <div className="absolute left-6 top-6 w-9 h-9 rounded-full bg-base-950 border-2 border-primary-500/50 flex items-center justify-center text-primary-400 font-mono text-xs font-black z-10 shadow-glow-cyan transition-transform group-hover:scale-110">
                                                            {idx + 1}
                                                        </div>
                                                        <div className="bg-white/[0.03] rounded-2xl border border-white/5 overflow-hidden shadow-xl transition-all group-hover:bg-white/[0.05] group-hover:border-white/10">
                                                            <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Post Artifact 0{idx + 1}</span>
                                                                <div className="flex items-center gap-4">
                                                                    <span className={`text-[10px] font-mono font-bold ${tweet.length > 280 ? 'text-red-400' : 'text-slate-500'}`}>
                                                                        {tweet.length} / 280
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleCopy(tweet)}
                                                                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-primary-500/20 text-slate-500 hover:text-primary-400 flex items-center justify-center transition-all"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="p-8 text-slate-200 text-lg leading-relaxed whitespace-pre-wrap tracking-tight">
                                                                {tweet}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : null}
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="prose prose-invert prose-emerald max-w-none prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary-400 prose-strong:text-primary-400 transition-all duration-500"
                                            dangerouslySetInnerHTML={{ __html: content }}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stage 2: Strategy Sidebar */}
                <div className="space-y-8">
                    {/* SEO Strategy Card */}
                    <div className="card bg-white/[0.02] border-white/5 shadow-2xl space-y-8">
                        <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-display font-black text-white text-base leading-none uppercase tracking-tight">Strategy Pack</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">SEO Core Metadata</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Meta Title</span>
                                <div className="text-xs font-bold bg-base-950 p-4 rounded-xl border border-white/5 text-slate-300 leading-relaxed group hover:border-primary-500/30 transition-all">
                                    {articleData?.seo?.metaTitle || 'No Title Generated'}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description Protocol</span>
                                <div className="text-xs font-bold bg-base-950 p-4 rounded-xl border border-white/5 text-slate-300 leading-relaxed group hover:border-primary-500/30 transition-all italic">
                                    "{articleData?.seo?.metaDescription || 'No description synthesized.'}"
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <button
                                onClick={handleCopy}
                                className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all duration-500 flex items-center justify-center gap-3 ${copied
                                    ? 'bg-emerald-500 text-white shadow-glow-emerald scale-105'
                                    : 'bg-primary-500 text-white shadow-glow-cyan hover:scale-[1.02]'
                                    }`}
                            >
                                {copied ? (
                                    <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> SYNCED</>
                                ) : (
                                    <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg> COPY HTML</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Export Protocol Card */}
                    <div className="card bg-white/[0.02] border-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </div>
                            <h3 className="font-display font-black text-white text-base leading-none uppercase tracking-tight">Export Stream</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={handleExportPDF} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all text-xs font-black uppercase tracking-widest">
                                <span>PDF Archive</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </button>
                            <button onClick={handleExportMarkdown} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all text-xs font-black uppercase tracking-widest">
                                <span>Markdown</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 4v4h4" /></svg>
                            </button>
                            <button onClick={handleExportText} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all text-xs font-black uppercase tracking-widest">
                                <span>Plain Text</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full text-center text-slate-600 hover:text-primary-400 font-black text-[10px] uppercase tracking-[0.3em] transition-all py-4"
                    >
                        Re-Engineer Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StepArticleOutput;
