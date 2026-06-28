import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

const emotionColors = {
    happy: 'bg-emerald-500/20 text-emerald-400',
    excited: 'bg-emerald-500/20 text-emerald-400',
    grateful: 'bg-emerald-500/20 text-emerald-400',
    hopeful: 'bg-blue-500/20 text-blue-400',
    neutral: 'bg-neutral-500/20 text-neutral-400',
    sad: 'bg-indigo-500/20 text-indigo-400',
    exhausted: 'bg-indigo-500/20 text-indigo-400',
    anxious: 'bg-amber-500/20 text-amber-400',
    angry: 'bg-rose-500/20 text-rose-400',
    frustrated: 'bg-rose-500/20 text-rose-400',
};

const getMoodColor = (score) => {
    if (score >= 7) return 'bg-emerald-500';
    if (score >= 4) return 'bg-amber-500';
    return 'bg-rose-500';
};

export default function JournalCard({ entry }) {
    const emotion = entry.analysis?.emotion || 'neutral';
    const score = entry.analysis?.mood_score || 5;
    const badgeColor = emotionColors[emotion] || emotionColors.neutral;
    const barColor = getMoodColor(score);
    const date = new Date(entry.created_at);

    return (
        <div className="group bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-300 flex flex-col h-full cursor-pointer">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(date, 'MMM d, yyyy')}
                    </div>
                    {entry.analysis && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${badgeColor}`}>
                            {emotion}
                        </span>
                    )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{entry.title || 'Untitled Entry'}</h3>
                <p className="text-neutral-400 text-sm line-clamp-3 leading-relaxed">
                    {entry.content}
                </p>
            </div>
            
            {entry.analysis && (
                <div className="w-full h-1.5 bg-neutral-900 relative">
                    <div 
                        className={`absolute top-0 left-0 h-full ${barColor} transition-all duration-1000`} 
                        style={{ width: `${score * 10}%` }}
                    />
                </div>
            )}
        </div>
    );
}
