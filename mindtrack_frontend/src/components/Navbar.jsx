import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Brain, Home, LayoutDashboard, Smile, BookHeart, Bot, Sparkles, User, Plus, Bell, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '16px 0', borderBottom: '1px solid var(--card-border)', backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 100 }}>
            <div className="container flex-between">
                {/* Logo Section */}
                <Link to={user ? '/dashboard' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '12px' }}>
                        <Brain style={{ color: 'var(--primary)', width: 28, height: 28 }} />
                    </div>
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.2 }}>MindTrack AI</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>Your Mental Wellness Companion</div>
                    </div>
                </Link>
                
                {/* Navigation Links */}
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '600', padding: '8px 16px', background: 'rgba(124, 58, 237, 0.08)', borderRadius: '999px' }}>
                        <Home size={18} /> Home
                    </Link>
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/mood" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        <Smile size={18} /> Mood Tracker
                    </Link>
                    <Link to="/journals" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        <BookHeart size={18} /> Journal
                    </Link>
                    <Link to="/ai" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        <Bot size={18} /> AI Assistant
                    </Link>
                    <Link to="/analytics" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        <Sparkles size={18} /> Insights
                    </Link>
                    <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        <User size={18} /> Profile
                    </Link>
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Link to="/journals/new" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                        <Plus size={18} /> New Entry
                    </Link>
                    
                    <button className="btn-ghost" style={{ position: 'relative', padding: '8px', border: 'none', cursor: 'pointer', borderRadius: '50%' }}>
                        <Bell size={22} />
                        <span style={{ position: 'absolute', top: '4px', right: '4px', width: '10px', height: '10px', backgroundColor: 'var(--danger)', borderRadius: '50%', border: '2px solid white' }}></span>
                    </button>
                    
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--secondary)', overflow: 'hidden', border: '2px solid white', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}>
                        <img src="https://ui-avatars.com/api/?name=User&background=7C3AED&color=fff" alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
