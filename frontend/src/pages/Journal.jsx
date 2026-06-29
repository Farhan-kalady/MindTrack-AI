import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import JournalCard from '../components/journal/JournalCard';
import { PenSquare, Loader2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Journal() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const fetchEntries = async (pageNum = 1, append = false) => {
        try {
            const res = await axiosInstance.get(`/entries/?page=${pageNum}&page_size=10&ordering=-created_at`);
            const data = res.data.results ? res.data.results : res.data;
            if (append) {
                setEntries(prev => [...prev, ...data]);
            } else {
                setEntries(data);
            }
            setHasMore(res.data.next !== null && res.data.next !== undefined);
        } catch (err) {
            toast.error("Failed to load journal entries.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setLoading(true);
        fetchEntries(1, false);
    }, [user, navigate]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchEntries(nextPage, true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                await axiosInstance.delete(`/entries/${id}/`);
                setEntries(prev => prev.filter(e => e.id !== id));
                toast.success("Entry deleted");
            } catch (err) {
                toast.error("Failed to delete entry");
            }
        }
    };

    const filteredEntries = entries.filter(entry => 
        (entry.title && entry.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (entry.content && entry.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Journal</h1>
                    <p className="text-gray-500 mt-1">Reflect on your days and track your emotional journey.</p>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search entries..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                        />
                    </div>
                    <Link 
                        to="/journal/new" 
                        className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg whitespace-nowrap"
                    >
                        <PenSquare className="w-4 h-4" />
                        + New Entry
                    </Link>
                </div>
            </div>

            {entries.length === 0 && !loading ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Start your first journal entry</h2>
                    <p className="text-gray-500 max-w-md mb-6">
                        You haven't written any journal entries yet. Start writing to see your emotional patterns emerge over time.
                    </p>
                    <Link 
                        to="/journal/new" 
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
                    >
                        <PenSquare className="w-4 h-4" />
                        Write your first entry
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEntries.map(entry => (
                            <JournalCard key={entry.id} entry={entry} onDelete={handleDelete} />
                        ))}
                    </div>
                    {filteredEntries.length === 0 && entries.length > 0 && (
                        <div className="text-center text-gray-500 py-12">No matching entries found.</div>
                    )}
                    {hasMore && !searchQuery && (
                        <div className="mt-8 flex justify-center">
                            <button 
                                onClick={handleLoadMore}
                                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 font-medium transition-colors"
                            >
                                Load more
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
