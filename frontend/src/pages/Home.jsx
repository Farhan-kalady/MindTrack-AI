import { Link } from 'react-router-dom';
import { PenSquare, Code, ExternalLink, BookOpen } from 'lucide-react';

export default function Home() {
    return (
        <div className="bg-[#F5F5FA] min-h-screen flex flex-col font-sans">
            {/* HERO SECTION */}
            <section className="relative z-10 py-12 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        {/* Left Column: Copy & CTA */}
                        <div className="space-y-6 text-center lg:text-left">
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                                <span className="text-[#111827]">Understand your mind.</span><br />
                                <span className="text-[#7C3AED]">Nourish</span>{' '}
                                <span className="text-[#10B981]">your</span>{' '}
                                <span className="text-[#111827]">well-being.</span>
                            </h1>
                            
                            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                MindTrack AI helps you track your moods, maintain journals, analyze patterns and get AI-powered insights for a healthier, happier you.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                                <Link 
                                    to="/register" 
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    📊 Track My Mood
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    <PenSquare className="w-4 h-4" />
                                    Write in Journal
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Hero Image */}
                        <div className="relative h-full flex items-center justify-center lg:justify-end">
                            <img 
                                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop" 
                                alt="Wellness Illustration" 
                                className="w-full h-auto max-h-[500px] object-cover rounded-3xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need for emotional wellness</h2>
                        <p className="text-gray-500 text-lg">From journaling to AI-powered insights — all in one place.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: '📝', title: 'Smart Journaling', desc: 'Write freely. AI reads between the lines.' },
                            { icon: '🧠', title: 'Emotion Detection', desc: 'Gemini AI detects your dominant emotion from every entry.' },
                            { icon: '📊', title: 'Mood Tracking', desc: 'Visualize your mood trends over 7 or 30 days.' },
                            { icon: '💡', title: 'Wellness Suggestions', desc: 'Personalized AI-generated advice after every entry.' },
                            { icon: '📈', title: 'Weekly Reports', desc: 'AI summarizes your emotional week with patterns and insights.' },
                            { icon: '🚨', title: 'Crisis Detection', desc: 'Distress signals detected. Helpline resources shown immediately.' },
                        ].map((feat, idx) => (
                            <div key={idx} className="group bg-white p-6 rounded-2xl border border-gray-200 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(124,58,237,0.1)] transition-all duration-300">
                                <div className="w-12 h-12 rounded-full bg-[#EDE9FE] flex items-center justify-center text-xl mb-4">
                                    {feat.icon}
                                </div>
                                <h3 className="text-[15px] font-bold text-gray-900 mb-2">{feat.title}</h3>
                                <p className="text-[13px] text-gray-500 leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-20 bg-[#F9FAFB]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-16">How it works</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 lg:gap-12">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center relative z-10 w-64">
                            <div className="w-16 h-16 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-purple-500/30">1</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">✍️ Write</h3>
                            <p className="text-gray-500 text-sm">Write your<br/>daily entry</p>
                        </div>

                        {/* Arrow */}
                        <div className="hidden md:block text-gray-300">
                            <svg className="w-12 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center relative z-10 w-64">
                            <div className="w-16 h-16 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-purple-500/30">2</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">🧠 AI Analyzes</h3>
                            <p className="text-gray-500 text-sm">Gemini detects<br/>your emotion</p>
                        </div>

                        {/* Arrow */}
                        <div className="hidden md:block text-gray-300">
                            <svg className="w-12 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center relative z-10 w-64">
                            <div className="w-16 h-16 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-purple-500/30">3</div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">📊 Understand</h3>
                            <p className="text-gray-500 text-sm">Track patterns,<br/>grow over time</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Built by</h2>
                    
                    <div className="max-w-[480px] mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 overflow-hidden text-left relative flex">
                        <div className="w-1 bg-[#7C3AED] flex-shrink-0"></div>
                        <div className="p-8 flex-grow">
                            <h3 className="text-[20px] font-bold text-gray-900 mb-1">Mohammed Farhan K</h3>
                            <p className="text-[14px] text-gray-500 mb-6 font-medium">AI / Python Developer Intern @ ZLAQA AI Labs Pvt. Ltd.</p>
                            
                            <div className="space-y-3">
                                <a href="mailto:farhancherushola@gmail.com" className="flex items-center gap-3 text-[13px] text-gray-600 hover:text-purple-600 transition-colors">
                                    <span className="text-lg">📧</span> farhancherushola@gmail.com
                                </a>
                                <div className="flex items-center gap-3 text-[13px] text-gray-600">
                                    <span className="text-lg">📱</span> +91 9846465260
                                </div>
                                <a href="https://github.com/Farhan-kalady/" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[13px] text-gray-600 hover:text-purple-600 transition-colors">
                                    <span className="text-lg">🐙</span> github.com/Farhan-kalady/
                                </a>
                                <a href="#" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[13px] text-gray-600 hover:text-purple-600 transition-colors">
                                    <span className="text-lg">💼</span> LinkedIn — Mohammed Farhan K
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA BANNER */}
            <section className="bg-gradient-to-r from-purple-700 to-purple-600 py-20 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Start understanding your mind today.</h2>
                    <p className="text-purple-100 text-lg mb-8">Free to use. Powered by Google Gemini AI.</p>
                    <Link 
                        to="/register" 
                        className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-purple-700 font-bold hover:bg-gray-50 transition-colors shadow-xl"
                    >
                        Get Started Free <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#111827] border-t border-[#1F2937]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#9CA3AF] text-sm font-medium">MindTrack AI — Your Mental Wellness Companion</p>
                    <div className="flex items-center gap-6">
                        <a href="https://github.com/Farhan-kalady/" className="text-[#9CA3AF] hover:text-white text-sm transition-colors flex items-center gap-1.5"><Code className="w-4 h-4"/> GitHub</a>
                        <a href="#" className="text-[#9CA3AF] hover:text-white text-sm transition-colors flex items-center gap-1.5"><ExternalLink className="w-4 h-4"/> Live URL</a>
                        <a href="#" className="text-[#9CA3AF] hover:text-white text-sm transition-colors flex items-center gap-1.5"><BookOpen className="w-4 h-4"/> Swagger Docs</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
