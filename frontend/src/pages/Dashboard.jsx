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
import { 
    ScrambleIn, 
    FadeIn, 
    GlowCard, 
    Watermark, 
    GhostButton, 
    PrimaryButton 
} from '../components/ui/CinematicUI';

const EMOTION_COLORS = {
    happy: '#10B981',
    excited: '#10B981',
    grateful: '#10B981',
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
    const [stats, setStats] = useState({ avgScore: 0, totalEntries: 0, currentStreak: 0 });
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
                const historyData = historyRes.data.map((item, index) => ({
                    id: index,
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

                // Fetch fresh user profile for accurate streak
                try {
                    const userRes = await axiosInstance.get('/users/me/');
                    setStats(prev => ({ ...prev, currentStreak: userRes.data.current_streak || 0 }));
                } catch (e) {
                    console.error("Failed to fetch fresh user profile", e);
                }

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
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center relative">
                <Loader2 className="w-8 h-8 text-[#C026D3] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative font-mono min-h-screen">
            <Watermark text="OVERVIEW" />
            
            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6 w-full">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-widest uppercase mb-2">
                            <ScrambleIn text="Dashboard" />
                        </h1>
                        <FadeIn delay={0.2} y={10}>
                            <p className="text-white/60">A snapshot of your emotional well-being.</p>
                        </FadeIn>
                    </div>
                    
                    <FadeIn delay={0.3} y={10} className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full sm:w-auto">
                        <div className="flex bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10 w-full sm:w-auto overflow-x-auto flex-nowrap">
                            {[7, 30, 'all'].map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDays(d)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${
                                        days === d 
                                        ? 'bg-white/10 text-white shadow-sm border border-white/10' 
                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {d === 'all' ? 'All time' : `${d} days`}
                                </button>
                            ))}
                        </div>
                        <Link to="/journal/new" className="w-full sm:w-auto">
                            <PrimaryButton className="w-full py-3 px-6 text-xs flex items-center justify-center gap-2">
                                <PenSquare className="w-4 h-4" />
                                New Entry
                            </PrimaryButton>
                        </Link>
                    </FadeIn>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <FadeIn delay={0.1} y={20}>
                        <GlowCard className="p-6 h-full flex flex-col justify-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0">
                                    <Calendar className="w-6 h-6 text-[#10B981]" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest font-bold text-white/40 mb-1">Total Entries</p>
                                    <p className="text-3xl font-bold text-white font-sans">{stats.totalEntries}</p>
                                </div>
                            </div>
                        </GlowCard>
                    </FadeIn>

                    <FadeIn delay={0.2} y={20}>
                        <GlowCard className="p-6 h-full flex flex-col justify-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#C026D3]/10 border border-[#C026D3]/20 flex items-center justify-center shrink-0">
                                    <TrendingUp className="w-6 h-6 text-[#C026D3]" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest font-bold text-white/40 mb-1">Avg Score</p>
                                    <p className="text-3xl font-bold text-white font-sans">{stats.avgScore}<span className="text-sm text-white/40 font-normal">/10</span></p>
                                </div>
                            </div>
                        </GlowCard>
                    </FadeIn>
                    
                    <FadeIn delay={0.3} y={20}>
                        <GlowCard className="p-6 h-full flex flex-col justify-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center shrink-0">
                                    <Brain className="w-6 h-6 text-[#3b82f6]" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest font-bold text-white/40 mb-1">Top Emotion</p>
                                    <p className="text-xl font-bold text-white capitalize line-clamp-1 font-sans">
                                        {emotionSummary.length > 0 
                                            ? emotionSummary.reduce((prev, current) => (prev.value > current.value) ? prev : current).name 
                                            : 'None'}
                                    </p>
                                </div>
                            </div>
                        </GlowCard>
                    </FadeIn>

                    <FadeIn delay={0.4} y={20}>
                        <GlowCard className="p-6 h-full flex flex-col justify-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center shrink-0">
                                    <TrendingUp className="w-6 h-6 text-[#F59E0B]" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest font-bold text-white/40 mb-1">Current Streak</p>
                                    <p className="text-3xl font-bold text-white font-sans">{stats.currentStreak} <span className="text-sm text-white/40 font-normal">days</span></p>
                                </div>
                            </div>
                        </GlowCard>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Mood Line Chart */}
                    <div className="lg:col-span-2">
                        <FadeIn delay={0.5} y={20} className="h-full">
                            <GlowCard className="p-6 h-full">
                                <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-6">Mood Trajectory</h3>
                                {moodHistory.length > 0 ? (
                                    <div className="h-72 w-full">
                                        {loading ? (
                                            <div className="h-full flex items-center justify-center"><Loader2 className="w-6 h-6 text-[#C026D3] animate-spin" /></div>
                                        ) : (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={moodHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorScore" x1="0" y1="0" x2="1" y2="0">
                                                            <stop offset="0%" stopColor="#7C3AED" />
                                                            <stop offset="50%" stopColor="#C026D3" />
                                                            <stop offset="100%" stopColor="#DB2777" />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                    <XAxis dataKey="id" tickFormatter={(id) => moodHistory[id]?.date} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} fontFamily="Space Mono" />
                                                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} fontFamily="Space Mono" />
                                                    <RechartsTooltip 
                                                        labelFormatter={(label) => moodHistory[label]?.date}
                                                        contentStyle={{ backgroundColor: 'rgba(10,10,12,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#ffffff', backdropFilter: 'blur(16px)', fontFamily: 'Space Mono' }}
                                                        itemStyle={{ color: '#C026D3' }}
                                                    />
                                                    <Line 
                                                        type="monotone" 
                                                        dataKey="score" 
                                                        stroke="url(#colorScore)" 
                                                        strokeWidth={3}
                                                        dot={{ r: 4, fill: '#C026D3', strokeWidth: 0 }}
                                                        activeDot={{ r: 6, fill: '#DB2777', strokeWidth: 2, stroke: '#fff' }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-72 w-full flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
                                        <p className="text-white/40 text-sm">Not enough data to display chart.</p>
                                    </div>
                                )}
                            </GlowCard>
                        </FadeIn>
                    </div>

                    {/* Emotion Donut Chart */}
                    <div>
                        <FadeIn delay={0.6} y={20} className="h-full">
                            <GlowCard className="p-6 h-full">
                                <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-6">Emotion Distribution</h3>
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
                                                    stroke="rgba(255,255,255,0.05)"
                                                >
                                                    {emotionSummary.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name] || EMOTION_COLORS.neutral} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip 
                                                    contentStyle={{ backgroundColor: 'rgba(10,10,12,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#ffffff', backdropFilter: 'blur(16px)', fontFamily: 'Space Mono' }}
                                                    itemStyle={{ color: '#ffffff', textTransform: 'capitalize' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                                            {emotionSummary.slice(0, 4).map((entry, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs text-white/60 capitalize font-medium">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: EMOTION_COLORS[entry.name] || EMOTION_COLORS.neutral }} />
                                                    {entry.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-72 w-full flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
                                        <p className="text-white/40 text-sm">No emotions recorded yet.</p>
                                    </div>
                                )}
                            </GlowCard>
                        </FadeIn>
                    </div>
                </div>

                {/* Recent Entries */}
                <FadeIn delay={0.7} y={20}>
                    <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                        <h3 className="text-xl font-bold text-white tracking-widest uppercase">Recent Entries</h3>
                        <Link to="/journal" className="text-sm font-bold text-[#C026D3] hover:text-[#DB2777] transition-colors uppercase tracking-widest">
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
                        <GlowCard className="p-8 text-center border-dashed">
                            <p className="text-white/40">No entries yet. Time to start your journey!</p>
                        </GlowCard>
                    )}
                </FadeIn>
            </div>
        </div>
    );
}
