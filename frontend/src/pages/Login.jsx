import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Error states
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    // Clear errors when typing
    useEffect(() => {
        setEmailError('');
        setGeneralError('');
    }, [email]);

    useEffect(() => {
        setPasswordError('');
        setGeneralError('');
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        try {
            await login(email, password);
            toast.success("Welcome back!");
            navigate('/');
        } catch (err) {
            const status = err.response?.status;
            const errMsg = err.response?.data?.error?.toLowerCase() || "";

            if (!err.response) {
                setGeneralError("Connection error. Please check your internet and try again.");
            } else if (status === 401) {
                setPasswordError("Incorrect password. Please try again.");
            } else if (status === 400 && (errMsg.includes("user not found") || errMsg.includes("invalid email"))) {
                setEmailError("No account found with this email address.");
            } else if (status === 400 && errMsg.includes("email not confirmed")) {
                setEmailError("Please verify your email before signing in.");
            } else {
                setGeneralError("Sign in failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-800 border border-neutral-700 rounded-xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
                    <p className="text-neutral-400 mt-2">Sign in to your MindTrack AI account</p>
                </div>

                {generalError && (
                    <div className="mb-4 flex items-center gap-2 text-[#EF4444] text-[12px] bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        <AlertCircle size={14} />
                        <span>{generalError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-neutral-900 border ${emailError ? 'border-red-500' : 'border-neutral-700'} rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none`}
                            placeholder="you@example.com"
                        />
                        {emailError && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-[#EF4444] text-[12px]">
                                <AlertCircle size={14} />
                                <span>{emailError}</span>
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full bg-neutral-900 border ${passwordError ? 'border-red-500' : 'border-neutral-700'} rounded-lg px-4 py-2.5 pr-10 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#7C3AED] transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {passwordError && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-[#EF4444] text-[12px]">
                                <AlertCircle size={14} />
                                <span>{passwordError}</span>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-neutral-400 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
