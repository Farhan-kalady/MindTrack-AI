import { BrainCircuit, Sparkles } from 'lucide-react';
import CrisisBanner from '../ui/CrisisBanner';

const emotionColors = {
    happy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    excited: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    grateful: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    hopeful: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    neutral: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
    sad: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    exhausted: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    anxious: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    angry: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    frustrated: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

const getMoodColor = (score) => {
    if (score >= 7) return 'bg-emerald-500';
    if (score >= 4) return 'bg-amber-500';
    return 'bg-rose-500';
};

export default function AnalysisResult({ analysis }) {
    if (!analysis) return null;

    const { emotion, sentiment, mood_score, wellness_suggestion, crisis_detected } = analysis;
    const badgeColor = emotionColors[emotion?.toLowerCase()] || emotionColors.neutral;
    const barColor = getMoodColor(mood_score);

    return (
        <div className="w-full animate-slide-up">
            {crisis_detected && <CrisisBanner />}
            
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                
                <div className="flex items-center gap-2 mb-6">
                    <BrainCircuit className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">AI Insights</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                        <p className="text-xs text-neutral-500 mb-1 font-medium uppercase tracking-wider">Primary Emotion</p>
                        <span className={`inline-flex px-3 py-1 rounded-md text-sm font-medium capitalize border ${badgeColor}`}>
                            {emotion}
                        </span>
                    </div>
                    <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                        <p className="text-xs text-neutral-500 mb-1 font-medium uppercase tracking-wider">Sentiment</p>
                        <span className="text-white capitalize font-medium">{sentiment}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-sm font-medium text-neutral-300">Mood Score</p>
                        <span className="text-xl font-bold text-white">{mood_score}<span className="text-sm text-neutral-500 font-normal">/10</span></span>
                    </div>
                    <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${mood_score * 10}%` }}
                        />
                    </div>
                </div>

                <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4 relative overflow-hidden">
                    <div className="flex items-start gap-3 relative z-10">
                        <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-purple-300 mb-1">Wellness Suggestion</h4>
                            <p className="text-sm text-neutral-300 leading-relaxed">
                                {wellness_suggestion}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
