import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Journal from './pages/Journal';
import JournalNew from './pages/JournalNew';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import Navbar from './components/layout/Navbar';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#111827',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }} 
      />
      <div className="min-h-screen bg-[#F5F5FA] text-gray-900 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
            <Route path="/journal/new" element={<ProtectedRoute><JournalNew /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/mood" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><div className="p-8"><h1 className="text-2xl text-gray-900">Insights Coming Soon</h1></div></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
