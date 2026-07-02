import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export default function PublicNavbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white h-[64px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    {/* Left: MindTrack AI brain icon + name */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
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
                    <div className="flex items-center space-x-3">
                        <Link 
                            to="/login" 
                            className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
                </div>
            </div>
        </nav>
    );
}
