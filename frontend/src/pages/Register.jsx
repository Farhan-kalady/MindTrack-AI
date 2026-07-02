import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { ScrambleIn, GlowCard, PrimaryButton, GhostButton, Watermark, MindTrackLogo, FadeIn } from '../components/ui/CinematicUI';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-hot-toast';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [consentGiven, setConsentGiven] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
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
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.email) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
        
        if (!formData.password) errors.password = 'Password is required';
        else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
        
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        if (!consentGiven) {
            errors.consent = 'You must agree to the data processing terms.';
        }
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
            const registerData = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                consent_given: consentGiven
            };
            
            await axiosInstance.post('/auth/register/', registerData);
            
            toast.success('Registration successful! Logging you in...');
            
            await login(formData.email, formData.password);
            
            navigate('/dashboard');
            
        } catch (err) {
            console.error('Registration error:', err);
            
            let errorMessage = 'Failed to register. Please try again later.';
            
            if (err.response?.data) {
                const data = err.response.data;
                if (data.email) {
                    setFormErrors({ email: data.email[0] });
                    errorMessage = 'There was an issue with your email.';
                } else if (data.password) {
                    setFormErrors({ password: data.password[0] });
                    errorMessage = 'There was an issue with your password.';
                } else if (data.detail) {
                    errorMessage = data.detail;
                }
            }
            
            setFormErrors(prev => ({ ...prev, submit: errorMessage }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10 font-mono">
            <Watermark text="JOIN" />
            
            <FadeIn className="w-full max-w-md relative z-10">
                <GlowCard className="p-8 sm:p-10">
                    <div className="text-center mb-10">
                        <div className="mx-auto w-12 h-12 flex items-center justify-center mb-6">
                            <MindTrackLogo size={40} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-widest uppercase mb-2">
                            <ScrambleIn text="Create Account" delay={100} />
                        </h2>
                        <p className="text-sm text-white/50">
                            Join MindTrack AI
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-white/30" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`block w-full pl-11 bg-white/5 border ${formErrors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C026D3] focus:ring-1 focus:ring-[#C026D3] transition-all`}
                                    placeholder="Full Name"
                                />
                            </div>
                            {formErrors.name && (
                                <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>
                            )}
                        </div>

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
                                <p className="mt-1 text-xs text-red-400">{formErrors.email}</p>
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
                                <p className="mt-1 text-xs text-red-400">{formErrors.password}</p>
                            )}
                        </div>
                        
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-white/30" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`block w-full pl-11 bg-white/5 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C026D3] focus:ring-1 focus:ring-[#C026D3] transition-all`}
                                    placeholder="Confirm Password"
                                />
                            </div>
                            {formErrors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-400">{formErrors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="flex items-start gap-3 mt-4">
                            <input
                                id="consent"
                                type="checkbox"
                                checked={consentGiven}
                                onChange={(e) => {
                                    setConsentGiven(e.target.checked);
                                    if (e.target.checked && formErrors.consent) {
                                        setFormErrors(prev => ({ ...prev, consent: '' }));
                                    }
                                }}
                                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#C026D3] focus:ring-[#C026D3] focus:ring-offset-0 focus:ring-1"
                            />
                            <label htmlFor="consent" className="text-xs text-white/60 leading-relaxed">
                                I consent to MindTrack AI processing my journal entries using Google Gemini for emotional analysis and wellness suggestions.
                            </label>
                        </div>
                        {formErrors.consent && (
                            <p className="mt-1 text-xs text-red-400">{formErrors.consent}</p>
                        )}

                        {formErrors.submit && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4">
                                <p className="text-sm text-red-400 text-center">{formErrors.submit}</p>
                            </div>
                        )}

                        <div className="pt-4">
                            <PrimaryButton 
                                type="submit" 
                                disabled={loading}
                                className="w-full flex justify-center py-4"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Create Account'
                                )}
                            </PrimaryButton>
                        </div>
                    </form>

                </GlowCard>

                <p className="mt-8 text-center text-sm text-white/50">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-[#C026D3] hover:text-[#DB2777] uppercase tracking-widest inline-flex items-center gap-1 group">
                        Sign in <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </p>
            </FadeIn>
        </div>
    );
}
