import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { User, Settings, ShieldAlert, LogOut, Loader2, AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-slide-up">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Settings className="w-8 h-8 text-purple-500" />
                    Account Settings
                </h1>
                <p className="text-neutral-400 mt-1">Manage your profile and preferences.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Info */}
                <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center">
                            <User className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
                            <p className="text-neutral-400">{user?.email}</p>
                        </div>
                    </div>

                    <div className="border-t border-neutral-700 pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">Current Streak</p>
                                <p className="text-2xl font-bold text-white">{user?.streak_count || 0} <span className="text-sm font-normal text-neutral-400">days</span></p>
                            </div>
                            <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
                                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">AI Data Consent</p>
                                <p className="text-emerald-400 font-medium flex items-center gap-1">
                                    <ShieldAlert className="w-4 h-4" /> Granted
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-lg flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-white">Sign Out</h3>
                        <p className="text-sm text-neutral-400">Log out of your account on this device.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-neutral-700 hover:bg-neutral-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Log out
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="border border-rose-500/30 bg-rose-500/5 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-lg font-medium text-rose-500 mb-2">Danger Zone</h3>
                    <p className="text-sm text-neutral-400 mb-4">
                        Permanently delete your account and all associated journal entries. This action cannot be undone.
                    </p>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-rose-900/20"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-neutral-800 border border-rose-500/30 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        <button 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Delete Account</h3>
                        </div>
                        
                        <p className="text-neutral-300 text-sm mb-4 leading-relaxed">
                            Are you absolutely sure? This will delete all your journal entries, AI insights, and personal data <strong className="text-white">forever</strong>.
                        </p>
                        
                        <div className="bg-neutral-900 rounded-lg p-3 mb-6 border border-neutral-700">
                            <label className="block text-xs font-medium text-neutral-400 mb-2">
                                Please type <span className="text-rose-400 font-mono select-all">DELETE</span> to confirm.
                            </label>
                            <input 
                                type="text"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
                                placeholder="DELETE"
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Forever'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
