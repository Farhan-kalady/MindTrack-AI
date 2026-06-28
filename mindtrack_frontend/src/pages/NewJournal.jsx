import React, { useState } from 'react';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NewJournal = () => {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleSaveAndAnalyze = async () => {
        if (!text.trim()) return;
        setLoading(true);
        try {
            // 1. Create Entry
            const createRes = await apiClient.post('/journals/', { entry_text: text });
            const newEntryId = createRes.data.id;
            
            // 2. Analyze Entry
            setAnalyzing(true);
            const analyzeRes = await apiClient.post(`/journals/${newEntryId}/analyze/`);
            setResult(analyzeRes.data);
            
        } catch (error) {
            console.error('Error during journal creation/analysis', error);
            alert('An error occurred. Check the console.');
        } finally {
            setLoading(false);
            setAnalyzing(false);
        }
    };

    return (
        <div className="container">
            <Link to="/journals" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                <ArrowLeft size={16} /> Back to Journals
            </Link>
            
            <div className="card" style={{ marginBottom: '24px' }}>
                <h1 style={{ marginBottom: '16px', fontSize: '24px' }}>How are you feeling today?</h1>
                <textarea 
                    className="input-field" 
                    rows="6" 
                    placeholder="Write down your thoughts, events of the day, or anything on your mind..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ resize: 'vertical', marginBottom: '16px' }}
                />
                
                {!result && (
                    <button 
                        onClick={handleSaveAndAnalyze} 
                        className="btn btn-primary" 
                        disabled={loading || text.trim().length === 0}
                    >
                        {loading ? (
                            <span className="spinner" style={{ display: 'inline-block', width: '16px', height: '16px', marginRight: '8px', borderTopColor: 'transparent' }}></span>
                        ) : <Sparkles size={18} />}
                        {analyzing ? 'Analyzing with AI...' : 'Save & Analyze'}
                    </button>
                )}
            </div>

            {result && (
                <div className="card" style={{ background: 'rgba(139, 92, 246, 0.05)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '16px' }}>
                        <Sparkles size={20} /> AI Analysis Complete
                    </h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>Detected Emotion</div>
                            <div style={{ fontSize: '18px', fontWeight: '600', textTransform: 'capitalize' }}>{result.emotion}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>Mood Score</div>
                            <div style={{ fontSize: '18px', fontWeight: '600' }}>{result.mood_score}/10</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '4px' }}>Keywords</div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                                {result.keywords?.map(kw => (
                                    <span key={kw} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{kw}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Wellness Suggestion</div>
                        <p style={{ lineHeight: '1.6' }}>{result.feedback}</p>
                    </div>

                    <button onClick={() => navigate('/journals')} className="btn btn-secondary" style={{ marginTop: '24px' }}>
                        View All Entries
                    </button>
                </div>
            )}
        </div>
    );
};

export default NewJournal;
