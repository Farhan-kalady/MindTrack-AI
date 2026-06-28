import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, BrainCircuit, LineChart, Sparkles } from 'lucide-react';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Column: Copy & CTA */}
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4" />
                            <span>Powered by Google Gemini</span>
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                            Your Mind, <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Analyzed.</span>
                        </h1>
                        
                        <p className="text-lg lg:text-xl text-neutral-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Journal your thoughts and let AI uncover your emotional patterns. Gain profound insights into your mental well-being automatically, every single day.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                            <Link 
                                to={user ? "/dashboard" : "/register"} 
                                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                            >
                                Start Journaling
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link 
                                to="/features" 
                                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-medium transition-all flex items-center justify-center gap-2"
                            >
                                View Demo
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Visual/Stats Cards */}
                    <div className="relative h-full min-h-[400px] flex items-center justify-center lg:justify-end">
                        <div className="relative w-full max-w-md perspective-1000">
                            {/* Floating Card 1 */}
                            <div className="absolute top-10 -left-10 lg:-left-20 w-64 bg-neutral-800/90 backdrop-blur-xl border border-neutral-700 rounded-2xl p-5 shadow-2xl animate-float-slow z-20">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <BrainCircuit className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">10+</p>
                                        <p className="text-sm text-neutral-400 font-medium">Emotions tracked</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Card 2 */}
                            <div className="absolute bottom-10 -right-4 w-64 bg-neutral-800/90 backdrop-blur-xl border border-neutral-700 rounded-2xl p-5 shadow-2xl animate-float-delayed z-20">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <LineChart className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">Weekly</p>
                                        <p className="text-sm text-neutral-400 font-medium">AI Insights & Trends</p>
                                    </div>
                                </div>
                            </div>

                            {/* Center App Mockup */}
                            <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-3xl overflow-hidden shadow-2xl opacity-80 rotate-3 transform transition-transform hover:rotate-0 duration-500">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                                <div className="p-6 relative z-10">
                                    <div className="w-full h-4 bg-neutral-800 rounded-full mb-6"></div>
                                    <div className="space-y-4">
                                        <div className="w-3/4 h-8 bg-neutral-700 rounded-lg"></div>
                                        <div className="w-full h-24 bg-neutral-800 rounded-lg"></div>
                                        <div className="w-1/2 h-8 bg-purple-600/30 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
