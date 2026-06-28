import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JournalList from './pages/JournalList';
import NewJournal from './pages/NewJournal';
import Analytics from './pages/Analytics';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="spinner" style={{ display: 'block', borderColor: 'var(--primary)', borderTopColor: 'transparent', width: '40px', height: '40px' }}></div>
            </div>
        );
    }
    
    if (!user?.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

const Landing = () => {
    const { user } = useContext(AuthContext);
    if (user?.isAuthenticated) return <Navigate to="/dashboard" replace />;
    
    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
            <span style={{ background: 'rgba(217, 70, 239, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '9999px', fontSize: '14px', fontWeight: '600', marginBottom: '24px', display: 'inline-block' }}>Next-Gen Mental Wellness</span>
            <h1 style={{ fontSize: '48px', marginBottom: '24px', lineHeight: '1.2' }}>Analyze Your Mind with <br/><span className="gradient-text">MindTrack AI</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 48px', lineHeight: '1.6' }}>
                A secure, AI-powered journaling platform that tracks your moods, detects underlying emotional themes, and provides personalized wellness summaries.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <Link to="/register" className="btn btn-primary">Get Started Free ✨</Link>
                <Link to="/login" className="btn btn-secondary">Login to Dashboard</Link>
            </div>
        </div>
    );
};

const AppRoutes = () => {
    return (
        <>
            <div className="bg-glow-1"></div>
            <div className="bg-glow-2"></div>
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/journals" element={<ProtectedRoute><JournalList /></ProtectedRoute>} />
                <Route path="/journals/new" element={<ProtectedRoute><NewJournal /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            </Routes>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
