import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import JournalCard from '../components/journal/JournalCard';
import { PenSquare, Loader2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
    ScrambleIn, 
    FadeIn, 
    Watermark, 
    GlowCard, 
    PrimaryButton,
    GhostButton
} from '../components/ui/CinematicUI';

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

    if (loading && entries.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center relative">
                <Loader2 className="w-8 h-8 text-[#C026D3] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative font-mono min-h-screen">
            <Watermark text="REFLECT" />
            
            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6 w-full">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-widest uppercase mb-2">
                            <ScrambleIn text="My Journal" />
                        </h1>
                        <FadeIn delay={0.2} y={10}>
                            <p className="text-white/60">Reflect on your days and track your emotional journey.</p>
                        </FadeIn>
                    </div>
                    
                    <FadeIn delay={0.3} y={10} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input 
                                type="text" 
                                placeholder="Search entries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/30 focus:outline-none focus:border-[#C026D3] focus:ring-1 focus:ring-[#C026D3] transition-all text-sm font-sans"
                            />
                        </div>
                        <Link 
                            to="/journal/new" 
                            className="w-full sm:w-auto"
                        >
                            <PrimaryButton className="w-full text-xs py-3 px-6 flex items-center justify-center gap-2">
                                <PenSquare className="w-4 h-4" />
                                New Entry
                            </PrimaryButton>
                        </Link>
                    </FadeIn>
                </div>

                <FadeIn delay={0.4} y={20}>
                    {entries.length === 0 && !loading ? (
                        <GlowCard className="p-12 text-center flex flex-col items-center">
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4">Start your first journal entry</h2>
                            <p className="text-white/60 max-w-md mb-8 leading-relaxed font-sans font-light">
                                You haven't written any journal entries yet. Start writing to see your emotional patterns emerge over time.
                            </p>
                            <Link to="/journal/new">
                                <PrimaryButton className="text-xs py-3 px-6 flex items-center justify-center gap-2">
                                    <PenSquare className="w-4 h-4" />
                                    Write your first entry
                                </PrimaryButton>
                            </Link>
                        </GlowCard>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEntries.map(entry => (
                                    <JournalCard key={entry.id} entry={entry} onDelete={handleDelete} />
                                ))}
                            </div>
                            
                            {filteredEntries.length === 0 && entries.length > 0 && (
                                <div className="text-center text-white/40 py-12 uppercase tracking-widest text-sm font-bold">
                                    No matching entries found.
                                </div>
                            )}
                            
                            {hasMore && !searchQuery && (
                                <div className="mt-12 flex justify-center">
                                    <GhostButton 
                                        onClick={handleLoadMore}
                                        className="text-xs py-3 px-8"
                                    >
                                        Load more entries
                                    </GhostButton>
                                </div>
                            )}
                        </>
                    )}
                </FadeIn>
            </div>
        </div>
    );
}
