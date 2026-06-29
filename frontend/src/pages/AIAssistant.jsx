import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';

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
            const res = await axiosInstance.post('/chat/', { message: input });
            const aiMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                content: res.data.response || "I couldn't generate a response."
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("Failed to connect to the AI Assistant.");
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col bg-[#F5F5FA] animate-slide-up">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <Bot className="w-8 h-8 text-purple-600" />
                        AI Wellness Assistant
                    </h1>
                    <p className="text-gray-500 mt-1">Chat with your personalized AI about your mental well-being.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-medium shadow-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini Powered</span>
                </div>
            </div>

            <div className="flex-grow bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden relative">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-[100px] pointer-events-none" />

                {/* Chat Area */}
                <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth relative z-10">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 sm:gap-4`}>
                                <div className="flex-shrink-0">
                                    {msg.role === 'user' ? (
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
                                            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                        </div>
                                    )}
                                </div>
                                <div className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-sm text-sm sm:text-base ${
                                    msg.role === 'user' 
                                    ? 'bg-purple-600 text-white rounded-tr-sm' 
                                    : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm'
                                }`}>
                                    <div className="prose prose-sm sm:prose-base max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[80%] gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
                                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                    </div>
                                </div>
                                <div className="rounded-2xl px-5 py-4 bg-gray-50 border border-gray-100 rounded-tl-sm flex items-center gap-1.5 shadow-sm">
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
                <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-md relative z-10">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your emotional patterns..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-6 pr-14 py-3 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="absolute right-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 text-white p-2 rounded-full transition-colors flex items-center justify-center shadow-sm"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
