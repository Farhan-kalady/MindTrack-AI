import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { BarChart2, Loader2, Sparkles, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
    ScrambleIn, 
    FadeIn, 
    GlowCard, 
    Watermark, 
    PrimaryButton,
    GhostButton,
    AnimatedText
} from '../components/ui/CinematicUI';

export default function Analytics() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [days, setDays] = useState(7);
    const [moodHistory, setMoodHistory] = useState([]);
    const [loadingChart, setLoadingChart] = useState(true);

    const [report, setReport] = useState(null);
    const [loadingReport, setLoadingReport] = useState(true);
    const [generatingReport, setGeneratingReport] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchChartData = async () => {
            setLoadingChart(true);
            try {
                const res = await axiosInstance.get(`/mood/history/?days=${days}`);
                const historyData = res.data.map((item, index) => ({
                    id: index,
                    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    score: item.mood_score,
                    emotion: item.emotion
                }));
                setMoodHistory(historyData);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load mood history.");
            } finally {
                setLoadingChart(false);
            }
        };
        fetchChartData();
    }, [user, navigate, days]);

    useEffect(() => {
        if (!user) return;
        const fetchReport = async () => {
            setLoadingReport(true);
            try {
                const res = await axiosInstance.get('/mood/summary/');
                if (res.data) setReport(res.data);
            } catch (err) {
                if (err.response?.status !== 404) {
                    console.error("Failed to load report", err);
                }
            } finally {
                setLoadingReport(false);
            }
        };
        fetchReport();
    }, [user]);

    const generateReport = async () => {
        setGeneratingReport(true);
        try {
            const res = await axiosInstance.post('/mood/summary/generate/');
            setReport(res.data);
            toast.success("Weekly report generated successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to generate report.");
        } finally {
            setGeneratingReport(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative font-mono min-h-screen">
            <Watermark text="BALANCE" />
            
            <div className="relative z-10">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-widest uppercase mb-2">
                        <ScrambleIn text="Track Your Mood" />
                    </h1>
                    <FadeIn delay={0.2} y={10}>
                        <p className="text-white/60">Visualize your emotional journey and discover AI-driven insights.</p>
                    </FadeIn>
                </div>

                {/* Chart Section */}
                <FadeIn delay={0.3} y={20}>
                    <GlowCard className="p-6 md:p-8 mb-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 w-full">
                            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">Mood Trajectory</h3>
                            <div className="flex gap-2">
                                {[7, 30].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDays(d)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                                            days === d 
                                            ? 'bg-white/10 text-white shadow-md border border-white/10' 
                                            : 'text-white/40 border border-white/5 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {d} Days
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loadingChart ? (
                            <div className="h-80 w-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-[#C026D3] animate-spin" />
                            </div>
                        ) : moodHistory.length > 0 ? (
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={moodHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorScoreArea" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#C026D3" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#C026D3" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorScoreLine" x1="0" y1="0" x2="1" y2="0">
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
                                        <Area 
                                            type="monotone" 
                                            dataKey="score" 
                                            stroke="url(#colorScoreLine)" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorScoreArea)" 
                                            dot={{ r: 4, fill: '#C026D3', strokeWidth: 0 }}
                                            activeDot={{ r: 6, fill: '#DB2777', strokeWidth: 2, stroke: '#fff' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-80 w-full flex items-center justify-center border border-dashed border-white/10 bg-white/5 rounded-xl">
                                <p className="text-white/40 text-sm">Not enough data to display chart. Start journaling!</p>
                            </div>
                        )}
                    </GlowCard>
                </FadeIn>

                {/* Weekly Report Section */}
                <FadeIn delay={0.4} y={20}>
                    <GlowCard className="p-6 lg:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C026D3]/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                        
                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-widest">
                                        <FileText className="w-5 h-5 text-[#C026D3]" />
                                        AI Wellness Report
                                    </h3>
                                    <p className="text-sm text-white/60 mt-2">Get a comprehensive summary of your week powered by Gemini.</p>
                                </div>
                                <PrimaryButton
                                    onClick={generateReport}
                                    disabled={generatingReport}
                                    className="w-full sm:w-auto text-xs py-3 px-6 flex items-center justify-center gap-2"
                                >
                                    {generatingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    {generatingReport ? 'Generating...' : 'Generate Report'}
                                </PrimaryButton>
                            </div>

                            {loadingReport ? (
                                <div className="py-12 flex justify-center">
                                    <Loader2 className="w-6 h-6 text-[#C026D3] animate-spin" />
                                </div>
                            ) : report ? (
                                <div className="bg-[#0A0A0C]/50 backdrop-blur-md border border-white/10 rounded-xl p-8">
                                    <div className="flex flex-wrap items-center gap-4 mb-8 border-b border-white/10 pb-6">
                                        <span className="bg-[#C026D3]/20 text-[#C026D3] border border-[#C026D3]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                            Week of {new Date(report.week_start).toLocaleDateString()}
                                        </span>
                                        <span className="text-white/40 text-xs uppercase tracking-widest">
                                            Dominant Emotion: <strong className="text-white capitalize">{report.dominant_emotion}</strong>
                                        </span>
                                        <span className="text-white/40 text-xs uppercase tracking-widest">
                                            Avg Score: <strong className="text-white font-sans">{report.average_mood_score}/10</strong>
                                        </span>
                                    </div>
                                    <div className="text-white/80 space-y-6 text-sm md:text-base leading-relaxed font-sans font-light">
                                        {report.week_summary && report.week_summary.split('\n').map((paragraph, idx) => (
                                            paragraph.trim() && <p key={idx}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#0A0A0C]/50 border border-white/10 rounded-xl p-10 text-center flex flex-col items-center">
                                    <AlertCircle className="w-10 h-10 text-white/20 mb-4" />
                                    <h4 className="text-white font-bold uppercase tracking-widest mb-2">No reports generated yet</h4>
                                    <p className="text-white/40 text-sm max-w-md">
                                        You need to write at least one journal entry this week to generate a meaningful report.
                                    </p>
                                </div>
                            )}
                        </div>
                    </GlowCard>
                </FadeIn>
            </div>
        </div>
    );
}
