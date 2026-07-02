import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { ScrambleIn, GlowCard, PrimaryButton, GhostButton, Watermark, MindTrackLogo, FadeIn } from '../components/ui/CinematicUI';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
        if (!formData.password) errors.password = 'Password is required';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setFormErrors({
                submit: err.response?.data?.detail || 'Failed to login. Please check your credentials.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10 font-mono">
            <Watermark text="WELCOME" />
            
            <FadeIn className="w-full max-w-md relative z-10">
                <GlowCard className="p-8 sm:p-10">
                    <div className="text-center mb-10">
                        <div className="mx-auto w-12 h-12 flex items-center justify-center mb-6">
                            <MindTrackLogo size={40} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-2">
                            <ScrambleIn text="Sign In" delay={100} />
                        </h2>
                        <p className="text-sm text-white/50">
                            Continue to MindTrack AI
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-white/30" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`block w-full pl-11 bg-white/5 border ${formErrors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C026D3] focus:ring-1 focus:ring-[#C026D3] transition-all`}
                                    placeholder="Email address"
                                />
                            </div>
                            {formErrors.email && (
                                <p className="mt-2 text-xs text-red-400">{formErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-white/30" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`block w-full pl-11 pr-12 bg-white/5 border ${formErrors.password ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C026D3] focus:ring-1 focus:ring-[#C026D3] transition-all`}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-white/40 hover:text-white"
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>
                            {formErrors.password && (
                                <p className="mt-2 text-xs text-red-400">{formErrors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <div className="text-sm">
                                <a href="#" className="font-medium text-[#C026D3] hover:text-[#DB2777]">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {formErrors.submit && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                <p className="text-sm text-red-400 text-center">{formErrors.submit}</p>
                            </div>
                        )}

                        <div className="pt-2">
                            <PrimaryButton 
                                type="submit" 
                                disabled={loading}
                                className="w-full flex justify-center py-4"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Sign In'
                                )}
                            </PrimaryButton>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-[#0A0A0C] text-white/40 uppercase tracking-widest text-xs">
                                    Or
                                </span>
                            </div>
                        </div>

                        <div className="mt-8">
                            <GhostButton className="w-full flex items-center justify-center gap-3 py-3">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </GhostButton>
                        </div>
                    </div>
                </GlowCard>

                <p className="mt-8 text-center text-sm text-white/50">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-[#C026D3] hover:text-[#DB2777] uppercase tracking-widest inline-flex items-center gap-1 group">
                        Sign up <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </p>
            </FadeIn>
        </div>
    );
}
