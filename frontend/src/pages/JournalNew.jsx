import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import SkeletonCard from '../components/ui/SkeletonCard';
import AnalysisResult from '../components/journal/AnalysisResult';
import { Bot, Save, ArrowLeft, Loader2, RefreshCw, PenSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)] h-full lg:h-[calc(100vh-4rem)]">
            <button 
                onClick={() => navigate('/journal')}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group w-fit min-h-[44px]"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Journal
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full lg:h-[calc(100%-4rem)] pb-8">
                {/* Left Column: Editor */}
                <div className="flex flex-col h-full min-h-[400px]">
                    <form id="journal-form" onSubmit={handleSubmit} className="flex flex-col h-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
                        <input
                            type="text"
                            placeholder="Give your entry a title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={hasAnalyzed || analysisFailed || isAnalyzing}
                            className="text-2xl font-bold bg-transparent border-none text-gray-900 placeholder:text-gray-400 focus:ring-0 px-0 mb-4 outline-none w-full disabled:opacity-50"
                        />
                        
                        <textarea
                            placeholder="What's on your mind today? Write as much as you need..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={hasAnalyzed || analysisFailed || isAnalyzing}
                            className="flex-grow resize-none bg-transparent border-none text-gray-700 placeholder:text-gray-400 focus:ring-0 px-0 outline-none text-lg leading-relaxed disabled:opacity-50 min-h-[200px]"
                        />

                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-500">{wordCount} words</span>
                            
                            {!hasAnalyzed && !analysisFailed && (
                                <button
                                    type="submit"
                                    disabled={isSaving || isAnalyzing || content.trim().length < 10}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isSaving ? 'Saving...' : 'Save & Analyze'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right Column: AI Analysis Panel */}
                <div className="h-full flex flex-col min-h-[400px]">
                    {!isAnalyzing && !hasAnalyzed && !analysisFailed && (
                        <div className="flex-grow border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                                <Bot className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing your entry...</h3>
                            <p className="text-gray-500 max-w-sm">
                                Write your journal entry on the left and click "Save & Analyze". 
                                Google Gemini will process your thoughts and provide emotional insights.
                            </p>
                        </div>
                    )}

                    {isAnalyzing && (
                        <div className="flex-grow flex flex-col items-center justify-center">
                            <SkeletonCard />
                            <p className="mt-4 text-purple-600 animate-pulse text-sm font-medium">Analyzing your entry...</p>
                        </div>
                    )}

                    {analysisFailed && !isAnalyzing && (
                        <div className="flex-grow border border-red-200 bg-red-50 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <Bot className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-red-900 mb-2">Analysis Unavailable</h3>
                            <p className="text-red-700 max-w-sm mb-6">
                                Your entry was saved successfully, but we couldn't generate AI insights right now. 
                            </p>
                            <button
                                onClick={() => handleSubmit()}
                                className="bg-white border border-red-200 hover:bg-red-50 text-red-700 px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Retry Analysis
                            </button>
                        </div>
                    )}

                    {hasAnalyzed && (
                        <div className="flex-grow flex flex-col">
                            <AnalysisResult analysis={analysisResult} />
                            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 w-full">
                                <button 
                                    onClick={() => navigate('/journal')}
                                    className="px-6 py-2.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm min-h-[44px] w-full sm:w-auto"
                                >
                                    View All Entries
                                </button>
                                <button 
                                    onClick={resetForm}
                                    className="px-6 py-2.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto"
                                >
                                    <PenSquare className="w-4 h-4" />
                                    Write Another
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
