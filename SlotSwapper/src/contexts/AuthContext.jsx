import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { BASE_URL } from '../config';
import GlobalAlert from '../components/GlobalAlert';


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [alert, setAlert] = useState({ message: '', type: '', visible: false });
useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
}, [token]);


const logout = useCallback(() => setToken(null), []);


const showAlert = useCallback((message, type = 'error') => {
    setAlert({ message, type, visible: true });
    setTimeout(() => setAlert({ message: '', type: '', visible: false }), 3000);
}, []);


const api = useMemo(() => {
    const request = async (endpoint, method = 'GET', body = null) => {
        const url = `${BASE_URL}${endpoint}`;
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;


        const config = { method, headers };
        if (body && (method === 'POST' || method === 'PUT')) config.body = JSON.stringify(body);


        try {
            const response = await fetch(url, config);
            const data = await response.json();
            if (!response.ok) {
                const errorMessage = data.errors?.[0]?.msg || data.msg || 'An error occurred';
                throw new Error(errorMessage);
            }
            return data;
        } catch (error) {
            showAlert(error.message, 'error');
            throw error;
        }
    };


    return {
        get: (endpoint) => request(endpoint, 'GET'),
        post: (endpoint, body) => request(endpoint, 'POST', body),
        put: (endpoint, body) => request(endpoint, 'PUT', body),
        del: (endpoint) => request(endpoint, 'DELETE'),
    };
}, [token, showAlert]);


const value = { token, setToken, logout, api, showAlert };


return (
    <AuthContext.Provider value={value}>
        {children}
        <GlobalAlert a={alert} />
    </AuthContext.Provider>
);


};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};