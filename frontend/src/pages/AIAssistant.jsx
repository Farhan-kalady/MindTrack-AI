import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, Send, User, Sparkles } from 'lucide-react';

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

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Mock AI response for now
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: "I'm currently in demo mode, but in the future, I will use Google Gemini function calling to search through your past journal entries, identify complex emotional patterns, and provide personalized cognitive behavioral therapy (CBT) inspired insights."
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-4rem)] flex flex-col animate-slide-up">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Bot className="w-8 h-8 text-purple-500" />
                        AI Companion
                    </h1>
                    <p className="text-neutral-400 mt-1">Chat with your personalized AI about your mental well-being.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini Powered</span>
                </div>
            </div>

            <div className="flex-grow bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl flex flex-col overflow-hidden relative">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Chat Area */}
                <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth relative z-10">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 sm:gap-4`}>
                                <div className="flex-shrink-0">
                                    {msg.role === 'user' ? (
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-700 flex items-center justify-center">
                                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-300" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                                            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                                        </div>
                                    )}
                                </div>
                                <div className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm text-sm sm:text-base ${
                                    msg.role === 'user' 
                                    ? 'bg-purple-600 text-white rounded-tr-sm' 
                                    : 'bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-tl-sm'
                                }`}>
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[80%] gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                                    </div>
                                </div>
                                <div className="rounded-2xl px-5 py-4 bg-neutral-800 border border-neutral-700 rounded-tl-sm flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-neutral-800 bg-neutral-900/80 backdrop-blur-md relative z-10">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your emotional patterns..."
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-full pl-6 pr-14 py-3 sm:py-3.5 text-sm sm:text-base text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="absolute right-2 bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-700 disabled:text-neutral-500 text-white p-2 rounded-full transition-colors flex items-center justify-center"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
