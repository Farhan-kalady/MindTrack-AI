import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back!");
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to login. Check your credentials.");
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            placeholder="you@example.com"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            placeholder="••••••••"
                        />
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
