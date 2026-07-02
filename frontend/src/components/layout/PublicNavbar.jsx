import { Link } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function PublicNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white h-[64px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
                <div className="flex justify-between items-center h-full">
                    {/* Left: MindTrack AI brain icon + name */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                <Brain className="w-5 h-5 text-purple-600" />
                            </span>
                            <div className="flex flex-col leading-none">
                                <span>MindTrack <span className="text-purple-600">AI</span></span>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Features | Privacy */}
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</a>
                        <a href="#privacy" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Privacy</a>
                    </div>

                    {/* Right: Login (ghost pill button) | Get Started (purple pill button) */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link 
                            to="/login" 
                            className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors min-h-[44px] flex items-center"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center">
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
                </div>
            )}
        </nav>
    );
}
