import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import SkeletonCard from '../components/ui/SkeletonCard';
import AnalysisResult from '../components/journal/AnalysisResult';
import { Bot, Save, ArrowLeft, Loader2, RefreshCw, PenSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
    ScrambleIn, 
    FadeIn, 
    Watermark, 
    GlowCard, 
    PrimaryButton, 
    GhostButton 
} from '../components/ui/CinematicUI';

export default function JournalNew() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // AI State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [analysisFailed, setAnalysisFailed] = useState(false);
    const [entryId, setEntryId] = useState(null);

    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!content.trim() || content.trim().length < 10) {
            toast.error('Please write something in your journal before saving (at least 10 characters).');
            return;
        }
        
        setIsSaving(true);
        try {
            const response = await api.post('/entries/', {
                title: title.trim(),
                content: content.trim(),
            });
            
            const newEntryId = response.data.id;
            setEntryId(newEntryId);
            setIsSaving(false);
            setIsAnalyzing(true);
            
            const analysisResponse = await api.post(`/analyze/${newEntryId}/`);
            setAnalysisResult(analysisResponse.data);
            setHasAnalyzed(true);
            setIsAnalyzing(false);
            
        } catch (error) {
            setIsSaving(false);
            setIsAnalyzing(false);
            console.error('Save error:', error.response?.data || error.message);
            toast.error('Failed to save entry.');
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setHasAnalyzed(false);
        setAnalysisFailed(false);
        setEntryId(null);
        setAnalysisResult(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative font-mono min-h-screen flex flex-col">
            <Watermark text="REFLECT" />
            
            <div className="relative z-10 flex-grow flex flex-col">
                <button 
                    onClick={() => navigate('/journal')}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors mb-8 group w-fit"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Journal
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-widest uppercase mb-2">
                        <ScrambleIn text="Write Freely" />
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
                    {/* Left Column: Editor */}
                    <FadeIn delay={0.1} y={20} className="flex flex-col h-full min-h-[500px]">
                        <GlowCard className="flex flex-col h-full p-6 lg:p-8 relative">
                            <form id="journal-form" onSubmit={handleSubmit} className="flex flex-col h-full">
                                <input
                                    type="text"
                                    placeholder="Give your entry a title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={hasAnalyzed || analysisFailed || isAnalyzing}
                                    className="text-xl font-bold bg-transparent border-none text-white placeholder:text-white/20 focus:ring-0 px-0 mb-6 outline-none w-full disabled:opacity-50 tracking-widest uppercase"
                                />
                                
                                <textarea
                                    placeholder="What's on your mind today? Write as much as you need..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={hasAnalyzed || analysisFailed || isAnalyzing}
                                    className="flex-grow resize-none bg-transparent border-none text-white/80 placeholder:text-white/30 focus:ring-0 px-0 outline-none text-base md:text-lg leading-relaxed disabled:opacity-50 min-h-[300px] font-sans font-light scrollbar-hide"
                                />

                                <div className="pt-6 mt-4 flex justify-between items-center relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0">
                                    <span className="text-xs uppercase tracking-widest font-bold text-white/40">{wordCount} words</span>
                                    
                                    {!hasAnalyzed && !analysisFailed && (
                                        <PrimaryButton
                                            type="submit"
                                            disabled={isSaving || isAnalyzing || content.trim().length < 10}
                                            className="text-xs py-3 px-6 flex items-center justify-center gap-2"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {isSaving ? 'Saving...' : 'Analyze Entry'}
                                        </PrimaryButton>
                                    )}
                                </div>
                            </form>
                        </GlowCard>
                    </FadeIn>

                    {/* Right Column: AI Analysis Panel */}
                    <FadeIn delay={0.2} y={20} className="h-full flex flex-col min-h-[500px]">
                        {!isAnalyzing && !hasAnalyzed && !analysisFailed && (
                            <div className="flex-grow border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-white/[0.02]">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                                    <Bot className="w-8 h-8 text-white/40" />
                                </div>
                                <h3 className="text-sm font-bold tracking-widest uppercase text-white/60 mb-2">Awaiting Entry</h3>
                                <p className="text-white/40 text-xs leading-relaxed max-w-sm">
                                    Write your journal entry on the left and click "Analyze Entry". 
                                    Google Gemini will process your thoughts and provide emotional insights.
                                </p>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="flex-grow flex flex-col items-center justify-center">
                                <SkeletonCard />
                                <p className="mt-8 text-[#C026D3] animate-pulse text-xs tracking-widest uppercase font-bold">Analyzing your entry...</p>
                            </div>
                        )}

                        {analysisFailed && !isAnalyzing && (
                            <div className="flex-grow border border-rose-500/20 bg-rose-500/5 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6">
                                    <Bot className="w-8 h-8 text-rose-400" />
                                </div>
                                <h3 className="text-sm font-bold tracking-widest uppercase text-rose-300 mb-2">Analysis Unavailable</h3>
                                <p className="text-rose-200/60 text-xs leading-relaxed max-w-sm mb-8">
                                    Your entry was saved successfully, but we couldn't generate AI insights right now. 
                                </p>
                                <PrimaryButton
                                    onClick={() => handleSubmit()}
                                    className="bg-rose-500/20 text-rose-300 border-none hover:bg-rose-500/30 text-xs py-3 flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Retry Analysis
                                </PrimaryButton>
                            </div>
                        )}

                        {hasAnalyzed && (
                            <div className="flex-grow flex flex-col">
                                <AnalysisResult analysis={analysisResult} />
                                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 w-full">
                                    <GhostButton 
                                        onClick={() => navigate('/journal')}
                                        className="w-full sm:w-auto text-xs py-3"
                                    >
                                        View All Entries
                                    </GhostButton>
                                    <PrimaryButton 
                                        onClick={resetForm}
                                        className="text-xs py-3 flex items-center justify-center gap-2 w-full sm:w-auto"
                                    >
                                        <PenSquare className="w-4 h-4" />
                                        Write Another
                                    </PrimaryButton>
                                </div>
                            </div>
                        )}
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
