import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const res = await login(formData.username, formData.password);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error);
        }
        setIsLoading(false);
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '64px' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 style={{ marginBottom: '8px', textAlign: 'center' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>Login to your MindTrack AI account</p>
                
                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Username</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            value={formData.username} 
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Password</label>
                        <input 
                            type="password" 
                            className="input-field" 
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
