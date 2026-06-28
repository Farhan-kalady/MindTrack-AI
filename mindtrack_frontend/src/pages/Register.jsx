import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const res = await register(formData.username, formData.email, formData.password);
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
                <h2 style={{ marginBottom: '8px', textAlign: 'center' }}>Create Account</h2>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>Join MindTrack AI today</p>
                
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
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Email</label>
                        <input 
                            type="email" 
                            className="input-field" 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                        {isLoading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
