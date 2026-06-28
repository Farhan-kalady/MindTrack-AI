import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle, Trash2 } from 'lucide-react';

const JournalList = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const res = await apiClient.get('/journals/');
                setEntries(res.data.results || res.data);
            } catch (error) {
                console.error('Failed to fetch entries', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEntries();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await apiClient.delete(`/journals/${id}/`);
                setEntries(entries.filter(e => e.id !== id));
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText /> Journal Entries
                </h1>
                <Link to="/journals/new" className="btn btn-primary">
                    <PlusCircle size={18} /> Write Entry
                </Link>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
                    <div className="spinner" style={{ display: 'block', borderColor: 'var(--primary)', borderTopColor: 'transparent', width: '32px', height: '32px' }}></div>
                </div>
            ) : entries.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {entries.map(entry => (
                        <div key={entry.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
                                    {new Date(entry.created_at).toLocaleDateString()} at {new Date(entry.created_at).toLocaleTimeString()}
                                </div>
                                <p style={{ lineHeight: '1.6', marginBottom: '12px' }}>{entry.entry_text}</p>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                        Mood Score: <span style={{ color: 'var(--text-primary)' }}>{entry.mood_score || 'N/A'}/10</span>
                                    </div>
                                    {entry.analysis && (
                                        <div className={`pill pill-${entry.analysis.sentiment === 'positive' ? 'joy' : entry.analysis.sentiment === 'negative' ? 'sad' : 'calm'}`}>
                                            {entry.analysis.emotion?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => handleDelete(entry.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '8px', height: 'fit-content', borderRadius: '4px' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>You haven't written any journal entries yet.</p>
                    <Link to="/journals/new" className="btn btn-primary">Start Journaling</Link>
                </div>
            )}
        </div>
    );
};

export default JournalList;
