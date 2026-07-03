import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { User, Settings, ShieldAlert, LogOut, Loader2, AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
    ScrambleIn, 
    FadeIn, 
    Watermark, 
    GlowCard, 
    PrimaryButton,
    GhostButton
} from '../components/ui/CinematicUI';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get('/users/me/');
                setProfileData(res.data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE') {
            toast.error("Please type DELETE to confirm.");
            return;
        }
        
        setIsDeleting(true);
        try {
            await axiosInstance.delete('/auth/delete-account/');
            toast.success("Your account has been deleted.");
            await logout();
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete account. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative font-mono min-h-screen">
            <Watermark text="PROFILE" />
            
            <div className="relative z-10">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-widest uppercase mb-2">
                        <ScrambleIn text="Account Settings" />
                    </h1>
                    <FadeIn delay={0.2} y={10}>
                        <p className="text-white/60">Manage your profile and preferences.</p>
                    </FadeIn>
                </div>

                <div className="space-y-6">
                    {/* Profile Info */}
                    <FadeIn delay={0.3} y={20}>
                        <GlowCard className="p-8">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-full bg-[#C026D3]/10 border border-[#C026D3]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(192,38,211,0.2)]">
                                    <User className="w-10 h-10 text-[#C026D3]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-widest">{user?.name}</h2>
                                    <p className="text-white/60 text-sm mt-1">{user?.email}</p>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                                        <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-2">Current Streak</p>
                                        <p className="text-3xl font-bold text-white font-sans">{profileData?.current_streak || 0} <span className="text-sm font-normal text-white/40">days</span></p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                                        <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-2">AI Data Consent</p>
                                        <p className="text-[#10B981] font-bold flex items-center gap-2 mt-2 uppercase tracking-widest text-sm">
                                            <ShieldAlert className="w-5 h-5" /> Granted
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </GlowCard>
                    </FadeIn>

                    {/* Logout */}
                    <FadeIn delay={0.4} y={20}>
                        <GlowCard className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-1">Sign Out</h3>
                                <p className="text-sm text-white/60">Log out of your account on this device.</p>
                            </div>
                            <GhostButton
                                onClick={handleLogout}
                                className="w-full sm:w-auto text-xs py-3 px-6 flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Log out
                            </GhostButton>
                        </GlowCard>
                    </FadeIn>

                    {/* Danger Zone */}
                    <FadeIn delay={0.5} y={20}>
                        <div className="border border-rose-500/30 bg-rose-500/5 rounded-[14px] p-8 shadow-[0_0_30px_rgba(244,63,94,0.05)] relative overflow-hidden backdrop-blur-md">
                            <h3 className="text-lg font-bold text-rose-500 uppercase tracking-widest mb-2">Danger Zone</h3>
                            <p className="text-sm text-white/60 mb-6 max-w-md font-sans font-light">
                                Permanently delete your account and all associated journal entries. This action cannot be undone.
                            </p>
                            <PrimaryButton
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/50 shadow-none w-full sm:w-auto text-xs py-3 px-6"
                            >
                                Delete Account
                            </PrimaryButton>
                        </div>
                    </FadeIn>
                </div>

                {/* Delete Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/80 backdrop-blur-xl">
                        <GlowCard className="border-rose-500/30 p-8 w-full max-w-md shadow-2xl relative">
                            <button 
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                                    <AlertTriangle className="w-6 h-6 text-rose-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-widest">Delete Account</h3>
                            </div>
                            
                            <p className="text-white/80 text-sm mb-6 leading-relaxed font-sans font-light">
                                Are you absolutely sure? This will delete all your journal entries, AI insights, and personal data <strong className="text-white font-bold">forever</strong>.
                            </p>
                            
                            <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-3">
                                    Please type <span className="text-rose-400 font-mono select-all">DELETE</span> to confirm.
                                </label>
                                <input 
                                    type="text"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    className="w-full bg-[#0A0A0C] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono uppercase"
                                    placeholder="DELETE"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                <GhostButton
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="w-full sm:w-auto text-xs py-3"
                                >
                                    Cancel
                                </GhostButton>
                                <PrimaryButton
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                                    className="bg-rose-600 text-white hover:bg-rose-500 border-none shadow-none flex items-center justify-center gap-2 w-full sm:w-auto text-xs py-3 px-6"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Forever'}
                                </PrimaryButton>
                            </div>
                        </GlowCard>
                    </div>
                )}
            </div>
        </div>
    );
}
