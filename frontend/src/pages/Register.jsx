import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [consentGiven, setConsentGiven] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!consentGiven) {
            toast.error("You must accept the AI data processing consent.");
            return;
        }
        
        setLoading(true);
        try {
            await register(email, password, name, consentGiven);
            toast.success("Account created successfully!");
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-800 border border-neutral-700 rounded-xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Create an account</h1>
                    <p className="text-neutral-400 mt-2">Start your mindful journey today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                        <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            placeholder="John Doe"
                        />
                    </div>

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
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-start mt-2">
                        <div className="flex items-center h-5">
                            <input 
                                id="consent" 
                                type="checkbox" 
                                required
                                checked={consentGiven}
                                onChange={(e) => setConsentGiven(e.target.checked)}
                                className="w-4 h-4 bg-neutral-900 border-neutral-700 rounded text-purple-600 focus:ring-purple-500 focus:ring-offset-neutral-800"
                            />
                        </div>
                        <label htmlFor="consent" className="ml-3 text-xs text-neutral-400">
                            I consent to having my journal entries analyzed by an AI (Google Gemini) to provide emotional insights. Data is not used to train the model.
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-neutral-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
