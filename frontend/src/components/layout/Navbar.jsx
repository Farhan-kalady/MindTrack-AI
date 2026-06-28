import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PenSquare, LogOut, User } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const NavLink = ({ to, children }) => {
        const isActive = location.pathname === to || location.pathname.startsWith(to) && to !== '/';
        
        // Exact match for root "/" to prevent it from always being active
        const isRootActive = location.pathname === '/' && to === '/';
        const finalActive = to === '/' ? isRootActive : isActive;

        return (
            <Link 
                to={to} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    finalActive 
                        ? 'bg-neutral-800 text-white' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
            >
                {children}
            </Link>
        );
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <PenSquare className="w-4 h-4 text-white" />
                            </span>
                            MindTrack <span className="text-purple-500">AI</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-2">
                        {user ? (
                            <>
                                <NavLink to="/dashboard">Dashboard</NavLink>
                                <NavLink to="/journal">Journal</NavLink>
                                <NavLink to="/analytics">Analytics</NavLink>
                                <NavLink to="/assistant">Assistant</NavLink>
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
                                    className="hidden sm:flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-purple-900/20"
                                >
                                    <PenSquare className="w-4 h-4" />
                                    New Entry
                                </Link>
                                <div className="flex items-center gap-3 pl-4 border-l border-neutral-800">
                                    <Link to="/profile" className="text-neutral-400 hover:text-white transition-colors" title="Profile">
                                        <User className="w-5 h-5" />
                                    </Link>
                                    <button 
                                        onClick={logout}
                                        className="text-neutral-400 hover:text-rose-400 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
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
