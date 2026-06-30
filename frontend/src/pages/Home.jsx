import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenSquare, Smile } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function Home() {
    const { user } = useAuth();
    const [entriesCount, setEntriesCount] = useState(0);
    const [avgScore, setAvgScore] = useState(0);

    useEffect(() => {
        if (user) {
            axiosInstance.get('/mood/sparkline/?days=7')
                .then(res => {
                    const data = res.data;
                    if (data && data.scores) {
                        setEntriesCount(data.scores.length);
                        const total = data.scores.reduce((a, b) => a + b, 0);
                        setAvgScore(data.scores.length > 0 ? (total / data.scores.length).toFixed(1) : 0);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [user]);

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center relative bg-[#F5F5FA]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    
                    {/* Left Column: Copy & CTA */}
                    <div className="space-y-6 text-center lg:text-left">
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                            <span className="text-[#111827]">Understand your mind.</span><br />
                            <span className="text-[#7C3AED]">Nourish</span>{' '}
                            <span className="text-[#10B981]">your</span>{' '}
                            <span className="text-[#111827]">well-being.</span>
                        </h1>
                        
                        <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            MindTrack AI helps you track your moods, maintain journals, analyze patterns and get AI-powered insights for a healthier, happier you.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                            <Link 
                                to="/mood" 
                                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                📊 Track My Mood
                            </Link>
                            <Link 
                                to="/journal/new" 
                                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-all flex items-center justify-center gap-2"
                            >
                                <PenSquare className="w-4 h-4" />
                                Write in Journal
                            </Link>
                        </div>

                        <div className="flex gap-4 pt-8">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 flex-1">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <PenSquare className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-[#111827]">{entriesCount}</p>
                                    <p className="text-xs text-gray-500 font-medium">Entries (7 days)</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 flex-1">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Smile className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-[#111827]">{avgScore} / 10</p>
                                    <p className="text-xs text-gray-500 font-medium">Avg Mood Score</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Hero Image */}
                    <div className="relative h-full flex items-center justify-center lg:justify-end">
                        <img 
                            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop" 
                            alt="Wellness Illustration" 
                            className="w-full h-auto max-h-[500px] object-cover rounded-3xl shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

