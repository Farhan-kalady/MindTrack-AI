import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';
import { 
    ScrambleIn, 
    FadeIn, 
    Watermark, 
    GlowCard 
} from '../components/ui/CinematicUI';

export default function AIAssistant() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: `Hi ${user?.name || 'there'}! I'm your MindTrack AI Assistant. I've been analyzing your recent journal entries. How can I help you reflect on your emotional journey today?`
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await axiosInstance.post('/assistant/chat/', { message: input });
            const aiMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: res.data.reply || "I couldn't generate a response."
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again later."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative font-mono min-h-screen flex flex-col">
            <Watermark text="ASSISTANT" />
            
            <div className="relative z-10 flex-grow flex flex-col">
                <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-widest uppercase mb-2">
                            <ScrambleIn text="AI Assistant" />
                        </h1>
                        <FadeIn delay={0.2} y={10}>
                            <p className="text-white/60">Chat with your personalized AI about your mental well-being.</p>
                        </FadeIn>
                    </div>
                    <FadeIn delay={0.3} y={10} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#C026D3]/10 border border-[#C026D3]/30 text-[#C026D3] text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(192,38,211,0.2)]">
                        <Sparkles className="w-4 h-4" />
                        <span>Gemini Powered</span>
                    </FadeIn>
                </div>

                <FadeIn delay={0.4} y={20} className="flex-grow flex flex-col min-h-[500px]">
                    <GlowCard className="flex-grow flex flex-col overflow-hidden relative">
                        {/* Chat Area */}
                        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth relative z-10 font-sans font-light scrollbar-hide">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 sm:gap-4`}>
                                        <div className="flex-shrink-0 mt-1">
                                            {msg.role === 'user' ? (
                                                <div className="w-8 h-8 rounded-full bg-[#C026D3]/20 flex items-center justify-center border border-[#C026D3]/30">
                                                    <User className="w-4 h-4 text-[#C026D3]" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                                    <Bot className="w-4 h-4 text-white/60" />
                                                </div>
                                            )}
                                        </div>
                                        <div className={`px-5 py-4 shadow-sm text-sm sm:text-base leading-relaxed ${
                                            msg.role === 'user' 
                                            ? 'bg-gradient-to-br from-[#7C3AED] to-[#C026D3] text-white border border-[#C026D3]/50 rounded-2xl rounded-tr-sm shadow-[0_0_20px_rgba(192,38,211,0.2)]' 
                                            : 'bg-white/5 border border-white/10 text-white/80 rounded-2xl rounded-tl-sm'
                                        }`}>
                                            <div className="prose prose-sm sm:prose-base max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:text-white/80 prose-strong:text-white prose-a:text-[#C026D3] font-sans font-light">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex max-w-[80%] gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                                <Bot className="w-4 h-4 text-white/60" />
                                            </div>
                                        </div>
                                        <div className="px-5 py-4 bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm h-[52px]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-[#0A0A0C]/50 backdrop-blur-md relative z-10">
                            <form onSubmit={handleSend} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about your emotional patterns..."
                                    className="w-full rounded-full pl-6 pr-14 py-3 sm:py-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C026D3] focus:ring-1 focus:ring-[#C026D3] transition-all text-sm font-sans"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 bg-gradient-to-r from-[#7C3AED] to-[#C026D3] hover:from-[#C026D3] hover:to-[#DB2777] disabled:from-white/10 disabled:to-white/10 disabled:text-white/30 text-white w-10 h-10 rounded-full transition-all flex items-center justify-center shadow-[0_0_15px_rgba(192,38,211,0.3)] hover:shadow-[0_0_20px_rgba(192,38,211,0.5)] disabled:shadow-none hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </GlowCard>
                </FadeIn>
            </div>
        </div>
    );
}
