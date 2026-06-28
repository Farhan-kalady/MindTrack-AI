import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await axiosInstance.post('/auth/login/', { email, password });
        const { access_token, refresh_token, user: userData } = response.data;
        
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        return response.data;
    };

    const register = async (email, password, name, consent_given) => {
        const response = await axiosInstance.post('/auth/register/', { 
            email, password, name, consent_given 
        });
        const { access_token, refresh_token, user: userData } = response.data;
        
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        return response.data;
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/auth/logout/');
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
