import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import JournalCard from '../components/journal/JournalCard';
import { PenSquare, Loader2, Frown } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Journal() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        const fetchEntries = async () => {
            try {
                const res = await axiosInstance.get('/entries/');
                const data = res.data.results ? res.data.results : res.data;
                setEntries(data);
            } catch (err) {
                toast.error("Failed to load journal entries.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEntries();
    }, [user, navigate]);

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
                    <h1 className="text-3xl font-bold text-white tracking-tight">Your Journal</h1>
                    <p className="text-neutral-400 mt-1">Reflect on your days and track your emotional journey.</p>
                </div>
                <Link 
                    to="/journal/new" 
                    className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-purple-900/20"
                >
                    <PenSquare className="w-4 h-4" />
                    New Entry
                </Link>
            </div>

            {entries.length === 0 ? (
                <div className="bg-neutral-800/50 border border-neutral-800 rounded-2xl p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                        <Frown className="w-8 h-8 text-neutral-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">It's quiet here...</h2>
                    <p className="text-neutral-400 max-w-md mb-6">
                        You haven't written any journal entries yet. Start writing to see your emotional patterns emerge over time.
                    </p>
                    <Link 
                        to="/journal/new" 
                        className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
                    >
                        <PenSquare className="w-4 h-4" />
                        Write your first entry
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entries.map(entry => (
                        <JournalCard key={entry.id} entry={entry} />
                    ))}
                </div>
            )}
        </div>
    );
}
