import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart2 } from 'lucide-react';

const Analytics = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await apiClient.get('/mood/history/');
                // Format data for recharts
                const formattedData = res.data.mood_history.map(entry => ({
                    date: new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    score: entry.mood_score,
                    emotion: entry.analysis?.emotion || 'unknown'
                })).reverse(); // Oldest first for chart
                
                setHistory(formattedData);
            } catch (error) {
                console.error('Failed to fetch history', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '12px', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>{label}</p>
                    <p style={{ margin: '4px 0', fontWeight: 'bold', color: 'var(--primary)' }}>
                        Mood Score: {payload[0].value}/10
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', textTransform: 'capitalize' }}>
                        Emotion: {payload[0].payload.emotion}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                <BarChart2 size={28} className="text-primary" style={{ color: 'var(--primary)' }} />
                <h1 style={{ margin: 0 }}>Mood Analytics</h1>
            </div>

            <div className="card" style={{ height: '400px', padding: '24px 24px 48px 0' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div className="spinner" style={{ display: 'block', borderColor: 'var(--primary)', borderTopColor: 'transparent', width: '32px', height: '32px' }}></div>
                    </div>
                ) : history.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={history} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                stroke="var(--text-secondary)" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis 
                                stroke="var(--text-secondary)" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 10]}
                                ticks={[0, 2, 4, 6, 8, 10]}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                            <Bar 
                                dataKey="score" 
                                fill="var(--primary)" 
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                        Not enough data to display charts. Start journaling!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;
