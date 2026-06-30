import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { BarChart2, Loader2, Sparkles, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
                const historyData = res.data.map(item => ({
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-slide-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                    <BarChart2 className="w-8 h-8 text-purple-500" />
                    Mood Analytics
                </h1>
                <p className="text-neutral-400 mt-1">Visualize your emotional journey and discover AI-driven insights.</p>
            </div>

            {/* Chart Section */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-lg mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h3 className="text-xl font-semibold text-white">Mood Trajectory</h3>
                    <div className="flex bg-neutral-900 rounded-full p-1 border border-neutral-700">
                        {[7, 14, 30].map(d => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    days === d 
                                    ? 'bg-neutral-700 text-white shadow-sm' 
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                                }`}
                            >
                                {d} Days
                            </button>
                        ))}
                    </div>
                </div>

                {loadingChart ? (
                    <div className="h-80 w-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                    </div>
                ) : moodHistory.length > 0 ? (
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={moodHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
                                <XAxis dataKey="date" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#262626', borderColor: '#404040', borderRadius: '0.5rem', color: '#fff' }}
                                    itemStyle={{ color: '#c084fc' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="score" 
                                    stroke="#a855f7" 
                                    strokeWidth={4}
                                    dot={{ r: 5, fill: '#a855f7', strokeWidth: 0 }}
                                    activeDot={{ r: 8, fill: '#d8b4fe' }}
                                    animationDuration={1500}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-80 w-full flex items-center justify-center border-2 border-dashed border-neutral-700 rounded-xl">
                        <p className="text-neutral-500 text-sm">Not enough data to display chart. Start journaling!</p>
                    </div>
                )}
            </div>

            {/* Weekly Report Section */}
            <div className="bg-gradient-to-r from-purple-900/40 to-emerald-900/20 border border-neutral-700 rounded-2xl p-6 lg:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-400" />
                                Weekly AI Wellness Report
                            </h3>
                            <p className="text-sm text-neutral-400 mt-1">Get a comprehensive summary of your week powered by Gemini.</p>
                        </div>
                        <button
                            onClick={generateReport}
                            disabled={generatingReport}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-purple-900/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {generatingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            {generatingReport ? 'Generating...' : 'Generate New Report'}
                        </button>
                    </div>

                    {loadingReport ? (
                        <div className="py-12 flex justify-center">
                            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                        </div>
                    ) : report ? (
                        <div className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6">
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-sm font-medium">
                                    Week of {new Date(report.week_start).toLocaleDateString()}
                                </span>
                                <span className="text-neutral-400 text-sm">
                                    Dominant Emotion: <strong className="text-white capitalize">{report.dominant_emotion}</strong>
                                </span>
                                <span className="text-neutral-400 text-sm">
                                    Avg Score: <strong className="text-white">{report.average_mood_score}/10</strong>
                                </span>
                            </div>
                            <div className="text-neutral-300 space-y-4">
                                {report.week_summary && report.week_summary.split('\n').map((paragraph, idx) => (
                                    paragraph.trim() && <p key={idx} className="leading-relaxed">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-neutral-900/40 border border-neutral-700/50 rounded-xl p-8 text-center flex flex-col items-center">
                            <AlertCircle className="w-8 h-8 text-neutral-500 mb-3" />
                            <h4 className="text-white font-medium mb-1">No reports generated yet</h4>
                            <p className="text-neutral-400 text-sm max-w-md">
                                You need to write at least one journal entry this week to generate a meaningful report.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
