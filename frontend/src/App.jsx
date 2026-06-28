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

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#262626',
            color: '#fff',
            border: '1px solid #404040',
          },
        }} 
      />
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/new" element={<JournalNew />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
