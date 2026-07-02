import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import EditEntryModal from './EditEntryModal';

const emotionColors = {
    happy: 'bg-[#FEF3C7] text-[#92400E]',
    sad: 'bg-[#DBEAFE] text-[#1E40AF]',
    anxious: 'bg-[#FEF9C3] text-[#713F12]',
    neutral: 'bg-[#F3F4F6] text-[#374151]',
    angry: 'bg-[#FEE2E2] text-[#991B1B]',
    excited: 'bg-[#FEF3C7] text-[#92400E]',
    grateful: 'bg-[#FEF3C7] text-[#92400E]',
    exhausted: 'bg-[#F3F4F6] text-[#374151]',
    frustrated: 'bg-[#FEE2E2] text-[#991B1B]',
    hopeful: 'bg-[#DBEAFE] text-[#1E40AF]',
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
        // As per requirements: "Re-fetch the journal list so the card updates immediately"
        // This is a direct approach without modifying the parent component's structure.
        window.location.reload();
    };

    return (
        <>
            <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:-translate-y-[2px] hover:shadow-[0_4px_20px_rgba(124,58,237,0.15)] transition-all duration-300 flex flex-col h-full">
                <div className="p-5 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(date, 'MMM d, yyyy · h:mm a')}
                        </div>
                        <div className="flex gap-2">
                            {entry.analysis && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{entry.title || 'Untitled Entry'}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {entry.content}
                    </p>
                    
                    {entry.analysis && (
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">Mood Score: <strong className="text-gray-900">{score} / 10</strong></span>
                        </div>
                    )}
                </div>
                
                <div className="px-5 pb-4 flex justify-end gap-2 border-t border-gray-50 pt-3 bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 rounded-md hover:bg-purple-50 transition-colors"
                        title="Edit Entry"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(entry.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete Entry"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                
                {entry.analysis && (
                    <div className="w-full h-1.5 bg-gray-100 relative">
                        <div 
                            className={`absolute top-0 left-0 h-full ${barColor} transition-all duration-1000`} 
                            style={{ width: `${score * 10}%` }}
                        />
                    </div>
                )}
            </div>

            <EditEntryModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                entry={entry} 
                onSuccess={handleEditSuccess}
            />
        </>
    );
}
