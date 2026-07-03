import { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateEntry } from '../../api/journal';
import axiosInstance from '../../api/axiosInstance';

export default function EditEntryModal({ isOpen, onClose, entry, onSuccess }) {
    const [title, setTitle] = useState(entry?.title || '');
    const [content, setContent] = useState(entry?.content || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && entry) {
            setTitle(entry.title || '');
            setContent(entry.content || '');
        }
    }, [isOpen, entry]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateEntry(entry.id, { title, content });
            
            // Re-run AI analysis
            await axiosInstance.post(`/analyze/${entry.id}/`);
            
            toast.success('Entry updated successfully');
            onSuccess();
            onClose();
        } catch (err) {
            toast.error('Failed to update entry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
            
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl mx-4 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Edit Journal Entry</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
                    <div className="space-y-4 overflow-y-auto pr-2 pb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input 
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="Give your entry a title..."
                            />
                        </div>
                        
                        <div className="flex-grow flex flex-col h-full min-h-[300px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea 
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full flex-grow resize-none bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all min-h-[300px]"
                                placeholder="Write your thoughts..."
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                        <button 
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
