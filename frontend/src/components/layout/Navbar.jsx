import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut, PenSquare } from 'lucide-react';
import { MindTrackLogo, SquashHamburger, PrimaryButton, GhostButton, ScrambleText, GlowCard } from '../ui/CinematicUI';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setShowLogoutModal(false);
        };
        if (showLogoutModal) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showLogoutModal]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const NavLink = ({ to, children }) => {
        const isActive = location.pathname === to || (location.pathname.startsWith(to) && to !== '/');
        const isRootActive = location.pathname === '/' && to === '/';
        const finalActive = to === '/' ? isRootActive : isActive;

        return (
            <Link 
                to={to} 
                className={`px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-colors md:inline-block block w-full md:w-auto text-left uppercase tracking-wider font-mono ${
                    finalActive 
                        ? 'bg-white/10 text-white shadow-md backdrop-blur-sm' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
                <ScrambleText text={children} />
            </Link>
        );
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const handleLogoutConfirm = async () => {
        setShowLogoutModal(false);
        await logout();
        navigate('/login');
    };

    return (
        <>
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-7xl">
                <div className="bg-white/10 backdrop-blur-md rounded-[14px] border border-white/10 px-4 sm:px-6 h-[64px] flex justify-between items-center relative shadow-2xl">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                            <span className="w-8 h-8 flex items-center justify-center shrink-0">
                                <MindTrackLogo size={24} className="text-white" />
                            </span>
                            <div className="flex flex-col leading-none font-mono">
                                <span className="uppercase tracking-widest text-sm">MindTrack</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2">
                        {user ? (
                            <>
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="/dashboard">Dashboard</NavLink>
                                <NavLink to="/mood">Mood Tracker</NavLink>
                                <NavLink to="/journal">Journal</NavLink>
                                <NavLink to="/ai-assistant">Assistant</NavLink>
                                <NavLink to="/insights">Insights</NavLink>
                                <NavLink to="/profile">Profile</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="/#features">Features</NavLink>
                            </>
                        )}
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/journal/new" className="text-sm font-mono uppercase tracking-widest font-bold bg-white text-black px-4 py-2 rounded-full hover:scale-105 transition-transform">
                                    + Entry
                                </Link>
                                <button className="text-white/60 hover:text-white transition-colors flex items-center justify-center">
                                    <Bell className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                        {getInitials(user.name)}
                                    </div>
                                    <button 
                                        onClick={() => setShowLogoutModal(true)}
                                        className="text-white/60 hover:text-rose-400 transition-colors flex items-center justify-center"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-mono uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="text-sm font-mono uppercase tracking-widest font-bold bg-white text-black px-4 py-2 rounded-full hover:scale-105 transition-transform">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden items-center gap-4">
                        {user && (
                            <Link to="/journal/new" className="text-white/60 hover:text-white">
                                <PenSquare className="w-5 h-5" />
                            </Link>
                        )}
                        <SquashHamburger isOpen={isMobileMenuOpen} toggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-[76px] left-0 w-full bg-[#0A0A0C]/95 backdrop-blur-3xl border border-white/10 rounded-[14px] shadow-2xl flex flex-col py-4 px-4 z-40 max-h-[calc(100vh-100px)] overflow-y-auto">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 mb-6 mt-2 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-sm font-bold shrink-0 border border-white/20">
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="flex flex-col overflow-hidden font-mono">
                                        <span className="font-bold text-white truncate">{user.name || 'User'}</span>
                                        <span className="text-xs text-white/60 truncate">{user.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-1 mb-6 flex flex-col">
                                    <NavLink to="/">Home</NavLink>
                                    <NavLink to="/dashboard">Dashboard</NavLink>
                                    <NavLink to="/mood">Mood Tracker</NavLink>
                                    <NavLink to="/journal">Journal</NavLink>
                                    <NavLink to="/ai-assistant">AI Assistant</NavLink>
                                    <NavLink to="/insights">Insights</NavLink>
                                    <NavLink to="/profile">Profile</NavLink>
                                </div>
                                
                                <div className="border-t border-white/10 pt-4 pb-2 flex flex-col gap-3">
                                    <button 
                                        onClick={() => setShowLogoutModal(true)}
                                        className="w-full text-left px-4 py-2 uppercase tracking-widest text-sm font-mono text-rose-400 hover:bg-white/5 rounded-full"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-4 py-4">
                                <NavLink to="/">Home</NavLink>
                                <NavLink to="/#features">Features</NavLink>
                                <NavLink to="/login">Login</NavLink>
                                <PrimaryButton onClick={() => navigate('/register')} className="w-full mt-4">
                                    Sign Up
                                </PrimaryButton>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowLogoutModal(false)}></div>
                    <GlowCard className="relative p-8 w-full max-w-[400px]">
                        <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mb-6">
                            <LogOut className="w-6 h-6 text-rose-400" />
                        </div>
                        <h2 className="text-2xl font-bold font-mono uppercase tracking-widest text-white mb-4">Sign out?</h2>
                        <p className="text-white/60 text-sm mb-8 leading-relaxed font-mono">
                            You will need to sign in again to access your mental wellness dashboard and journal entries.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-end gap-4">
                            <GhostButton onClick={() => setShowLogoutModal(false)} className="w-full sm:w-auto">
                                Cancel
                            </GhostButton>
                            <PrimaryButton onClick={handleLogoutConfirm} className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 hover:scale-100 text-white shadow-none hover:shadow-none">
                                Sign Out
                            </PrimaryButton>
                        </div>
                    </GlowCard>
                </div>
            )}
        </>
    );
}
