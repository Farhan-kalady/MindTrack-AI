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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">About the Developer</h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                            The mind behind MindTrack AI.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Main Bio & Skills (Left Side - 2 Columns) */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Bio Card */}
                            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(124,58,237,0.1)] transition-all duration-300 relative flex overflow-hidden">
                                <div className="w-1 absolute left-0 top-0 bottom-0 bg-[#7C3AED]"></div>
                                <div className="pl-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">👨‍💻 Who am I?</h3>
                                    <p className="text-gray-600 leading-relaxed text-[15px]">
                                        I am an AI/Data Science student and passionate full-stack developer who built MindTrack AI end-to-end. From conceptualizing the idea and designing the UI/UX, to developing the backend, frontend, integrating the AI features, and handling the final deployment — this project represents my comprehensive approach to software engineering.
                                    </p>
                                </div>
                            </div>

                            {/* Tech Stack Card */}
                            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(124,58,237,0.1)] transition-all duration-300 relative overflow-hidden">
                                <div className="w-1 absolute left-0 top-0 bottom-0 bg-[#7C3AED]"></div>
                                <div className="pl-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">🛠️ Tech Stack & Skills</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {[
                                            { title: "Frontend", skills: "React, Tailwind CSS", icon: "🎨" },
                                            { title: "Backend", skills: "Django, Django REST Framework", icon: "⚙️" },
                                            { title: "Database", skills: "Supabase (PostgreSQL)", icon: "🗄️" },
                                            { title: "AI / ML", skills: "Google Gemini API", icon: "🧠" },
                                            { title: "DevOps", skills: "Render, Vercel, Git/GitHub", icon: "🚀" },
                                            { title: "Languages", skills: "Python, JavaScript", icon: "💻" },
                                        ].map((stack, idx) => (
                                            <div key={idx}>
                                                <p className="text-[13px] font-bold text-purple-600 mb-2">{stack.icon} {stack.title}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {stack.skills.split(', ').map((skill, sIdx) => (
                                                        <span key={sIdx} className="px-3 py-1 bg-[#EDE9FE] text-[#7C3AED] text-xs font-semibold rounded-full">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Highlights Card */}
                            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(124,58,237,0.1)] transition-all duration-300 relative overflow-hidden">
                                <div className="w-1 absolute left-0 top-0 bottom-0 bg-[#7C3AED]"></div>
                                <div className="pl-2">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">✨ Highlights & What I Bring</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 text-gray-600 text-[15px]">
                                            <span className="text-purple-500 mt-0.5">✓</span>
                                            Built and deployed a full-stack AI-powered mental wellness platform solo during my internship at ZLAQA AI Labs.
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-600 text-[15px]">
                                            <span className="text-purple-500 mt-0.5">✓</span>
                                            Experience integrating LLM APIs (Gemini) for real-time emotion detection and personalized insights.
                                        </li>
                                        <li className="flex items-start gap-3 text-gray-600 text-[15px]">
                                            <span className="text-purple-500 mt-0.5">✓</span>
                                            Strong foundation in DSA and problem solving (active on LeetCode).
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info (Right Side - 1 Column) */}
                        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(124,58,237,0.1)] transition-all duration-300 relative overflow-hidden flex h-full">
                            <div className="w-1 absolute left-0 top-0 bottom-0 bg-[#7C3AED]"></div>
                            <div className="p-8 pl-10 flex-grow flex flex-col justify-center">
                                <div className="mb-8">
                                    <h3 className="text-[22px] font-bold text-gray-900 mb-2">Mohammed Farhan K</h3>
                                    <p className="text-[14px] text-gray-500 font-medium leading-relaxed">AI / Python Developer Intern @ ZLAQA AI Labs Pvt. Ltd.</p>
                                </div>
                                
                                <div className="space-y-5">
                                    <a href="mailto:farhancherushola@gmail.com" className="flex items-center gap-4 text-[14px] text-gray-600 hover:text-purple-600 transition-colors group">
                                        <div className="w-10 h-10 rounded-full bg-[#EDE9FE] group-hover:bg-purple-200 transition-colors flex items-center justify-center text-xl shrink-0">📧</div>
                                        <span className="break-all">farhancherushola@gmail.com</span>
                                    </a>
                                    <div className="flex items-center gap-4 text-[14px] text-gray-600">
                                        <div className="w-10 h-10 rounded-full bg-[#EDE9FE] flex items-center justify-center text-xl shrink-0">📱</div>
                                        <span>+91 9846465260</span>
                                    </div>
                                    <a href="https://github.com/Farhan-kalady/" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-[14px] text-gray-600 hover:text-purple-600 transition-colors group">
                                        <div className="w-10 h-10 rounded-full bg-[#EDE9FE] group-hover:bg-purple-200 transition-colors flex items-center justify-center text-xl shrink-0">🐙</div>
                                        <span>github.com/Farhan-kalady/</span>
                                    </a>
                                    <a href="#" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-[14px] text-gray-600 hover:text-purple-600 transition-colors group">
                                        <div className="w-10 h-10 rounded-full bg-[#EDE9FE] group-hover:bg-purple-200 transition-colors flex items-center justify-center text-xl shrink-0">💼</div>
                                        <span>LinkedIn — Mohammed Farhan K</span>
                                    </a>
                                </div>
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
