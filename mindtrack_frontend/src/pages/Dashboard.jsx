import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Link } from 'react-router-dom';
import { 
    Users, BookOpen, Star, Sparkles, Smile, BookHeart, Bot, BarChart2, Leaf, 
    ArrowRight, Activity, CalendarDays, HeartHandshake, CheckCircle2, ChevronDown, PenLine
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

// Mock Data for Visuals
const moodData = [
  { day: 'Mon', score: 2 },
  { day: 'Tue', score: 3.5 },
  { day: 'Wed', score: 2.5 },
  { day: 'Thu', score: 4 },
  { day: 'Fri', score: 3.5 },
  { day: 'Sat', score: 5 },
  { day: 'Sun', score: 4.5 },
];

const distributionData = [
  { name: 'Excellent', value: 20, color: '#10B981' },
  { name: 'Good', value: 40, color: '#34D399' },
  { name: 'Okay', value: 20, color: '#FCD34D' },
  { name: 'Bad', value: 10, color: '#F87171' },
  { name: 'Very Bad', value: 10, color: '#DC2626' },
];

const recentEntries = [
    { id: 1, title: 'A peaceful morning', preview: 'Today was calm and refreshing. I took a walk in the park...', date: 'May 25, 2025', time: '10:30 AM', color: '#10B981', bg: '#D1FAE5' },
    { id: 2, title: 'Feeling overwhelmed', preview: 'Had a lot of work today and felt a bit stressed. Took...', date: 'May 24, 2025', time: '8:15 PM', color: '#F59E0B', bg: '#FEF3C7' },
    { id: 3, title: 'Grateful for the little things', preview: 'I\'m grateful for my family and friends. Life is beautiful...', date: 'May 23, 2025', time: '7:45 PM', color: '#3B82F6', bg: '#DBEAFE' },
];

const streakDays = [
    { day: 'M', active: true }, { day: 'T', active: true }, { day: 'W', active: true },
    { day: 'T', active: true }, { day: 'F', active: true }, { day: 'S', active: true },
    { day: 'S', active: false },
];

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryRes, entriesRes] = await Promise.all([
                    apiClient.get('/mood/weekly/'),
                    apiClient.get('/journals/')
                ]);
                setSummary(summaryRes.data);
                const allEntries = entriesRes.data.results || entriesRes.data;
                setEntries(allEntries.slice(0, 3));
            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container" style={{ paddingBottom: '60px' }}>
            
            {/* Hero Section */}
            <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
                <div className="col-span-12" style={{ display: 'flex', background: 'white', borderRadius: '24px', overflow: 'hidden', padding: '0', boxShadow: 'var(--shadow-sm)' }}>
                    
                    {/* Hero Left Content */}
                    <div style={{ flex: '1', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F3E8FF', color: 'var(--primary)', padding: '6px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', marginBottom: '24px', width: 'fit-content' }}>
                            <Sparkles size={14} /> AI-Powered Mental Wellness
                        </div>
                        
                        <h1 style={{ fontSize: '48px', lineHeight: '1.1', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary)' }}>
                            Understand your mind.<br/>
                            <span style={{ color: 'var(--primary)' }}>Nourish <span style={{ color: '#10B981' }}>your</span></span> well-being.
                        </h1>
                        
                        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px', maxWidth: '85%' }}>
                            MindTrack AI helps you track your moods, maintain journals, analyze patterns and get AI-powered insights for a healthier, happier you.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                            <Link to="/mood" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '16px' }}>
                                <Smile size={20} /> Track My Mood
                            </Link>
                            <Link to="/journals/new" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '16px', borderRadius: '999px' }}>
                                <PenLine size={20} /> Write in Journal
                            </Link>
                        </div>
                        
                        {/* Stats row */}
                        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEE2E2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Activity size={24} /></div>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{summary ? summary.total_entries : '...'}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Entries (7 Days)</div>
                                </div>
                            </div>
                            <div style={{ width: '1px', height: '40px', background: 'var(--card-border)' }}></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEF3C7', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star size={24} /></div>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{summary ? summary.average_mood_score : '...'} / 10</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Avg Mood Score</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Hero Right Image */}
                    <div style={{ flex: '0 0 50%', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '24px', paddingLeft: '0' }}>
                            <img src="/hero-illustration.png" alt="Mental Wellness Illustration" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 1 */}
            <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
                {/* Mood Overview Chart */}
                <div className="card col-span-5" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="flex-between" style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Mood Overview</h3>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            This Week <ChevronDown size={14} />
                        </button>
                    </div>
                    <div style={{ flex: 1, width: '100%', minHeight: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={moodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickFormatter={(val) => {
                                    const labels = {1: 'Very Bad', 2: 'Bad', 3: 'Okay', 4: 'Good', 5: 'Excellent'};
                                    return val + '\n' + labels[val];
                                }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                                <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 6, fill: 'var(--primary)', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Today's Mood */}
                <div className="card col-span-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', alignSelf: 'flex-start', marginBottom: '24px' }}>Today's Mood</h3>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}>
                        <Smile size={48} color="#059669" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669', marginBottom: '16px' }}>Good</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 'auto' }}>May 25, 2025 • 10:30 AM</div>
                </div>

                {/* AI Insight */}
                <div className="card col-span-3" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '20px' }}>
                        <Sparkles size={18} color="var(--primary)" /> AI Insight
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', lineHeight: '1.4' }}>You've been consistent with your mood tracking. That's great! 🌟</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                        Keep focusing on small positive habits and don't forget to take breaks.
                    </p>
                    <Link to="/analytics" style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        View Full Insight <ArrowRight size={14} />
                    </Link>
                    {/* Decorative Plant Placeholder */}
                    <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '120px', height: '120px', opacity: 0.2, background: 'var(--primary)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                </div>

                {/* Quick Actions */}
                <div className="card col-span-2">
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/mood" className="btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px', borderRadius: '12px' }}>
                            <div style={{ background: '#FEF3C7', padding: '6px', borderRadius: '8px', color: '#F59E0B' }}><Smile size={16} /></div>
                            <span style={{ flex: 1, marginLeft: '8px', fontSize: '14px', fontWeight: '600' }}>Track Mood</span>
                            <ArrowRight size={16} color="var(--text-secondary)" />
                        </Link>
                        <Link to="/journals/new" className="btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px', borderRadius: '12px' }}>
                            <div style={{ background: '#E0E7FF', padding: '6px', borderRadius: '8px', color: '#4F46E5' }}><BookHeart size={16} /></div>
                            <span style={{ flex: 1, marginLeft: '8px', fontSize: '14px', fontWeight: '600' }}>Write Journal</span>
                            <ArrowRight size={16} color="var(--text-secondary)" />
                        </Link>
                        <Link to="/ai" className="btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px', borderRadius: '12px' }}>
                            <div style={{ background: '#F3E8FF', padding: '6px', borderRadius: '8px', color: '#7C3AED' }}><Bot size={16} /></div>
                            <span style={{ flex: 1, marginLeft: '8px', fontSize: '14px', fontWeight: '600' }}>AI Assistant</span>
                            <ArrowRight size={16} color="var(--text-secondary)" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Row 2 */}
            <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
                {/* Recent Entries */}
                <div className="card col-span-5">
                    <div className="flex-between" style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Recent Journal Entries</h3>
                        <Link to="/journals" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', background: 'var(--secondary)', padding: '6px 12px', borderRadius: '999px' }}>View All</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {entries.length > 0 ? entries.map(entry => (
                            <div key={entry.id} style={{ display: 'flex', gap: '16px', padding: '12px 0', borderBottom: '1px solid var(--card-border)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#D1FAE5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <BookOpen size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{new Date(entry.created_at).toLocaleDateString()}</h4>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>{entry.entry_text}</p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Score</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '700' }}>{entry.mood_score || 'N/A'} / 10</div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', padding: '12px 0' }}>No recent entries found.</div>
                        )}
                    </div>
                </div>

                {/* Mood Distribution */}
                <div className="card col-span-4" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Mood Distribution</h3>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{ width: '160px', height: '160px', position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={distributionData} innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                                        {distributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '700' }}>4.2</div>
                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Average<br/>Mood</div>
                            </div>
                        </div>
                        <div style={{ flex: 1, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {distributionData.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }}></div>
                                        <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                                    </div>
                                    <span style={{ fontWeight: '600' }}>{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Daily Streak */}
                <div className="card col-span-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F97316', fontWeight: '700', marginBottom: '16px', background: '#FFEDD5', padding: '6px 16px', borderRadius: '999px', fontSize: '14px' }}>
                        🔥 Daily Streak
                    </div>
                    <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>7 Days</div>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>Great job! You're building a<br/>positive habit.</p>
                    
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        {streakDays.map((d, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{d.day}</span>
                                {d.active ? (
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckCircle2 size={16} />
                                    </div>
                                ) : (
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #E2E8F0' }}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Banners Row */}
            <div className="dashboard-grid" style={{ marginBottom: '40px' }}>
                <div className="card col-span-4 flex-between" style={{ padding: '20px', background: '#F8FAFC' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F3E8FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={24} />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: '700', fontSize: '15px' }}>AI Assistant</h4>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 8px' }}>Hi there! How are you<br/>feeling today?</p>
                        </div>
                    </div>
                    <Link to="/ai" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '999px', border: '1px solid var(--primary)', color: 'var(--primary)' }}>Chat with AI</Link>
                </div>
                
                <div className="card col-span-4 flex-between" style={{ padding: '20px', background: '#F8FAFC' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Leaf size={24} />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: '700', fontSize: '15px' }}>Wellness Tip</h4>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0' }}>Practice deep breathing for 5<br/>minutes. It helps reduce stress.</p>
                        </div>
                    </div>
                </div>
                
                <div className="card col-span-4 flex-between" style={{ padding: '20px', background: '#F8FAFC' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HeartHandshake size={24} />
                        </div>
                        <div>
                            <h4 style={{ fontWeight: '700', fontSize: '15px' }}>Need Help?</h4>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 8px' }}>You are not alone. Reach out to<br/>our support resources.</p>
                        </div>
                    </div>
                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '999px' }}>Get Help</button>
                </div>
            </div>

            {/* Footer Quote */}
            <div style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid var(--card-border)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg)', padding: '0 24px', color: 'var(--primary)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Your mental health is a priority.</h3>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>You are important. You matter. You are enough.</h2>
            </div>
            
        </div>
    );
};

export default Dashboard;
