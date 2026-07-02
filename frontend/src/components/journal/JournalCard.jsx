import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import EditEntryModal from './EditEntryModal';
import { GlowCard } from '../ui/CinematicUI';

const emotionColors = {
    happy: 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30',
    sad: 'bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30',
    anxious: 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30',
    neutral: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
    angry: 'bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30',
    excited: 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30',
    grateful: 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30',
    exhausted: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
    frustrated: 'bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/30',
    hopeful: 'bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30',
};

const getMoodColor = (score) => {
    if (score >= 7) return 'bg-[#10B981]';
    if (score >= 4) return 'bg-[#F59E0B]';
    return 'bg-[#EF4444]';
};

export default function JournalCard({ entry, onDelete }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const emotion = entry.analysis?.emotion || 'neutral';
    const score = entry.analysis?.mood_score || 5;
    const sentiment = entry.analysis?.sentiment || 'Neutral';
    const badgeColor = emotionColors[emotion] || emotionColors.neutral;
    const barColor = getMoodColor(score);
    const date = new Date(entry.created_at);

    const handleEditSuccess = () => {
        window.location.reload();
    };

    return (
        <>
            <GlowCard className="group flex flex-col h-full overflow-hidden hover:-translate-y-[2px] font-mono">
                <div className="p-5 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(date, 'MMM d, yyyy · h:mm a')}
                        </div>
                        <div className="flex gap-2">
                            {entry.analysis && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300 border border-white/20 capitalize">
                                    {sentiment}
                                </span>
                            )}
                            {entry.analysis && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${badgeColor}`}>
                                    {emotion}
                                </span>
                            )}
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{entry.title || 'Untitled Entry'}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                        {entry.content}
                    </p>
                    
                    {entry.analysis && (
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-400">Mood Score: <strong className="text-white">{score} / 10</strong></span>
                        </div>
                    )}
                </div>
                
                <div className="px-5 pb-4 flex justify-end gap-2 border-t border-white/10 pt-3 bg-black/20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-purple-400 rounded-md hover:bg-purple-500/20 transition-colors"
                        title="Edit Entry"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(entry.id)}
                        className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-400 rounded-md hover:bg-red-500/20 transition-colors"
                        title="Delete Entry"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                
                {entry.analysis && (
                    <div className="w-full h-1.5 bg-white/10 relative">
                        <div 
                            className={`absolute top-0 left-0 h-full ${barColor} transition-all duration-1000`} 
                            style={{ width: `${score * 10}%` }}
                        />
                    </div>
                )}
            </GlowCard>

            <EditEntryModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                entry={entry} 
                onSuccess={handleEditSuccess}
            />
        </>
    );
}
