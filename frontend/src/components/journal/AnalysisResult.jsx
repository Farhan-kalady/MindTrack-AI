import { BrainCircuit, Sparkles } from 'lucide-react';
import CrisisBanner from '../ui/CrisisBanner';
import { GlowCard } from '../ui/CinematicUI';

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
        <div className="w-full font-mono">
            {crisis_detected && <CrisisBanner />}
            
            <GlowCard className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C026D3]/20 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none" />
                
                <div className="flex items-center gap-2 mb-6">
                    <BrainCircuit className="w-5 h-5 text-[#C026D3]" />
                    <h3 className="text-sm font-bold tracking-widest uppercase text-white">AI Insights</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-[10px] text-white/40 mb-1 font-bold uppercase tracking-widest">Primary Emotion</p>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${badgeColor}`}>
                            {emotion}
                        </span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-[10px] text-white/40 mb-1 font-bold uppercase tracking-widest">Sentiment</p>
                        <span className="text-white uppercase text-xs tracking-widest font-bold">{sentiment}</span>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/60">Mood Score</p>
                        <span className="text-xl font-bold text-white font-sans">{mood_score}<span className="text-xs text-white/40 font-normal">/10</span></span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${barColor} transition-all duration-1000 ease-out`}
                            style={{ width: `${mood_score * 10}%` }}
                        />
                    </div>
                </div>

                <div className="bg-[#C026D3]/10 border border-[#C026D3]/20 rounded-xl p-5 relative overflow-hidden">
                    <div className="flex items-start gap-3 relative z-10">
                        <Sparkles className="w-5 h-5 text-[#C026D3] flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#C026D3] mb-2">Wellness Suggestion</h4>
                            <p className="text-sm text-white/80 leading-relaxed font-sans font-light">
                                {wellness_suggestion}
                            </p>
                        </div>
                    </div>
                </div>
            </GlowCard>
        </div>
    );
}
