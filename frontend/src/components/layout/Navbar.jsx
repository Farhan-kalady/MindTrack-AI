import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Brain, LogOut, User, Bell, PenSquare } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const NavLink = ({ to, children }) => {
        const isActive = location.pathname === to || (location.pathname.startsWith(to) && to !== '/');
        
        // Exact match for root "/" to prevent it from always being active
        const isRootActive = location.pathname === '/' && to === '/';
        const finalActive = to === '/' ? isRootActive : isActive;

        return (
            <Link 
                to={to} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white h-[64px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-purple-600" />
                            </span>
                            <div className="flex flex-col leading-none">
                                <span>MindTrack <span className="text-purple-600">AI</span></span>
                                <span className="text-[10px] font-normal text-gray-500 mt-0.5">Your Mental Wellness Companion</span>
                            </div>
                        </Link>
                    </div>

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
                                <NavLink to="/features">Features</NavLink>
                                <NavLink to="/privacy">Privacy</NavLink>
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link 
                                    to="/journal/new" 
                                    className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                >
                                    + New Entry
                                </Link>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors ml-2">
                                    <Bell className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                                        {getInitials(user.name)}
                                    </div>
                                    <button 
                                        onClick={() => { logout().then(() => navigate('/login')); }}
                                        className="text-gray-400 hover:text-rose-500 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
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
                </div>
            </div>
        </nav>
    );
}
