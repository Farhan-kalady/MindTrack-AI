import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userId = localStorage.getItem('user_id');
        
        if (token) {
            setUser({ id: userId, isAuthenticated: true });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await apiClient.post('/auth/login/', { username, password });
            const { access, refresh, user_id } = response.data;
            
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user_id', user_id);
            
            setUser({ id: user_id, isAuthenticated: true });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await apiClient.post('/auth/register/', { username, email, password });
            const { access, refresh } = response.data;
            
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            setUser({ isAuthenticated: true });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
