import React, { useState, useEffect } from 'react';
import KeywordChip from './KeywordChip';
import Loader from './Loader';
import ErrorBanner from './ErrorBanner';
import { ENDPOINTS } from '../config';

const StepKeywordSelection = ({ campaignData, keywords: initialKeywords, onBack, onNext }) => {
    const [keywords, setKeywords] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState(new Set());
    const [newKeyword, setNewKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Initial sync
        if (initialKeywords && initialKeywords.length > 0) {
            console.log('🔍 Received keywords:', initialKeywords);
            console.log('🔍 Keywords type:', typeof initialKeywords);
            console.log('🔍 Is array?', Array.isArray(initialKeywords));
            console.log('🔍 First keyword:', initialKeywords[0]);

            setKeywords(initialKeywords);
            // Let user choose keywords manually instead of auto-selecting all
            setSelectedKeywords(new Set());
        }
    }, [initialKeywords]);

    const toggleKeyword = (keyword) => {
        const nextSelected = new Set(selectedKeywords);
        if (nextSelected.has(keyword)) {
            nextSelected.delete(keyword);
        } else {
            nextSelected.add(keyword);
        }
        setSelectedKeywords(nextSelected);
    };

    const removeKeyword = (keywordToRemove) => {
        setKeywords(keywords.filter(k => k !== keywordToRemove));
        if (selectedKeywords.has(keywordToRemove)) {
            const nextSelected = new Set(selectedKeywords);
            nextSelected.delete(keywordToRemove);
            setSelectedKeywords(nextSelected);
        }
    };

    const addKeyword = (e) => {
        e.preventDefault();
        if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            const k = newKeyword.trim();
            setKeywords([...keywords, k]);
            setSelectedKeywords(prev => new Set(prev).add(k)); // Auto-select added keyword
            setNewKeyword('');
        }
    };

    const handleGenerateArticle = async () => {
        if (selectedKeywords.size === 0) {
            setError('Please select at least one keyword.');
            return;
        }

        setLoading(true);
        setError(null);

        const payload = {
            step: campaignData.contentType || 'article',
            campaignDescription: campaignData.campaignDescription,
            targetAudience: campaignData.targetAudience,
            tone: campaignData.tone,
            keywords: Array.from(selectedKeywords),
        };

        try {
            console.log('🚀 Calling article generation webhook...');
            console.log('📤 Request payload:', payload);
            console.log('🔗 Endpoint:', ENDPOINTS.GENERATE_KEYWORDS);

            const response = await fetch(ENDPOINTS.GENERATE_KEYWORDS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            console.log('📡 Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error:', errorText);
                throw new Error(`Failed to generate article: ${response.status}`);
            }

            const data = await response.json();
            console.log('📥 Raw article response:', data);
            console.log('📊 Response type:', Array.isArray(data) ? 'Array' : typeof data);

            // Parse n8n article response format
            let articleData = null;
            const firstItem = Array.isArray(data) ? data[0] : data;

            if (firstItem) {
                // Check for different content types based on n8n keys
                if (firstItem.linkedinPost) {
                    console.log('✅ Detected LinkedIn format');
                    articleData = {
                        article: {
                            title: 'LinkedIn Post',
                            content: firstItem.linkedinPost,
                            wordCount: firstItem.characterCount || 0
                        },
                        seo: { metaTitle: '', metaDescription: '' }
                    };
                } else if (firstItem.twitterThread) {
                    console.log('✅ Detected Twitter Thread format');
                    articleData = {
                        article: {
                            title: 'Twitter Thread',
                            content: firstItem.twitterThread, // This is an array
                            wordCount: firstItem.totalTweets || 0
                        },
                        seo: { metaTitle: '', metaDescription: '' }
                    };
                } else if (firstItem.htmlCaseStudy) {
                    console.log('✅ Detected Case Study format');
                    articleData = {
                        article: {
                            title: '', // Will be extracted from HTML or default
                            content: firstItem.htmlCaseStudy,
                            wordCount: firstItem.wordCount || 0
                        },
                        seo: { metaTitle: '', metaDescription: '' }
                    };
                } else if (firstItem.htmlArticle) {
                    console.log('✅ Detected HTML article format');
                    articleData = {
                        article: {
                            title: '',
                            content: firstItem.htmlArticle,
                            wordCount: firstItem.wordCount || 0
                        },
                        seo: { metaTitle: '', metaDescription: '' }
                    };
                }
            }

            // Fallback: legacy format or mock
            if (!articleData) {
                if (data.article && data.article.content) {
                    console.log('✅ Detected legacy article format');
                    articleData = data;
                } else {
                    console.warn('⚠️ API returned unknown data structure, using fallback');
                    // ... fallback mock logic ...
                    articleData = {
                        article: {
                            title: `Generated Content`,
                            content: typeof data === 'string' ? data : JSON.stringify(data),
                            wordCount: 0
                        },
                        seo: { metaTitle: '', metaDescription: '' }
                    };
                }
            }

            onNext(articleData, Array.from(selectedKeywords));
        } catch (err) {
            setError(err.message || 'Error generating article.');
        } finally {
            setLoading(false);
        }
    };

    const getLoadingMessage = () => {
        const type = campaignData?.contentType;
        switch (type) {
            case 'linkedin': return 'Crafting high-engagement social post...';
            case 'twitter': return 'Sequencing neural Twitter thread...';
            case 'case-study': return 'Generating strategic case study...';
            default: return 'Composing SEO-optimized article...';
        }
    };

    if (loading) {
        return (
            <div className="card min-h-[400px] flex items-center justify-center premium-border">
                <Loader text={getLoadingMessage()} />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in-up">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            <div className="card space-y-10 premium-border">
                {/* Add custom keyword */}
                <form onSubmit={addKeyword} className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 text-sm font-bold border border-primary-500/20">01</span>
                        <label className="block text-sm font-black text-slate-300 uppercase tracking-[0.2em]">
                            Custom Search Terms
                        </label>
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            className="input-field text-lg font-medium"
                            placeholder="Type a neural search term..."
                        />
                        <button
                            type="submit"
                            disabled={!newKeyword.trim()}
                            className="btn-secondary px-8 flex items-center gap-2 group"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            Add
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                    <div className="flex items-center justify-between bg-white/[0.02] p-4 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 text-sm font-bold border border-primary-500/20">02</span>
                            <label className="block text-sm font-black text-slate-300 uppercase tracking-[0.2em]">
                                Optimized Keyword Cloud
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-4 px-4 py-2 bg-base-950 rounded-lg border border-white/5 mr-4">
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">Selection Engine</span>
                                <span className="text-primary-400 font-mono font-bold text-sm">
                                    {selectedKeywords.size} / {keywords.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedKeywords(new Set(keywords))}
                                className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-lg hover:bg-primary-500/20 transition-all"
                            >
                                All
                            </button>
                            <button
                                onClick={() => setSelectedKeywords(new Set())}
                                className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 text-slate-500 border border-white/5 rounded-lg hover:bg-white/10 hover:text-slate-300 transition-all"
                            >
                                None
                            </button>
                        </div>
                    </div>

                    {keywords.length > 0 ? (
                        <div className="flex flex-wrap gap-4 p-2">
                            {keywords.map((keyword, index) => (
                                <KeywordChip
                                    key={`${keyword}-${index}`}
                                    keyword={keyword}
                                    isSelected={selectedKeywords.has(keyword)}
                                    onToggle={() => toggleKeyword(keyword)}
                                    onRemove={() => removeKeyword(keyword)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-slate-500 bg-white/[0.02] rounded-2xl border-2 border-dashed border-white/5">
                            <div className="mb-4 opacity-20 flex justify-center">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <p className="font-medium">No search terms initialized.</p>
                            <p className="text-xs mt-1">Add custom keywords to begin selection process.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between pt-8">
                <button
                    onClick={onBack}
                    className="btn-secondary group flex items-center gap-3 px-8"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    Previous Phase
                </button>
                <button
                    onClick={handleGenerateArticle}
                    disabled={selectedKeywords.size === 0}
                    className="btn-primary min-w-[280px] py-4 text-xl tracking-tighter font-black flex items-center justify-center gap-4 group"
                >
                    <span>COMPOSE CONTENT</span>
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default StepKeywordSelection;
