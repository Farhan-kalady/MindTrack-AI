import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Brain, LogOut, Bell, PenSquare, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowLogoutModal(false);
            }
        };
        if (showLogoutModal) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showLogoutModal]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const NavLink = ({ to, children }) => {
        const isActive = location.pathname === to || (location.pathname.startsWith(to) && to !== '/');
        
        // Exact match for root "/" to prevent it from always being active
        const isRootActive = location.pathname === '/' && to === '/';
        const finalActive = to === '/' ? isRootActive : isActive;

        return (
            <Link 
                to={to} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors md:inline-block block w-full md:w-auto text-left ${
                    finalActive 
                        ? 'bg-[#EDE9FE] text-[#7C3AED]' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
                {children}
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
            <nav className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white h-[64px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
                    <div className="flex justify-between items-center h-full">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                    <Brain className="w-5 h-5 text-purple-600" />
                                </span>
                                <div className="flex flex-col leading-none">
                                    <span>MindTrack <span className="text-purple-600">AI</span></span>
                                    <span className="text-[10px] font-normal text-gray-500 mt-0.5 hidden sm:inline">Your Mental Wellness Companion</span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-2">
                            {user ? (
                                <>
                                    <NavLink to="/">Home</NavLink>
                                    <NavLink to="/dashboard">Dashboard</NavLink>
                                    <NavLink to="/mood">Mood Tracker</NavLink>
                                    <NavLink to="/journal">Journal</NavLink>
                                    <NavLink to="/ai-assistant">AI Assistant</NavLink>
                                    <NavLink to="/insights">Insights</NavLink>
                                    <NavLink to="/profile">Profile</NavLink>
                                </>
                            ) : (
                                <>
                                    <a href="#features" className="px-4 py-2 rounded-full text-sm font-medium transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-100">Features</a>
                                    <a href="#privacy" className="px-4 py-2 rounded-full text-sm font-medium transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-100">Privacy</a>
                                </>
                            )}
                        </div>

                        {/* Desktop Right Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            {user ? (
                                <>
                                    <Link 
                                        to="/journal/new" 
                                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                    >
                                        + New Entry
                                    </Link>
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                                        <Bell className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                                            {getInitials(user.name)}
                                        </div>
                                        <button 
                                            onClick={() => setShowLogoutModal(true)}
                                            className="text-gray-400 hover:text-rose-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                            title="Logout"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] flex items-center">
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-purple-900/20"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center gap-2">
                            {user && (
                                <button className="text-gray-400 hover:text-gray-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                                    <Bell className="w-5 h-5" />
                                </button>
                            )}
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-500 hover:text-gray-900 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-50 rounded-full"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-[64px] left-0 w-full bg-white border-b border-gray-200 shadow-xl flex flex-col py-2 px-4 z-40 max-h-[calc(100vh-64px)] overflow-y-auto">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 mb-4 mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold shrink-0">
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="font-bold text-gray-900 truncate">{user.name || 'User'}</span>
                                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-1 mb-4">
                                    <NavLink to="/">Home</NavLink>
                                    <NavLink to="/dashboard">Dashboard</NavLink>
                                    <NavLink to="/mood">Mood Tracker</NavLink>
                                    <NavLink to="/journal">Journal</NavLink>
                                    <NavLink to="/ai-assistant">AI Assistant</NavLink>
                                    <NavLink to="/insights">Insights</NavLink>
                                    <NavLink to="/profile">Profile</NavLink>
                                </div>
                                
                                <div className="border-t border-gray-100 pt-4 pb-2 space-y-3">
                                    <Link 
                                        to="/journal/new" 
                                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full shadow-sm"
                                    >
                                        <PenSquare className="w-4 h-4" />
                                        New Entry
                                    </Link>
                                    <button 
                                        onClick={() => setShowLogoutModal(true)}
                                        className="flex items-center justify-center gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-medium px-4 py-3 rounded-xl w-full transition-colors border border-rose-100 bg-white"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-2 py-4">
                                <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Features</a>
                                <a href="#privacy" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Privacy</a>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl">Login</Link>
                                <Link 
                                    to="/register" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="bg-purple-600 text-center text-white px-4 py-3.5 rounded-xl text-base font-bold transition-colors mt-2 shadow-md"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Overlay */}
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowLogoutModal(false)}
                    ></div>
                    
                    {/* Modal Card */}
                    <div className="relative bg-white rounded-2xl p-6 w-full max-w-[380px] shadow-2xl animate-scale-in">
                        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                            <LogOut className="w-6 h-6 text-rose-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Sign out?</h2>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            You will need to sign in again to access your mental wellness dashboard and journal entries.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button 
                                onClick={() => setShowLogoutModal(false)}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors min-h-[44px] w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleLogoutConfirm}
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors min-h-[44px] shadow-sm shadow-rose-200 w-full sm:w-auto"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
