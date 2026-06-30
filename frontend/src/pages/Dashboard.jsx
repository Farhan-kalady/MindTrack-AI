import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { PenSquare, TrendingUp, Brain, Calendar, Loader2 } from 'lucide-react';
import JournalCard from '../components/journal/JournalCard';
import { toast } from 'react-hot-toast';

const EMOTION_COLORS = {
    happy: '#10b981',
    excited: '#10b981',
    grateful: '#10b981',
    hopeful: '#3b82f6',
    neutral: '#737373',
    sad: '#6366f1',
    exhausted: '#6366f1',
    anxious: '#f59e0b',
    angry: '#f43f5e',
    frustrated: '#f43f5e',
};

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [recentEntries, setRecentEntries] = useState([]);
    const [moodHistory, setMoodHistory] = useState([]);
    const [emotionSummary, setEmotionSummary] = useState([]);
    const [stats, setStats] = useState({ avgScore: 0, totalEntries: 0 });
    const [days, setDays] = useState(7);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch Recent Entries (limit 5)
                const entriesRes = await axiosInstance.get('/entries/?page_size=5&ordering=-created_at');
                const allEntries = entriesRes.data.results || entriesRes.data;
                setRecentEntries(allEntries.slice(0, 5));
                setStats(prev => ({ ...prev, totalEntries: entriesRes.data.count || allEntries.length }));

                // Fetch Mood History based on days
                const historyUrl = days === 'all' ? '/mood/history/' : `/mood/history/?days=${days}`;
                const historyRes = await axiosInstance.get(historyUrl);
                const historyData = historyRes.data.map(item => ({
                    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    score: item.mood_score,
                    emotion: item.emotion
                }));
                setMoodHistory(historyData);

                // Calculate average score
                if (historyData.length > 0) {
                    const avg = historyData.reduce((acc, curr) => acc + curr.score, 0) / historyData.length;
                    setStats(prev => ({ ...prev, avgScore: avg.toFixed(1) }));
                } else {
                    setStats(prev => ({ ...prev, avgScore: 0 }));
                }

                // Fetch Emotion Summary
                const emotionRes = await axiosInstance.get('/mood/emotions/summary/');
                const emotionData = Object.entries(emotionRes.data).map(([name, value]) => ({
                    name, value
                }));
                setEmotionSummary(emotionData);

            } catch (err) {
                console.error(err);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, navigate, days]);

    if (loading && moodHistory.length === 0) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#F5F5FA]">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 bg-[#F5F5FA] min-h-[calc(100vh-64px)] animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Dashboard</h1>
                    <p className="text-gray-500 mt-1">Here is a snapshot of your emotional well-being.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-white rounded-full p-1 border border-gray-200 shadow-sm">
                        {[7, 30, 'all'].map(d => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    days === d 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {d === 'all' ? 'All time' : `${d} days`}
                            </button>
                        ))}
                    </div>
                    <Link 
                        to="/journal/new" 
                        className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                    >
                        <PenSquare className="w-4 h-4" />
                        New Entry
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Entries</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalEntries}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Avg Mood Score</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.avgScore}<span className="text-lg text-gray-400 font-normal">/10</span></p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Top Emotion</p>
                            <p className="text-2xl font-bold text-gray-900 capitalize line-clamp-1">
                                {emotionSummary.length > 0 
                                    ? emotionSummary.reduce((prev, current) => (prev.value > current.value) ? prev : current).name 
                                    : 'None'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Current Streak</p>
                            <p className="text-3xl font-bold text-gray-900">{user?.streak || 0} <span className="text-sm text-gray-400 font-normal">days</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Mood Line Chart */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Mood Trajectory</h3>
                    {moodHistory.length > 0 ? (
                        <div className="h-72 w-full">
                            {loading ? (
                                <div className="h-full flex items-center justify-center"><Loader2 className="w-6 h-6 text-purple-600 animate-spin" /></div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={moodHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '0.5rem', color: '#111827', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            itemStyle={{ color: '#7c3aed' }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="score" 
                                            stroke="#8b5cf6" 
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                                            activeDot={{ r: 6, fill: '#c4b5fd' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    ) : (
                        <div className="h-72 w-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                            <p className="text-gray-500 text-sm">Not enough data to display chart.</p>
                        </div>
                    )}
                </div>

                {/* Emotion Donut Chart */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Emotion Distribution</h3>
                    {emotionSummary.length > 0 ? (
                        <div className="h-72 w-full flex flex-col items-center justify-center">
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie
                                        data={emotionSummary}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {emotionSummary.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name] || EMOTION_COLORS.neutral} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '0.5rem', color: '#111827' }}
                                        itemStyle={{ color: '#111827', textTransform: 'capitalize' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap justify-center gap-3 mt-2">
                                {emotionSummary.slice(0, 4).map((entry, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-500 capitalize font-medium">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: EMOTION_COLORS[entry.name] || EMOTION_COLORS.neutral }} />
                                        {entry.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-72 w-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                            <p className="text-gray-500 text-sm">No emotions recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Entries */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Recent Entries</h3>
                    <Link to="/journal" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                        View all →
                    </Link>
                </div>
                
                {recentEntries.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentEntries.map(entry => (
                            <JournalCard key={entry.id} entry={entry} onDelete={() => {}} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
                        <p className="text-gray-500">No entries yet. Time to start your journey!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
