import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import SkeletonCard from '../components/ui/SkeletonCard';
import AnalysisResult from '../components/journal/AnalysisResult';
import { Bot, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function JournalNew() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    
    // AI State
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    const handleSaveAndAnalyze = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error("Please write something before saving.");
            return;
        }

        setSaving(true);
        try {
            // Step 1: Save Journal Entry
            const saveRes = await axiosInstance.post('/entries/', { title, content });
            const entryId = saveRes.data.id;
            
            toast.success("Journal saved!");
            setSaving(false);
            
            // Step 2: Trigger AI Analysis
            setAnalyzing(true);
            const analyzeRes = await axiosInstance.post(`/analyze/${entryId}/`);
            setAnalysisResult(analyzeRes.data);
            setHasAnalyzed(true);
            toast.success("AI analysis complete");
        } catch (err) {
            console.error(err);
            toast.error("An error occurred during the process.");
            setSaving(false);
            setAnalyzing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)]">
            <button 
                onClick={() => navigate('/journal')}
                className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-6 group w-fit"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Journal
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full pb-8">
                {/* Left Column: Editor */}
                <div className="flex flex-col h-full min-h-[400px]">
                    <form id="journal-form" onSubmit={handleSaveAndAnalyze} className="flex flex-col h-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-inner relative">
                        <input
                            type="text"
                            placeholder="Give your entry a title (optional)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={hasAnalyzed}
                            className="text-2xl font-bold bg-transparent border-none text-white placeholder:text-neutral-600 focus:ring-0 px-0 mb-4 outline-none w-full disabled:opacity-50"
                        />
                        
                        <textarea
                            placeholder="What's on your mind today? Write as much as you need..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={hasAnalyzed}
                            className="flex-grow resize-none bg-transparent border-none text-neutral-300 placeholder:text-neutral-600 focus:ring-0 px-0 outline-none text-lg leading-relaxed disabled:opacity-50"
                        />

                        {!hasAnalyzed && (
                            <div className="pt-4 border-t border-neutral-800 flex justify-end mt-4">
                                <button
                                    type="submit"
                                    disabled={saving || analyzing || !content.trim()}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-purple-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {saving ? 'Saving...' : 'Save & Analyze'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Right Column: AI Analysis Panel */}
                <div className="h-full flex flex-col min-h-[400px]">
                    {!analyzing && !hasAnalyzed && (
                        <div className="flex-grow border-2 border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-neutral-900/50">
                            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                                <Bot className="w-8 h-8 text-neutral-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">AI Analysis Waiting</h3>
                            <p className="text-neutral-400 max-w-sm">
                                Write your journal entry on the left and click "Save & Analyze". 
                                Google Gemini will process your thoughts and provide emotional insights.
                            </p>
                        </div>
                    )}

                    {analyzing && !hasAnalyzed && (
                        <div className="flex-grow flex flex-col items-center justify-center">
                            <SkeletonCard />
                            <p className="mt-4 text-purple-400 animate-pulse text-sm font-medium">Gemini is analyzing your thoughts...</p>
                        </div>
                    )}

                    {hasAnalyzed && (
                        <div className="flex-grow flex flex-col">
                            <AnalysisResult analysis={analysisResult} />
                            <div className="mt-8 flex justify-center">
                                <button 
                                    onClick={() => navigate('/dashboard')}
                                    className="text-neutral-400 hover:text-white text-sm font-medium transition-colors border-b border-transparent hover:border-white pb-0.5"
                                >
                                    Continue to Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
