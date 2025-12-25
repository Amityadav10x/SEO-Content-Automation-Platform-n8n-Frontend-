import React, { useState } from 'react';
import { ENDPOINTS } from '../config';
import Loader from './Loader';
import ErrorBanner from './ErrorBanner';

const tones = [
    { id: 'professional', label: 'Professional', emoji: '👔' },
    { id: 'casual', label: 'Casual', emoji: '🙂' },
    { id: 'technical', label: 'Technical', emoji: '🔧' },
    { id: 'enthusiastic', label: 'Enthusiastic', emoji: '🤩' },
    { id: 'authoritative', label: 'Authoritative', emoji: '📢' },
];

const contentTypes = [
    { id: 'article', label: 'SEO Article', emoji: '📄', description: 'Long-form optimized content' },
    { id: 'linkedin', label: 'LinkedIn Post', emoji: '💼', description: 'Professional social post' },
    { id: 'twitter', label: 'Twitter Thread', emoji: '🐦', description: 'Engaging tweet series' },
    { id: 'case-study', label: 'Case Study', emoji: '📊', description: 'Detailed success story' },
];

const StepCampaignInput = ({ onNext, initialData }) => {
    const [formData, setFormData] = useState({
        campaignDescription: initialData.campaignDescription || '',
        targetAudience: initialData.targetAudience || '',
        tone: initialData.tone || 'professional',
        contentType: initialData.contentType || 'article',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToneSelect = (toneId) => {
        setFormData(prev => ({ ...prev, tone: toneId }));
    };

    const handleContentTypeSelect = (typeId) => {
        setFormData(prev => ({ ...prev, contentType: typeId }));
    };

    const handleSubmit = async () => {
        if (!formData.campaignDescription || !formData.targetAudience) {
            setError('Please fill in all required fields.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('🚀 Calling keyword generation webhook...');
            console.log('📤 Request payload:', formData);
            console.log('🔗 Endpoint:', ENDPOINTS.GENERATE_KEYWORDS);

            const response = await fetch(ENDPOINTS.GENERATE_KEYWORDS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    step: 'keywords'
                }),
            });

            console.log('📡 Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error:', errorText);
                throw new Error(`Failed to generate keywords: ${response.status}`);
            }

            const data = await response.json();
            console.log('📥 Raw response data:', data);
            console.log('📊 Data type:', Array.isArray(data) ? 'Array' : typeof data);

            // Parse n8n response format: array of objects with 'keyword' property
            // Expected: [{ "keyword": "..." }, { "keyword": "..." }, ...]
            let keywords = [];

            if (Array.isArray(data)) {
                console.log('✅ Detected array format, extracting keywords...');
                console.log('📊 Array length:', data.length);
                console.log('📊 First item:', data[0]);

                // Check if it's array of objects with 'keyword' property
                if (data.length > 0 && data[0] && typeof data[0] === 'object' && 'keyword' in data[0]) {
                    console.log('🔍 Extracting from objects...');

                    // Flatten all keyword values (they might be arrays themselves)
                    keywords = data.flatMap((item, index) => {
                        console.log(`  Item ${index}:`, item, '-> keyword:', item.keyword);

                        // If keyword property is an array, return it
                        if (Array.isArray(item.keyword)) {
                            console.log('  ✅ Keyword is array, using it directly');
                            return item.keyword;
                        }
                        // If keyword property is a string, return it as single item
                        else if (typeof item.keyword === 'string') {
                            console.log('  ✅ Keyword is string');
                            return [item.keyword];
                        }
                        // Otherwise skip
                        else {
                            console.log('  ❌ Keyword is neither array nor string');
                            return [];
                        }
                    }).filter(k => {
                        const isValid = k && typeof k === 'string' && k.trim().length > 0;
                        if (!isValid) console.log('  ❌ Filtered out:', k);
                        return isValid;
                    });

                    console.log('🔑 Extracted from objects:', keywords);
                }
                // Check if it's already an array of strings
                else if (data.length > 0 && typeof data[0] === 'string') {
                    keywords = data;
                    console.log('🔑 Already string array:', keywords);
                }
                // Check if it's nested array [[...]]
                else if (data.length > 0 && Array.isArray(data[0])) {
                    console.log('🔧 Detected nested array, flattening...');
                    keywords = data.flat();
                    console.log('🔑 Flattened:', keywords);
                }
            } else if (data.keywords && Array.isArray(data.keywords)) {
                console.log('✅ Detected wrapped format, extracting keywords...');
                keywords = Array.isArray(data.keywords[0]) && typeof data.keywords[0] === 'object'
                    ? data.keywords.map(item => item.keyword).filter(k => k)
                    : data.keywords;
                console.log('🔑 Extracted keywords:', keywords);
            } else {
                console.warn('⚠️ Unexpected response format:', data);
            }

            // Final safety check: ensure it's a flat array of strings
            if (keywords.length > 0 && Array.isArray(keywords[0])) {
                console.log('🔧 Final flatten needed...');
                keywords = keywords.flat();
            }

            // Remove any non-string values
            keywords = keywords.filter(k => k && typeof k === 'string' && k.trim().length > 0);

            // Fallback if no keywords received
            if (!keywords || keywords.length === 0) {
                console.warn('⚠️ No keywords received, using fallback');
                keywords = ['fallback keyword 1', 'fallback keyword 2'];
            }

            console.log('✨ Final keywords to display:', keywords);
            console.log('✨ Total count:', keywords.length);
            onNext({ ...formData, keywords });
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="card min-h-[400px] flex items-center justify-center">
                <Loader text="Analyzing campaign and generating SEO keywords..." />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in-up">
            <ErrorBanner message={error} onDismiss={() => setError(null)} />

            <div className="card space-y-12 premium-border">
                {/* Campaign Description */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 text-sm font-bold border border-primary-500/20">01</span>
                        <label className="block text-sm font-black text-slate-300 uppercase tracking-[0.2em]">
                            Campaign Identity
                        </label>
                    </div>
                    <textarea
                        name="campaignDescription"
                        value={formData.campaignDescription}
                        onChange={handleChange}
                        rows={4}
                        className="input-field resize-none text-lg font-medium"
                        placeholder="Describe your vision (e.g., A premium fitness brand targeting weekend warriors...)"
                    />
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <svg className="w-4 h-4 text-primary-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Be specific for better neural generation results.
                    </div>
                </div>

                {/* Target Audience */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 text-sm font-bold border border-primary-500/20">02</span>
                        <label className="block text-sm font-black text-slate-300 uppercase tracking-[0.2em]">
                            Target Demographics
                        </label>
                    </div>
                    <input
                        type="text"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Who is this for?"
                    />
                </div>

                {/* Content Type Selection */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 text-sm font-bold border border-primary-500/20">03</span>
                        <label className="block text-sm font-black text-slate-300 uppercase tracking-[0.2em]">
                            Output Asset Type
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contentTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => handleContentTypeSelect(type.id)}
                                className={`group flex items-center gap-5 p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden text-left ${formData.contentType === type.id
                                    ? 'bg-primary-500/10 border-primary-500/50 shadow-glow-cyan scale-[1.02]'
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-all duration-500 ${formData.contentType === type.id ? 'bg-primary-500 text-white shadow-lg' : 'bg-white/5 text-slate-400'}`}>
                                    {type.emoji}
                                </div>
                                <div className="flex-grow">
                                    <h4 className={`font-display font-bold text-lg leading-tight mb-1 ${formData.contentType === type.id ? 'text-white' : 'text-slate-300'}`}>
                                        {type.label}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{type.description}</p>
                                </div>
                                {formData.contentType === type.id && (
                                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tone Selector */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 text-sm font-bold border border-primary-500/20">04</span>
                        <label className="block text-sm font-black text-slate-300 uppercase tracking-[0.2em]">
                            Voice & Artifact Tone
                        </label>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {tones.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => handleToneSelect(t.id)}
                                className={`group flex flex-col items-center justify-center py-5 px-3 rounded-2xl border transition-all duration-500 ${formData.tone === t.id
                                    ? 'bg-primary-500/20 border-primary-500 shadow-glow-cyan'
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <span className="text-2xl mb-2 transition-transform group-hover:scale-125 group-hover:rotate-12 duration-500">{t.emoji}</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${formData.tone === t.id ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                    {t.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <button
                    onClick={handleSubmit}
                    disabled={!formData.campaignDescription || !formData.targetAudience}
                    className="btn-primary min-w-[320px] py-4 text-xl tracking-tighter font-black flex items-center justify-center gap-4 group"
                >
                    <span>INITIALIZE GENERATION</span>
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default StepCampaignInput;
